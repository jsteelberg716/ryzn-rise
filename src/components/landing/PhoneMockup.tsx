const PhoneMockup = () => {
  return (
    <div className="w-[280px] sm:w-[320px] rounded-[40px] border-2 border-primary/20 bg-bg-primary overflow-hidden shadow-2xl">
      {/* Notch */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-24 h-5 bg-bg-tertiary rounded-full" />
      </div>

      <div className="px-4 pb-6 space-y-3">
        {/* Workout title */}
        <div className="flex items-center justify-between">
          <span className="text-foreground font-bold text-sm">Push Day</span>
          <span className="text-xs text-text-secondary">52 min</span>
        </div>

        {/* Exercise card */}
        <div className="bg-bg-secondary rounded-2xl p-3 border border-primary/[0.15]">
          <p className="text-foreground font-semibold text-sm">Bench Press</p>
          <div className="mt-2 space-y-1">
            {[
              { set: 1, weight: '185', reps: 8, done: true },
              { set: 2, weight: '185', reps: 8, done: true },
              { set: 3, weight: '185', reps: 7, done: true },
              { set: 4, weight: '185', reps: 6, done: false },
            ].map((s) => (
              <div key={s.set} className="flex items-center gap-2 text-xs">
                {s.done ? (
                  <span className="text-accent-green">✓</span>
                ) : (
                  <span className="text-text-tertiary">○</span>
                )}
                <span className="text-text-secondary">Set {s.set}</span>
                <span className="text-foreground font-medium ml-auto">{s.weight} lbs × {s.reps}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weight input */}
        <div className="flex items-center justify-between bg-bg-tertiary rounded-2xl p-3">
          <span className="text-text-secondary text-xs">Weight</span>
          <span className="text-foreground font-extrabold text-2xl">185</span>
          <span className="text-text-secondary text-xs">lbs</span>
        </div>

        {/* Rest timer */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-primary/20 text-primary text-sm font-semibold">
            ⏱ 1:45
          </span>
        </div>

        {/* Mini body silhouette */}
        <div className="flex justify-center pt-2">
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
            {/* Head */}
            <circle cx="40" cy="12" r="8" fill="#2A2A3A" opacity="0.6" />
            {/* Neck */}
            <rect x="37" y="20" width="6" height="6" rx="2" fill="#2A2A3A" opacity="0.6" />
            {/* Shoulders */}
            <ellipse cx="22" cy="30" rx="8" ry="5" fill="#4ECDC4" opacity="0.7" />
            <ellipse cx="58" cy="30" rx="8" ry="5" fill="#4ECDC4" opacity="0.7" />
            {/* Chest - overworked, glowing */}
            <ellipse cx="40" cy="38" rx="14" ry="10" fill="#FF6B6B" opacity="0.9" style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,107,0.6))' }} />
            {/* Arms */}
            <rect x="10" y="32" width="6" height="22" rx="3" fill="#45B7D1" opacity="0.6" />
            <rect x="64" y="32" width="6" height="22" rx="3" fill="#45B7D1" opacity="0.6" />
            {/* Core */}
            <rect x="32" y="48" width="16" height="16" rx="4" fill="#4ECDC4" opacity="0.5" />
            {/* Legs */}
            <rect x="28" y="66" width="10" height="28" rx="4" fill="#4ECDC4" opacity="0.7" />
            <rect x="42" y="66" width="10" height="28" rx="4" fill="#4ECDC4" opacity="0.7" />
            {/* Calves */}
            <rect x="29" y="96" width="8" height="18" rx="3" fill="#2A2A3A" opacity="0.6" />
            <rect x="43" y="96" width="8" height="18" rx="3" fill="#2A2A3A" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
