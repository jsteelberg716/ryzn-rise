import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ArrowRight, Sparkles } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────
// ChatBubble
//
// Floating chat widget mounted globally. Bottom-right corner on every
// page (homepage hash anchors + /reviews / /privacy / /validation /
// /analytics). Backed by /api/chat (Edge runtime → OpenAI gpt-4o-mini)
// with a system prompt that knows everything about RYZN and can
// navigate the visitor to the right section via a `navigate` token
// returned alongside each message.
//
// Persistence: the entire conversation is held in component state and
// resets when the bubble is closed + reopened. Keeps things simple —
// no localStorage, no per-visitor history. If conversion data ever
// becomes interesting, sticking the transcript in Supabase is a one-
// page change.
// ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  navigate?: string | null;
}

const PRESET_QUESTIONS = [
  'What does RYZN do?',
  'How does the calorie engine work?',
  'How much does Pro cost?',
  'Does it work with Apple Watch?',
  'What makes it different from MyFitnessPal?',
  'Can I cancel anytime?',
];

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the latest message when the conversation grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  // Focus the input when the panel opens. Tiny delay so the focus
  // happens after the panel has finished its enter animation —
  // otherwise iOS Safari scrolls the page weirdly.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Send a single user message. Posts the full transcript so the
  // model sees prior context, then appends the response.
  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await r.json();
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          typeof data.text === 'string' && data.text.length > 0
            ? data.text
            : "Sorry, didn't catch that. Try again?",
        navigate: data.navigate ?? null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('[chat] request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Network hiccup. Try again in a sec, or shoot Jack an email at jackwork716@gmail.com.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Resolve a `navigate` token returned by the model into the right
  // routing call. Hash anchors live on the homepage; /reviews etc.
  // are full pages. If we're already on the homepage, scroll to the
  // anchor; otherwise, route to home with the hash so it scrolls
  // after mount.
  const handleNavigate = (slug: string) => {
    const anchorTargets = ['features', 'how-it-works', 'pricing', 'faq'];
    if (anchorTargets.includes(slug)) {
      if (location.pathname === '/') {
        const el = document.getElementById(slug);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate(`/#${slug}`);
      }
      return;
    }
    navigate(`/${slug}`);
    setOpen(false);
  };

  return (
    <>
      {/* Floating bubble — closed state */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[1500] w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent-green text-foreground shadow-xl shadow-accent-green/20 hover:shadow-accent-green/40 transition-shadow"
            aria-label="Open chat"
          >
            <MessageCircle size={22} className="text-foreground" />
            {/* Pulsing accent ring — slow + soft per Jack 2026-05-13.
                animate-ping is 1 s and reads as too urgent; 3 s feels
                like a heartbeat, not an alarm. */}
            <span
              className="absolute inset-0 rounded-full border-2 border-accent-green/50 pointer-events-none"
              style={{
                animation: 'chatBubblePulse 3s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[1500] w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-4rem))] rounded-[24px] glass-card border border-primary/10 flex flex-col overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-green flex items-center justify-center">
                  <Sparkles size={14} className="text-foreground" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">Ask RYZN</p>
                  <p className="text-[0.6875rem] text-muted-foreground">
                    Anything about the app
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation. `overscroll-contain` + the onWheel guard
                stop wheel/trackpad scrolling from leaking out to the
                page when the user is reading the transcript — per Jack
                2026-05-13. Inside the chat scrolls; outside doesn't. */}
            <div
              ref={scrollRef}
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 scroll-smooth"
            >
              {messages.length === 0 && <Welcome onPick={send} />}

              {messages.map((m) => (
                <MessageRow
                  key={m.id}
                  message={m}
                  onNavigate={handleNavigate}
                />
              ))}

              {loading && <TypingIndicator />}
            </div>

            {/* Persistent preset-question strip — visible above the
                input AFTER the first message has been sent. The Welcome
                block at the top handles the pre-chat state; this strip
                keeps the preset prompts reachable through the whole
                conversation per Jack 2026-05-13 ("those initial
                questions that appear should continue to appear after
                each chat"). Hidden during loading so it doesn't
                clutter the typing indicator. */}
            {messages.length > 0 && !loading && (
              <div className="px-3 pt-2 pb-1 border-t border-primary/[0.05]">
                <p className="text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground/60 px-1 mb-1.5">
                  Or try
                </p>
                <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
                  {PRESET_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[0.7rem] text-muted-foreground hover:text-foreground hover:bg-primary/[0.1] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="px-3 py-3 border-t border-primary/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-pill bg-primary/5 border border-primary/10 text-[0.875rem] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent-green/40 transition-colors disabled:opacity-60"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-green text-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Subcomponents ──────────────────────────────────────────────────

function Welcome({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[18px] glass-card border border-accent-green/20 p-4">
        <p className="text-sm text-foreground leading-relaxed">
          Hey — I know the whole app inside out. Ask me anything about RYZN,
          or pick one below to get going.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-muted-foreground/60 px-1">
          Common questions
        </p>
        {PRESET_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="text-left px-3.5 py-2.5 rounded-xl bg-primary/[0.04] hover:bg-primary/[0.08] border border-primary/10 text-[0.8125rem] text-muted-foreground hover:text-foreground transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageRow({
  message,
  onNavigate,
}: {
  message: ChatMessage;
  onNavigate: (slug: string) => void;
}) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[0.875rem] leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-primary to-accent-green text-foreground rounded-br-md'
              : 'glass-card border border-primary/10 text-foreground rounded-bl-md'
          }`}
        >
          {message.content}
        </div>

        {message.navigate && (
          <button
            onClick={() => onNavigate(message.navigate!)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[0.75rem] font-semibold text-accent-green border border-accent-green/30 hover:bg-accent-green/10 transition-colors"
          >
            Take me there
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-3 rounded-2xl rounded-bl-md glass-card border border-primary/10 flex items-center gap-1">
        <Dot delay={0} />
        <Dot delay={0.15} />
        <Dot delay={0.3} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
      transition={{ duration: 1, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

export default ChatBubble;
