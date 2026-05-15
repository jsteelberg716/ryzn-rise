import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// =============================================================================
// /feedback — RYZN v2 questionnaire
//
// 8 questions with conditional logic on Q2 (frequency, shown only when the
// visitor reports active usage) and Q7 (friction, shown only when they
// don't). Q8 is open-ended and supports voice input via the Web Speech
// API — on mic-stop the raw transcript is sent to /api/grammar for an
// AI cleanup pass before being written back into the textarea.
//
// Submit calls /api/feedback (server-side Supabase insert). The admin
// "View Responses" panel from the prototype is removed — RLS on the
// `feedback_responses` table blocks anon reads, so responses are read
// via the Supabase dashboard.
// =============================================================================

type FieldKey =
  | 'using_app' | 'frequency' | 'food_logging' | 'lift_tracking'
  | 'favorite_feature' | 'would_recommend' | 'friction' | 'open_feedback';

interface FormState {
  using_app: string;
  frequency: string;
  food_logging: string;
  lift_tracking: string;
  favorite_feature: string;
  would_recommend: string;
  friction: string;
  open_feedback: string;
}

const EMPTY: FormState = {
  using_app: '', frequency: '', food_logging: '', lift_tracking: '',
  favorite_feature: '', would_recommend: '', friction: '', open_feedback: '',
};

// Option lists per question. Order matches the prototype.
const OPTIONS: Record<Exclude<FieldKey, 'open_feedback'>, Array<{ value: string; label: string }>> = {
  using_app: [
    { value: 'yes_regularly', label: 'Yes, regularly' },
    { value: 'yes_sometimes', label: 'Yes, sometimes' },
    { value: 'tried_once',    label: 'I tried it once or twice' },
    { value: 'not_yet',       label: 'Not yet' },
  ],
  frequency: [
    { value: 'daily',     label: 'Every day' },
    { value: 'few_week',  label: 'A few times a week' },
    { value: 'once_week', label: 'About once a week' },
    { value: 'rarely',    label: 'Rarely' },
  ],
  food_logging: [
    { value: 'yes_consistently', label: 'Yes, consistently' },
    { value: 'yes_sometimes',    label: 'Sometimes' },
    { value: 'tried_stopped',    label: 'I tried but stopped' },
    { value: 'never',            label: 'Never have' },
  ],
  lift_tracking: [
    { value: 'yes_every',  label: 'Yes, every workout' },
    { value: 'sometimes',  label: 'Sometimes' },
    { value: 'tried_once', label: 'Tried it once or twice' },
    { value: 'never',      label: 'Never have' },
  ],
  favorite_feature: [
    { value: 'calorie_engine',    label: 'Calorie calculation accuracy' },
    { value: 'workout_tracking',  label: 'Workout / lift tracking' },
    { value: 'food_logging',      label: 'Food logging' },
    { value: 'apple_watch',       label: 'Apple Watch integration' },
    { value: 'nfc',               label: 'NFC gym tag auto-logging' },
    { value: 'design',            label: 'Design / how it feels to use' },
    { value: 'nothing_yet',       label: "Haven't found one yet" },
  ],
  would_recommend: [
    { value: 'definitely', label: 'Definitely — already have' },
    { value: 'probably',   label: 'Probably' },
    { value: 'maybe',      label: 'Maybe, depends' },
    { value: 'not_yet',    label: 'Not yet' },
    { value: 'no',         label: 'No' },
  ],
  friction: [
    { value: 'forget',           label: 'I just forget to open it' },
    { value: 'confusing',        label: 'UI is confusing or unclear' },
    { value: 'too_much_input',   label: 'Takes too long to log things' },
    { value: 'missing_features', label: 'Missing features I need' },
    { value: 'bugs',             label: 'Bugs or crashes' },
    { value: 'other_app',        label: 'I use a different app' },
    { value: 'not_my_priority',  label: "Fitness tracking isn't my priority" },
  ],
};

// Web Speech API types live in lib.dom but TS strict configs sometimes
// miss the constructor. Re-declare just what we use.
type SpeechResult = { transcript: string; isFinal?: boolean };
interface SpeechRecLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: ((e: unknown) => void) | null;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<SpeechResult> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: ((e: unknown) => void) | null;
}

function getSpeechCtor(): null | (new () => SpeechRecLike) {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecLike;
    webkitSpeechRecognition?: new () => SpeechRecLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const Feedback = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'processing' | 'done' | 'error'>('idle');
  const [micStatusText, setMicStatusText] = useState('Tap to record');
  const speechCtor = useMemo(() => getSpeechCtor(), []);
  const recognitionRef = useRef<SpeechRecLike | null>(null);
  const sessionStartRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const usesApp = form.using_app === 'yes_regularly' || form.using_app === 'yes_sometimes';

  // ── Conditional field clearing ──────────────────────────────────
  // Wipe the hidden branch's value whenever using_app flips so a
  // user toggling between answers doesn't leave stale data in the
  // hidden field that then gets submitted.
  useEffect(() => {
    if (!form.using_app) return;
    setForm((prev) => ({
      ...prev,
      frequency: usesApp ? prev.frequency : '',
      friction:  usesApp ? '' : prev.friction,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.using_app]);

  // ── Speech recognition setup ─────────────────────────────────────
  useEffect(() => {
    if (!speechCtor) return;
    const r = new speechCtor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';

    r.onstart = () => {
      setIsRecording(true);
      setMicStatus('listening');
      setMicStatusText('Listening...');
      sessionStartRef.current = form.open_feedback.trim();
      finalTranscriptRef.current = '';
    };

    r.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0]?.transcript ?? '';
        if (res.isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      const combined =
        (sessionStartRef.current ? sessionStartRef.current + ' ' : '') +
        finalTranscriptRef.current +
        interim;
      setForm((prev) => ({ ...prev, open_feedback: combined }));
    };

    r.onerror = (event) => {
      setIsRecording(false);
      setMicStatus('error');
      if (event.error === 'no-speech') setMicStatusText('No speech detected');
      else if (event.error === 'not-allowed' || event.error === 'service-not-allowed')
        setMicStatusText('Mic access denied');
      else setMicStatusText('Error: ' + event.error);
      scheduleStatusReset();
    };

    r.onend = async () => {
      setIsRecording(false);
      const raw = (
        (sessionStartRef.current ? sessionStartRef.current + ' ' : '') +
        finalTranscriptRef.current
      ).trim();
      // Nothing new captured? Just reset.
      if (!raw || raw === sessionStartRef.current) {
        setMicStatus('idle');
        setMicStatusText('Tap to record');
        return;
      }
      // Run grammar cleanup. On failure, keep the raw transcript.
      setMicStatus('processing');
      setMicStatusText('Cleaning up grammar...');
      try {
        const resp = await fetch('/api/grammar', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text: raw }),
        });
        if (!resp.ok) throw new Error('Grammar failed: ' + resp.status);
        const data = (await resp.json()) as { text?: string };
        if (!data.text) throw new Error('Empty grammar response');
        setForm((prev) => ({ ...prev, open_feedback: data.text! }));
        setMicStatus('done');
        setMicStatusText('✓ Cleaned up — tap to add more');
      } catch (err) {
        console.error('[feedback] grammar cleanup failed', err);
        // Keep the user's raw transcript exactly as captured — never
        // wipe content on failure.
        setMicStatus('error');
        setMicStatusText("Saved as-is (couldn't auto-correct)");
      }
      scheduleStatusReset();
    };

    recognitionRef.current = r;
    return () => {
      try { r.stop(); } catch {/* ignore */}
      recognitionRef.current = null;
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechCtor]);

  const scheduleStatusReset = () => {
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => {
      setMicStatus('idle');
      setMicStatusText('Tap to record');
    }, 2500);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      try { recognitionRef.current.stop(); } catch {/* ignore */}
    } else {
      try { recognitionRef.current.start(); } catch {/* ignore */}
    }
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Required fields
    const requiredKeys: Exclude<FieldKey, 'frequency' | 'friction' | 'open_feedback'>[] = [
      'using_app', 'food_logging', 'lift_tracking', 'favorite_feature', 'would_recommend',
    ];
    for (const k of requiredKeys) {
      if (!form[k]) {
        setErrorMsg('Please answer all the required questions above.');
        return;
      }
    }
    if (usesApp && !form.frequency) {
      setErrorMsg('Please answer the frequency question.');
      return;
    }
    if (!usesApp && !form.friction) {
      setErrorMsg('Please tell us what made it hard to use.');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          using_app:        form.using_app,
          frequency:        usesApp ? form.frequency : null,
          food_logging:     form.food_logging,
          lift_tracking:    form.lift_tracking,
          favorite_feature: form.favorite_feature,
          would_recommend:  form.would_recommend,
          friction:         usesApp ? null : form.friction,
          open_feedback:    form.open_feedback.trim() || null,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Save failed' }));
        throw new Error(err.error ?? 'Save failed');
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[feedback] submit failed', err);
      setErrorMsg('Something went wrong saving. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="feedback-root">
      <div className="feedback-container">
        <div className="feedback-header">
          <Link to="/" className="feedback-logo">RY<span>Z</span>N</Link>
          <div className="feedback-tag">Feedback · v2</div>
        </div>

        {submitted ? (
          <div className="feedback-thanks">
            <div className="feedback-check">✓</div>
            <h2>Thank you</h2>
            <p>Every response shapes what comes next. Genuinely appreciated.</p>
            <Link to="/mobile" className="feedback-thanks-back">← Back to RYZN</Link>
          </div>
        ) : (
          <>
            <h1>Help us make RYZN better</h1>
            <p className="feedback-subtitle">
              Two minutes of your time. Your honesty shapes what we build next.
            </p>

            <form onSubmit={handleSubmit}>
              <QuestionCard
                num="01"
                kicker="Usage"
                text="Have you been using the app?"
                field="using_app"
                value={form.using_app}
                onChange={(v) => setForm((p) => ({ ...p, using_app: v }))}
              />

              {usesApp && (
                <QuestionCard
                  num="02"
                  kicker="Frequency"
                  text="How often do you open the app?"
                  field="frequency"
                  value={form.frequency}
                  onChange={(v) => setForm((p) => ({ ...p, frequency: v }))}
                />
              )}

              <QuestionCard
                num="03"
                kicker="Nutrition"
                text="Have you been logging your food?"
                field="food_logging"
                value={form.food_logging}
                onChange={(v) => setForm((p) => ({ ...p, food_logging: v }))}
              />

              <QuestionCard
                num="04"
                kicker="Training"
                text="Have you used it to track lifts / workouts?"
                field="lift_tracking"
                value={form.lift_tracking}
                onChange={(v) => setForm((p) => ({ ...p, lift_tracking: v }))}
              />

              <QuestionCard
                num="05"
                kicker="What works"
                text="Which feature has been most valuable to you?"
                field="favorite_feature"
                value={form.favorite_feature}
                onChange={(v) => setForm((p) => ({ ...p, favorite_feature: v }))}
              />

              <QuestionCard
                num="06"
                kicker="Recommendation"
                text="Would you recommend RYZN to a friend?"
                field="would_recommend"
                value={form.would_recommend}
                onChange={(v) => setForm((p) => ({ ...p, would_recommend: v }))}
              />

              {form.using_app && !usesApp && (
                <QuestionCard
                  num="07"
                  kicker="Friction"
                  text="What's made it hard to use? (Pick the biggest one)"
                  field="friction"
                  value={form.friction}
                  onChange={(v) => setForm((p) => ({ ...p, friction: v }))}
                />
              )}

              {/* Q8 — open mic */}
              <div className="feedback-card">
                <div className="feedback-qnum">08 · Open mic</div>
                <div className="feedback-qtext">
                  Anything else? Bugs, feature requests, raw reactions.
                </div>
                <div className="feedback-mic-wrap">
                  <textarea
                    name="open_feedback"
                    value={form.open_feedback}
                    onChange={(e) => setForm((p) => ({ ...p, open_feedback: e.target.value }))}
                    placeholder="Type or tap the mic to talk..."
                  />
                  {speechCtor ? (
                    <div className="feedback-mic-row">
                      <button
                        type="button"
                        className={`feedback-mic-btn ${isRecording ? 'recording' : ''}`}
                        onClick={toggleMic}
                        aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                          <line x1="12" y1="19" x2="12" y2="22"/>
                        </svg>
                      </button>
                      <div className={`feedback-mic-status status-${micStatus}`}>
                        {(micStatus === 'listening' || micStatus === 'processing') && (
                          <span className="feedback-mic-dot" />
                        )}
                        {micStatusText}
                      </div>
                    </div>
                  ) : (
                    <div className="feedback-mic-unsupported">
                      Voice input isn't supported in this browser. Try Safari or Chrome.
                    </div>
                  )}
                </div>
              </div>

              <div className="feedback-submit-row">
                <button type="submit" className="feedback-submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
              {errorMsg && <div className="feedback-error">{errorMsg}</div>}
            </form>
          </>
        )}
      </div>

      <FeedbackStyles />
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────

interface QuestionCardProps {
  num: string;
  kicker: string;
  text: string;
  field: Exclude<FieldKey, 'open_feedback'>;
  value: string;
  onChange: (v: string) => void;
}

const QuestionCard = ({ num, kicker, text, field, value, onChange }: QuestionCardProps) => (
  <div className="feedback-card">
    <div className="feedback-qnum">{num} · {kicker}</div>
    <div className="feedback-qtext">{text}</div>
    <div className="feedback-options">
      {OPTIONS[field].map((opt) => (
        <label key={opt.value} className="feedback-opt">
          <input
            type="radio"
            name={field}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className="feedback-opt-label">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

// All styles are local to this page — keeps the prototype's visual
// fidelity (dark glassmorphic, #22C55E green, Space Grotesk / Inter)
// without polluting site-wide CSS.
const FeedbackStyles = () => (
  <style>{`
    .feedback-root {
      background: #0a0a0a;
      color: #f5f5f5;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    .feedback-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at 20% 10%, rgba(34,197,94,0.08), transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(34,197,94,0.05), transparent 40%);
      pointer-events: none;
      z-index: 0;
    }
    .feedback-container {
      max-width: 720px;
      margin: 0 auto;
      padding: 60px 24px 100px;
      position: relative;
      z-index: 1;
    }
    .feedback-header {
      text-align: center;
      margin-bottom: 48px;
    }
    .feedback-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 28px;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      color: #f5f5f5;
      text-decoration: none;
      display: inline-block;
    }
    .feedback-logo span { color: #22C55E; }
    .feedback-tag {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #666;
      font-weight: 500;
      margin-top: 8px;
    }
    .feedback-container h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin: 32px 0 12px;
      text-align: center;
    }
    .feedback-subtitle {
      text-align: center;
      color: #a0a0a0;
      font-size: 16px;
      margin: 0 auto 48px;
      max-width: 480px;
    }
    .feedback-card {
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(34,197,94,0.12);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 20px;
      opacity: 0;
      transform: translateY(16px);
      animation: feedbackFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .feedback-card:nth-of-type(1) { animation-delay: 0.05s; }
    .feedback-card:nth-of-type(2) { animation-delay: 0.13s; }
    .feedback-card:nth-of-type(3) { animation-delay: 0.21s; }
    .feedback-card:nth-of-type(4) { animation-delay: 0.29s; }
    .feedback-card:nth-of-type(5) { animation-delay: 0.37s; }
    .feedback-card:nth-of-type(6) { animation-delay: 0.45s; }
    .feedback-card:nth-of-type(7) { animation-delay: 0.53s; }
    .feedback-card:nth-of-type(8) { animation-delay: 0.61s; }
    @keyframes feedbackFadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
    .feedback-qnum {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #22C55E;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .feedback-qtext {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 19px;
      font-weight: 600;
      line-height: 1.3;
      margin-bottom: 20px;
      letter-spacing: -0.01em;
    }
    .feedback-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .feedback-opt {
      display: block;
      position: relative;
      cursor: pointer;
    }
    .feedback-opt input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    .feedback-opt-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      font-size: 15px;
      color: #f5f5f5;
      transition: all 0.2s ease;
    }
    .feedback-opt-label::before {
      content: '';
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1.5px solid #666;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .feedback-opt:hover .feedback-opt-label {
      background: rgba(255,255,255,0.06);
      border-color: rgba(34,197,94,0.12);
    }
    .feedback-opt input:checked ~ .feedback-opt-label {
      background: rgba(34,197,94,0.08);
      border-color: rgba(34,197,94,0.25);
    }
    .feedback-opt input:checked ~ .feedback-opt-label::before {
      border-color: #22C55E;
      background: #22C55E;
      box-shadow: inset 0 0 0 3px #0a0a0a;
    }
    .feedback-card textarea {
      width: 100%;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 14px 16px;
      color: #f5f5f5;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      resize: vertical;
      min-height: 100px;
      transition: all 0.2s ease;
    }
    .feedback-card textarea:focus {
      outline: none;
      border-color: rgba(34,197,94,0.25);
      background: rgba(34,197,94,0.04);
    }
    .feedback-card textarea::placeholder { color: #666; }

    .feedback-mic-wrap { position: relative; }
    .feedback-mic-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    }
    .feedback-mic-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(34,197,94,0.08);
      border: 1px solid rgba(34,197,94,0.25);
      color: #22C55E;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
      flex-shrink: 0;
      position: relative;
    }
    .feedback-mic-btn:hover {
      background: rgba(34,197,94,0.15);
      transform: scale(1.05);
    }
    .feedback-mic-btn:active { transform: scale(0.95); }
    .feedback-mic-btn svg { width: 18px; height: 18px; }
    .feedback-mic-btn.recording {
      background: #22C55E;
      color: #000;
      border-color: #22C55E;
    }
    .feedback-mic-btn.recording::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid #22C55E;
      opacity: 0.5;
      animation: feedbackPulseRing 1.4s ease-out infinite;
    }
    @keyframes feedbackPulseRing {
      0%   { transform: scale(0.85); opacity: 0.6; }
      100% { transform: scale(1.3);  opacity: 0; }
    }
    .feedback-mic-status {
      font-size: 13px;
      color: #a0a0a0;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.02em;
    }
    .feedback-mic-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22C55E;
      margin-right: 6px;
      vertical-align: middle;
      animation: feedbackDotBlink 1s ease-in-out infinite;
    }
    .status-processing .feedback-mic-dot {
      background: #a0a0a0;
      animation: feedbackDotSpin 0.8s linear infinite;
    }
    @keyframes feedbackDotBlink {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.3; }
    }
    @keyframes feedbackDotSpin {
      0%   { transform: scale(0.5); opacity: 0.4; }
      50%  { transform: scale(1);   opacity: 1; }
      100% { transform: scale(0.5); opacity: 0.4; }
    }
    .feedback-mic-unsupported {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
      font-style: italic;
    }
    .feedback-submit-row {
      margin-top: 32px;
      display: flex;
      justify-content: center;
    }
    .feedback-submit {
      background: #22C55E;
      color: #000;
      border: none;
      padding: 16px 40px;
      border-radius: 12px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
      box-shadow: 0 4px 20px rgba(34,197,94,0.12);
    }
    .feedback-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(34,197,94,0.4);
    }
    .feedback-submit:active:not(:disabled) { transform: scale(0.97); }
    .feedback-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .feedback-error {
      color: #ef4444;
      font-size: 13px;
      margin-top: 16px;
      text-align: center;
    }
    .feedback-thanks {
      text-align: center;
      padding: 60px 20px;
      animation: feedbackFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
      opacity: 0;
    }
    .feedback-check {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(34,197,94,0.12);
      border: 1.5px solid #22C55E;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: #22C55E;
      font-size: 28px;
    }
    .feedback-thanks h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }
    .feedback-thanks p { color: #a0a0a0; }
    .feedback-thanks-back {
      display: inline-block;
      margin-top: 24px;
      color: #22C55E;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.04em;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600;
    }
    .feedback-thanks-back:hover { text-decoration: underline; }
  `}</style>
);

export default Feedback;
