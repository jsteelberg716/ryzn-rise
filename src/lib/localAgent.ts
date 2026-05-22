/// Local rules-based responder for the chat bubble. Ships in place
/// of an LLM call so the chatbot answers visitor questions without
/// needing the OpenAI API key on Vercel (which Jack is locked out of).
///
/// How it works:
///   1. The user's message is lower-cased + de-punctuated.
///   2. Each `Entry` declares a `keywords` set; an entry scores +1
///      for every keyword present in the message.
///   3. The highest-scoring entry above the minimum threshold wins.
///   4. If nothing scores, fall back to the unknown-topic message
///      that points the visitor at Jack's email.
///
/// To extend: add a new `Entry` to `ENTRIES`. Keep responses tight
/// (1-3 sentences), conversational, factually correct.

export interface LocalAgentReply {
  text: string;
  /// Anchor on `/` (e.g. `pricing`, `features`, `faq`) or a route
  /// (e.g. `scan`, `validation`, `privacy`). The ChatBubble's
  /// `handleNavigate` resolves both.
  navigate: string | null;
  /// How confident we are in the match. Above 0 means we matched
  /// something; 0 = unknown topic.
  confidence: number;
}

interface Entry {
  /// Keywords that, when present anywhere in the user message,
  /// score this entry. Multi-word keywords match as substrings.
  keywords: string[];
  /// The reply text. Markdown is fine; line breaks via \n.
  reply: string;
  /// Optional navigation target the visitor can click in the
  /// response card.
  navigate?: string;
  /// Manual score boost for entries that should win ties. Use
  /// sparingly — most entries score on keyword overlap alone.
  boost?: number;
}

const ENTRIES: Entry[] = [
  // ── What is RYZN ────────────────────────────────────────────────
  {
    keywords: [
      'what is', 'what does', 'tell me about', 'about ryzn',
      'about rise', 'what ryzn', 'what rise', 'explain',
      'overview', 'introduction', 'do you do', "what's ryzn",
    ],
    reply:
      "RYZN is the fitness app built for iPhone with a patent-pending thermodynamic calorie engine that actually works, real-time muscle maps, smart progressive overload, NFC-tag workout starts, and voice-first food logging. It's designed for serious lifters who want accuracy without the spreadsheet.",
    navigate: 'features',
  },

  // ── Pricing ─────────────────────────────────────────────────────
  {
    keywords: [
      'price', 'cost', 'pricing', 'how much', '$', 'subscription',
      'paid', 'free', 'trial', 'pay', 'fee', 'monthly', 'per month',
      'plan',
    ],
    reply:
      "RYZN Pro is $10/month with a 3-day free trial. No charge until day 4 — cancel during the trial and you pay nothing. After that, billing runs through Apple. Cancel anytime via Settings → Apple ID → Subscriptions.",
    navigate: 'pricing',
  },

  // ── Calorie engine ──────────────────────────────────────────────
  {
    keywords: [
      'calorie engine', 'calorie', 'calories', 'tdee', 'energy',
      'metabolism', 'metabolic', 'bmr', 'neat', 'tef', 'epoc',
      'thermodynamic', 'burn',
    ],
    reply:
      "RYZN's calorie engine models the physics of energy balance — BMR + thermic effect of food + NEAT (everyday movement) + EAT (your workouts) + EPOC (post-workout afterburn). Most apps just multiply weight by an activity-level constant. RYZN actually computes each component. Indirect-calorimetry validation in partnership with the University of Arizona Kinesiology Lab is planned for 2026.",
    navigate: 'validation',
  },

  // ── Apple Watch ─────────────────────────────────────────────────
  {
    keywords: [
      'apple watch', 'watch', 'watchos', 'wrist', 'companion',
      'heart rate', 'hr', 'pulse',
    ],
    reply:
      "Yes — RYZN ships with a native Apple Watch companion app. It pulls live heart rate during workouts, shows the current exercise + set count + idle calorie burn, and runs its own workout session for HR accuracy. Pairs automatically once you install both apps.",
  },

  // ── Voice food logging ──────────────────────────────────────────
  {
    keywords: [
      'voice', 'talk', 'speak', 'speaking', 'mic', 'microphone',
      'say', 'dictate', 'narrate', 'audio',
    ],
    reply:
      "Hold the mic, narrate your meal in plain English (\"half a chicken sandwich and a coke\"), let go. RYZN transcribes on-device with Apple Speech, then AI estimates calories + macros. You can refine in plain English too — say \"actually just half\" and the macros adjust live.",
  },

  // ── Photo food logging ──────────────────────────────────────────
  {
    keywords: [
      'photo', 'camera', 'picture', 'snap', 'image', 'scan food',
      'pic', 'photograph',
    ],
    reply:
      "Snap a photo of your meal. RYZN identifies the food, estimates portion sizes from visual cues, and returns calories + macros in about 2 seconds. Photo and voice work in the same flow — speak corrections after the snap if the AI got something wrong.",
  },

  // ── Muscle map ──────────────────────────────────────────────────
  {
    keywords: [
      'muscle map', 'muscle', 'body map', 'heatmap', 'visualization',
      'visualisation', 'anatomy', 'tracking muscles', 'split',
      'volume',
    ],
    reply:
      "After every set, your body lights up. RYZN tracks 16 muscle groups with biomechanical accuracy — green = optimal volume for the week, red = overworked, blue = underworked. Front and back views, tap to flip. Updates live during your workout.",
  },

  // ── Progression / smart overload ────────────────────────────────
  {
    keywords: [
      'progression', 'progressive overload', 'overload', 'ai suggest',
      'suggest weight', 'auto weight', 'smart weight', 'increase weight',
      'plateau', 'recommendation',
    ],
    reply:
      "Smart Progressive Overload is opt-in (Settings → Workout). The engine reads your last two sessions per exercise and follows textbook double-progression: hit your target reps at the same weight two sessions in a row, RYZN bumps the weight and resets to the floor reps. Stay at a weight until you crush it, then move up.",
  },

  // ── NFC tags / Ryzn Tag ─────────────────────────────────────────
  {
    keywords: [
      'tag', 'nfc', 'sticker', 'ryzn tag', 'ryzntag', 'tap',
      'scan tag', 'machine', 'puck',
    ],
    reply:
      "RYZN Tags are small NFC stickers placed on machines, racks, or benches. Tap your phone to a tag and the app opens straight to that exercise with last session's weight + sets prefilled — no menus, no typing. Try the live demo at ryznrise.com/scan.",
    navigate: 'scan',
  },

  // ── vs MyFitnessPal / competition ───────────────────────────────
  {
    keywords: [
      'myfitnesspal', 'mfp', 'lose it', 'fatsecret', 'cronometer',
      'noom', 'whoop', 'strong', 'hevy', 'compare', 'different',
      'vs', 'versus', 'better than', 'why ryzn', 'why use',
    ],
    reply:
      "Three big things set RYZN apart: (1) the calorie engine actually models physics — most apps just multiply weight by an activity-level constant; (2) voice-first food logging — speak the meal, no searching a database; (3) real-time muscle maps + progressive-overload AI that suggests when to add weight. Built for lifters who care about accuracy.",
    navigate: 'features',
  },

  // ── Cancel / refund ─────────────────────────────────────────────
  {
    keywords: [
      'cancel', 'refund', 'unsubscribe', 'stop subscription',
      'quit', 'leave', 'end subscription', 'money back',
    ],
    reply:
      "Cancel anytime — Settings → Apple ID → Subscriptions → RYZN → Cancel. For refunds, Apple handles billing for us; request through reportaproblem.apple.com. Cancel during the 3-day trial and you're charged $0.",
  },

  // ── Privacy ─────────────────────────────────────────────────────
  {
    keywords: [
      'privacy', 'private', 'data', 'secure', 'security', 'sell data',
      'share data', 'personal info', 'gdpr', 'ccpa', 'who sees',
    ],
    reply:
      "Your data stays yours. Voice is transcribed on-device with Apple Speech (audio never leaves your phone). Food photos + voice text get sent only to RYZN's AI analysis service — never sold, shared with advertisers, or used for ad targeting. Full policy: ryznrise.com/privacy.",
    navigate: 'privacy',
  },

  // ── iOS requirements ────────────────────────────────────────────
  {
    keywords: [
      'ios', 'iphone', 'requirements', 'compatible', 'android',
      'pixel', 'samsung', 'galaxy', 'web', 'pc', 'mac', 'windows',
      'version of ios',
    ],
    reply:
      "RYZN is iPhone-only — iOS 15.0+. No Android version planned right now (the app is built natively in SwiftUI to take full advantage of iOS hardware — HealthKit, NFC, the camera pipeline, on-device Speech). If you have an iPhone XS or newer, you're good.",
  },

  // ── Sign up / download ──────────────────────────────────────────
  {
    keywords: [
      'download', 'install', 'sign up', 'signup', 'register',
      'get app', 'get ryzn', 'app store', 'how to start',
      'how do i get', 'where can i get',
    ],
    reply:
      "Search 'RYZN' on the App Store, or hit the Get RYZN button on this page. iOS 15+ required. First-time setup is about 30 seconds — height, weight, goals, accent color — then you're in.",
  },

  // ── Cardio ──────────────────────────────────────────────────────
  {
    keywords: [
      'cardio', 'run', 'running', 'jog', 'bike', 'biking', 'cycling',
      'hike', 'hiking', 'walk', 'treadmill', 'gps', 'route',
      'outdoor',
    ],
    reply:
      "Yes — RYZN logs cardio (outdoor runs, walks, hikes, bike rides, indoor treadmill) with GPS route tracking, live pace, heart rate from Apple Watch, and calories computed by the engine rather than a generic MET table. Outdoor sessions save the route so you can review past runs.",
  },

  // ── HealthKit / Apple Health ────────────────────────────────────
  {
    keywords: [
      'healthkit', 'apple health', 'health app', 'health kit',
      'sync', 'integrate', 'integration', 'permissions', 'export',
    ],
    reply:
      "Yes — RYZN reads from Apple Health (height, weight, heart rate, sleep, prior workouts) and writes workouts back. Permissions are requested on first launch and are granular per data type — grant only what you want.",
  },

  // ── Gym tracking ────────────────────────────────────────────────
  {
    keywords: [
      'gym', 'save gym', 'home gym', 'multiple gyms', 'geofence',
      'auto finish', 'auto-finish', 'leave gym', 'arrive gym',
    ],
    reply:
      "Save a gym in RYZN (after your first workout there) and the app auto-finishes your strength workout when you leave the geofence — no more lost workouts from forgetting to tap Finish. Welcomes you back when you return. Multiple gyms supported — Settings → My Gyms.",
  },

  // ── Support / contact ───────────────────────────────────────────
  {
    keywords: [
      'contact', 'support', 'email', 'help', 'jack', 'issue',
      'bug', 'feedback', 'reach', 'talk to', 'who made',
      'developer',
    ],
    reply:
      "Email Jack directly — jackwork716@gmail.com. He responds same-day to most messages. For bug reports, include your iOS version + RYZN version (Settings → About) so he can repro fast.",
  },

  // ── FAQ ─────────────────────────────────────────────────────────
  {
    keywords: ['faq', 'frequently asked', 'common questions', 'questions'],
    reply:
      "There's a full FAQ section on this page — pricing, refunds, requirements, privacy, support. I can answer most of those directly too — try asking 'how much does it cost' or 'does it work with apple watch'.",
    navigate: 'faq',
  },

  // ── Reviews ─────────────────────────────────────────────────────
  {
    keywords: ['review', 'reviews', 'testimonial', 'rating', 'feedback from'],
    reply:
      "Reviews from early testers are at ryznrise.com/reviews. We're collecting more during the beta — if you want to leave one yourself, ryznrise.com/feedback.",
    navigate: 'reviews',
  },

  // ── Greetings ───────────────────────────────────────────────────
  {
    keywords: ['hello', 'hi', 'hey', 'yo', 'sup', 'howdy', 'greetings'],
    reply:
      "Hey! I'm RYZN's assistant — I can answer questions about the app: calorie engine, pricing, Apple Watch, voice food logging, NFC tags, anything. What's up?",
    boost: -1, // lose ties to topic-specific entries
  },

  // ── Thanks ──────────────────────────────────────────────────────
  {
    keywords: ['thanks', 'thank you', 'thx', 'ty', 'appreciate'],
    reply:
      "Anytime. If you need anything else, just ask — or hit Jack at jackwork716@gmail.com.",
    boost: -1,
  },
];

const FALLBACK: LocalAgentReply = {
  text:
    "Honest answer — I don't have a great match for that one. I cover the basics (pricing, Apple Watch, calorie engine, NFC tags, voice logging, muscle maps, cancel policy, privacy) pretty well. For anything else, email Jack at jackwork716@gmail.com — he replies same-day.",
  navigate: null,
  confidence: 0,
};

/// Score every entry against the user's message and pick the winner.
/// Returns a `LocalAgentReply` with `confidence: 0` if nothing
/// matched well enough.
export function respondLocally(userMessage: string): LocalAgentReply {
  const normalized = userMessage
    .toLowerCase()
    .replace(/[^\w\s$']/g, ' ') // strip punctuation except $ and apostrophe
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return FALLBACK;

  let bestScore = 0;
  let best: Entry | null = null;

  for (const entry of ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) score += 1;
    }
    if (score === 0) continue;
    const adjusted = score + (entry.boost ?? 0);
    if (adjusted > bestScore) {
      bestScore = adjusted;
      best = entry;
    }
  }

  if (!best || bestScore < 1) return FALLBACK;

  return {
    text: best.reply,
    navigate: best.navigate ?? null,
    confidence: bestScore,
  };
}
