import { useState, useEffect } from "react";
import ryznLogo from "@/assets/ryzn-logo.png";

const MUSCLE_PATHS = [
  { id: "m_delt_right", group: "shoulders", d: "m372.48596 203.93178c-3.5957947 -0.6938019 -5.6671143 -4.3372803 -5.968506 -10.40683c-0.3013916 -6.0695496 1.444458 -18.554245 4.160095 -26.010498c2.7156677 -7.456253 5.891083 -14.912079 12.133881 -18.727036c6.2427673 -3.8149567 18.546783 -4.509186 25.322815 -4.162735c6.7760315 0.34646606 14.639557 3.8136597 15.3333435 6.2414703c0.6937866 2.427826 -7.355652 5.2038574 -11.170593 8.32547c-3.814972 3.1215973 -8.552063 6.4160004 -11.719177 10.40419c-3.1670837 3.9881897 -5.202545 8.842957 -7.2834473 13.524933c-2.0809326 4.6819763 -1.7340393 11.098434 -5.202118 14.56694c-3.468048 3.4685059 -12.010498 6.9378815 -15.606293 6.244095z" },
  { id: "m_delt_left", group: "shoulders", d: "m579.852 204.67784c3.5958252 -0.6937866 5.6671143 -4.3372803 5.968506 -10.40683c0.3013916 -6.0695496 -1.444458 -18.554245 -4.160095 -26.010498c-2.7156372 -7.456253 -5.8910522 -14.912064 -12.13385 -18.727036c-6.242798 -3.8149567 -18.546814 -4.509186 -25.322815 -4.1627197c-6.776062 0.3464508 -14.639587 3.8136444 -15.333374 6.2414703c-0.6937866 2.4278107 7.355652 5.203842 11.170593 8.325455c3.8150024 3.1216125 8.552063 6.4160156 11.719177 10.40419c3.1671143 3.9881897 5.2025146 8.842972 7.2834473 13.524948c2.0809326 4.6819763 1.7340698 11.098419 5.2021484 14.566925c3.4680176 3.4685059 12.010498 6.9378815 15.606262 6.244095z" },
  { id: "m_chest_right", group: "chest", d: "m407.8607 189.3659c1.2139282 6.5892487 6.0695496 19.940948 14.566925 23.929138c8.4973755 3.9881897 28.440521 1.7340393 36.417328 0c7.976837 -1.7340393 9.6640625 -3.2948456 11.443573 -10.404205c1.779541 -7.1093597 0.92214966 -24.622482 -0.76638794 -32.25197c-1.6885376 -7.629486 -2.948822 -11.097107 -9.364838 -13.524933c-6.4160156 -2.4278107 -21.629059 -3.816269 -29.131226 -1.0419922c-7.5021973 2.7742767 -12.020996 12.138672 -15.881897 17.687668c-3.8609009 5.548996 -8.4973755 9.017059 -7.283478 15.606293z" },
  { id: "m_chest_left", group: "chest", d: "m544.4773 190.11197c-1.2139282 6.5892487 -6.06958 19.940948 -14.566956 23.929138c-8.4973755 3.9881897 -28.440521 1.7340393 -36.417328 0c-7.9768066 -1.734024 -9.664032 -3.2948303 -11.443573 -10.40419c-1.7795105 -7.109375 -0.92211914 -24.622498 0.76641846 -32.25197c1.6885376 -7.629486 2.948822 -11.097122 9.364838 -13.524948c6.415985 -2.4278107 21.629059 -3.816269 29.131195 -1.0419922c7.5021973 2.7742767 12.020996 12.138672 15.881897 17.687668c3.8609009 5.548996 8.4973755 9.017059 7.2835083 15.606293z" },
  { id: "m_arm_right", group: "arms", d: "m392.52545 201.8503c-4.6819763 3.2948303 -13.98645 6.588791 -18.72705 13.524933c-4.7406006 6.9361267 -9.022736 16.993439 -9.716522 28.091858c-0.6937866 11.098419 0.29263306 37.804886 5.5538025 38.498703c5.261139 0.6937866 20.290466 -22.197296 26.013123 -34.335968c5.7226562 -12.138672 7.282593 -29.82547 8.322845 -38.496063c1.0402222 -8.6706085 -0.17367554 -12.313644 -2.0813904 -13.527557c-1.9076843 -1.213913 -4.682831 2.9492493 -9.364807 6.244095z" },
  { id: "m_arm_left", group: "arms", d: "m559.8125 202.59636c4.682007 3.2948303 13.98645 6.588806 18.72705 13.524933c4.7406006 6.9361267 9.022766 16.993439 9.716553 28.091858c0.6937866 11.098434 -0.29266357 37.804916 -5.553833 38.498703c-5.2611084 0.6937866 -20.290466 -22.197296 -26.013123 -34.335968c-5.7226562 -12.138672 -7.282593 -29.825455 -8.322815 -38.496063c-1.0402222 -8.6706085 0.17364502 -12.313644 2.0813599 -13.527557c1.9077148 -1.213913 4.6828613 2.9492493 9.364807 6.244095z" },
  { id: "m_forearm_right", group: "forearms", d: "m357.919 267.40012c2.555542 1.0402222 6.5437317 13.005249 5.2020874 22.88974c-1.3416443 9.8845215 -9.656158 24.798798 -13.251953 36.417328c-3.5957947 11.618561 -7.629486 35.895447 -8.322845 33.293976c-0.6933594 -2.6015015 3.1224976 -36.24411 4.1627197 -48.902893c1.0402527 -12.658783 0.043762207 -19.766846 2.0787659 -27.049866c2.0349731 -7.28302 7.575653 -17.688538 10.131226 -16.648285z" },
  { id: "m_forearm_left", group: "forearms", d: "m594.41895 268.14618c-2.555542 1.0402222 -6.543701 13.005249 -5.2020874 22.88977c1.3416748 9.884491 9.656189 24.798767 13.251953 36.417297c3.5958252 11.618561 7.6295166 35.895447 8.322876 33.293976c0.6933594 -2.6015015 -3.1224976 -36.24411 -4.1627197 -48.902893c-1.0402832 -12.658783 -0.043762207 -19.766846 -2.0787964 -27.049866c-2.0349731 -7.28302 -7.5756226 -17.688538 -10.131226 -16.648285z" },
  { id: "m_trap_right", group: "upper_back", d: "m442.60434 244.8884c-1.7533569 -2.1635284 -1.3432617 -11.746368 2.691101 -15.765015c4.034363 -4.0186462 17.630768 -9.583237 21.515106 -8.346878c3.884369 1.2363586 3.6235657 12.210342 1.7910461 15.765015c-1.832489 3.5546722 -8.453186 4.171875 -12.786041 5.563019c-4.3328857 1.391159 -11.457855 4.9473877 -13.211212 2.7838593z" },
  { id: "m_trap_left", group: "upper_back", d: "m509.7336 245.63446c1.7533569 -2.1635284 1.3432922 -11.746368 -2.6910706 -15.765015c-4.034363 -4.0186462 -17.630768 -9.583237 -21.515137 -8.346878c-3.884369 1.2363586 -3.6235352 12.210342 -1.7910461 15.765015c1.8325195 3.5546722 8.453186 4.1718903 12.786072 5.563034c4.332855 1.3911438 11.457825 4.9473724 13.211182 2.783844z" },
  { id: "m_oblique_right", group: "core", d: "m378.72574 287.16794c-3.468048 3.2948303 -5.20166 2.0813599 -8.322815 7.2834473c-3.1211853 5.202118 -7.28302 13.177612 -10.404205 23.929138c-3.1211853 10.751526 -9.536743 37.80533 -8.322845 40.580048c1.2139282 2.7747192 10.924347 -15.261139 15.606323 -23.931763c4.6819763 -8.670593 8.4973755 -18.034119 12.485565 -28.091858c3.9881592 -10.057739 11.617218 -28.959747 11.4435425 -32.254578c-0.17364502 -3.2948608 -9.017487 9.190704 -12.485565 12.485565z" },
  { id: "m_oblique_left", group: "core", d: "m573.6122 287.914c3.4680786 3.2948303 5.201721 2.0813599 8.322876 7.2834473c3.1211548 5.202118 7.28302 13.177612 10.404175 23.929138c3.1212158 10.751526 9.536743 37.80533 8.322876 40.580048c-1.2139282 2.7747192 -10.924377 -15.261139 -15.606323 -23.931763c-4.682007 -8.670593 -8.4973755 -18.034119 -12.485596 -28.091858c-3.9881592 -10.057739 -11.6171875 -28.959747 -11.4435425 -32.254578c0.17364502 -3.2948608 9.017517 9.190704 12.485535 12.485565z" },
  { id: "m_ab_center_right", group: "core", d: "m444.55164 293.41092c4.161865 3.814972 19.423035 7.283905 23.931763 4.1627197c4.5087585 -3.1211548 7.282593 -19.074799 3.120758 -22.88974c-4.161865 -3.814972 -23.58313 -3.1211853 -28.091888 0c-4.508728 3.1211548 -3.122467 14.912048 1.0393677 18.72702z" },
  { id: "m_ab_center_left", group: "core", d: "m507.78632 294.15698c-4.161865 3.814972 -19.423004 7.283905 -23.931763 4.1627197c-4.5087585 -3.1211548 -7.282593 -19.074799 -3.1207275 -22.88974c4.161865 -3.814972 23.5831 -3.1211853 28.091858 0c4.508728 3.1211548 3.1224976 14.912048 -1.0393677 18.72702z" },
  { id: "m_ab_upper_right", group: "core", d: "m470.56265 264.27798c4.5087585 -3.9881897 4.5087585 -18.38144 0 -19.769028c-4.508728 -1.3875732 -22.543732 7.4553833 -27.05249 11.443573c-4.508728 3.988205 -4.508728 11.097977 0 12.48558c4.5087585 1.3875732 22.543762 -0.17193604 27.05249 -4.1601257z" },
  { id: "m_ab_upper_left", group: "core", d: "m481.7753 265.02405c-4.5087585 -3.9881897 -4.5087585 -18.38144 0 -19.769012c4.5087585 -1.3875885 22.543732 7.455368 27.05249 11.443573c4.5087585 3.9881897 4.5087585 11.097992 0 12.485565c-4.5087585 1.3875732 -22.543732 -0.17193604 -27.05249 -4.1601257z" },
  { id: "m_lower_ab_right", group: "core", d: "m420.34595 332.94626c4.290039 9.36438 20.070007 14.566925 22.88977 9.364838c2.8197632 -5.202118 -4.6290283 -28.438751 -5.9711304 -40.577423c-1.3420715 -12.138672 -2.0813599 -19.769043 -2.0813599 -32.25461c0 -12.485565 4.855652 -35.202103 2.0813599 -42.658783c-2.7742615 -7.4566956 -14.218292 -0.17367554 -18.72702 -2.0813751c-4.5087585 -1.9076996 -7.28479 -14.393692 -8.32547 -9.364822c-1.0406799 5.0288696 0.86746216 27.746277 2.0813599 39.538055c1.2139282 11.791779 3.8600159 18.20691 5.202118 31.212585c1.3420715 13.005707 -1.4396362 37.457153 2.8503723 46.821533z" },
  { id: "m_lower_ab_left", group: "core", d: "m531.992 333.69232c-4.290039 9.36441 -20.069977 14.566925 -22.88977 9.364838c-2.8197632 -5.202118 4.6290283 -28.438751 5.9711304 -40.577423c1.342102 -12.138672 2.0813599 -19.769043 2.0813599 -32.25461c0 -12.485565 -4.855652 -35.202087 -2.0813599 -42.658783c2.774292 -7.4566956 14.218323 -0.17367554 18.72705 -2.0813599c4.508728 -1.9076996 7.28479 -14.393707 8.325439 -9.364838c1.0407104 5.0288696 -0.86743164 27.746277 -2.0813599 39.538055c-1.2139282 11.791779 -3.8599854 18.20691 -5.2020874 31.212616c-1.342102 13.005676 1.4396362 37.457123 -2.8504028 46.821503z" },
  { id: "m_hip_right", group: "core", d: "m469.5224 368.32306c-2.7747192 5.2025146 -8.79834 -6.934387 -12.485565 -14.564301c-3.6872253 -7.629944 -8.031494 -22.717865 -9.637787 -31.21524c-1.6062927 -8.4973755 -3.4680786 -17.167969 0 -19.769012c3.468048 -2.6010742 16.427368 0.8678894 20.80838 4.1627197c4.3810425 3.2948303 5.258545 5.3753357 5.4776917 15.606293c0.21917725 10.230988 -1.3880005 40.576996 -4.1627197 45.77954z" },
  { id: "m_hip_left", group: "core", d: "m482.81555 369.06912c2.7747192 5.202545 8.79834 -6.934387 12.485565 -14.564301c3.6872253 -7.629944 8.031494 -22.717865 9.637817 -31.21524c1.6062927 -8.4973755 3.468048 -17.167969 0 -19.769012c-3.4680786 -2.6010437 -16.427399 0.8678894 -20.80841 4.1627197c-4.381012 3.2948303 -5.258545 5.3753357 -5.4776917 15.606293c-0.21914673 10.230988 1.3880005 40.576996 4.1627197 45.77954z" },
  { id: "m_quad_right", group: "quads", d: "m426.58972 348.55362c-6.6636047 3.4685059 -12.7239685 25.146545 -15.010498 40.580048c-2.2865295 15.433502 -2.3674622 34.853455 1.2913208 52.020996c3.6588135 17.167542 16.356964 38.845154 20.661438 50.984253c4.3044434 12.139099 2.582672 26.879272 5.165344 21.850403c2.582672 -5.0288696 7.3180237 -36.243225 10.330719 -52.02362c3.0126648 -15.780426 7.3232727 -27.051636 7.745392 -42.658813c0.42214966 -15.607178 -0.18197632 -39.192017 -5.2125854 -50.984253c-5.0306396 -11.792206 -18.307526 -23.237518 -24.97113 -19.769012z" },
  { id: "m_quad_left", group: "quads", d: "m525.7482 349.29968c6.6636353 3.4685059 12.723999 25.146545 15.010498 40.580048c2.28656 15.433502 2.3674927 34.853455 -1.2913208 52.020996c-3.6588135 17.167542 -16.356934 38.845154 -20.661438 50.984253c-4.3044434 12.139099 -2.5826416 26.879242 -5.165344 21.850372c-2.582672 -5.028839 -7.3180237 -36.243195 -10.330688 -52.02359c-3.0126953 -15.780426 -7.3232727 -27.051636 -7.7454224 -42.658813c-0.42211914 -15.607147 0.18197632 -39.192017 5.212616 -50.984253c5.030609 -11.792206 18.307526 -23.237518 24.9711 -19.769012z" },
];

const EXERCISES = [
  { name: "Bench Press", sets: [{ w: 185, r: 10 }, { w: 185, r: 10 }] },
  { name: "Crunches", sets: [{ w: 0, r: 20 }, { w: 0, r: 20 }] },
];

const COLOR_GRAY = "rgba(50,50,58,0.35)";
const COLOR_BLUE = "rgba(59,130,246,0.75)";
const COLOR_GREEN = "rgba(34, 197, 94,0.85)";

const MUSCLE_STATES = [
  { arms: 2, forearms: 1, chest: 0, shoulders: 0, core: 0, upper_back: 0, quads: 0 },
  { arms: 2, forearms: 1, chest: 1, shoulders: 1, core: 0, upper_back: 0, quads: 0 },
  { arms: 2, forearms: 1, chest: 2, shoulders: 1, core: 0, upper_back: 0, quads: 0 },
  { arms: 2, forearms: 1, chest: 2, shoulders: 1, core: 1, upper_back: 0, quads: 0 },
  { arms: 2, forearms: 1, chest: 2, shoulders: 1, core: 2, upper_back: 0, quads: 0 },
];

function getMuscleColor(level: number) {
  if (level === 2) return COLOR_GREEN;
  if (level === 1) return COLOR_BLUE;
  return COLOR_GRAY;
}

export default function RYZNPhoneDemo() {
  const [step, setStep] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [comp, setComp] = useState(EXERCISES.map(e => e.sets.map(() => false)));
  const [restTime, setRestTime] = useState(0);
  const [resting, setResting] = useState(false);
  const [breath, setBreath] = useState("in");
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  const ex = EXERCISES[exIdx];
  const sets = comp[exIdx];
  const nextSet = sets.findIndex(s => !s);
  const allDone = sets.every(Boolean);
  const isLast = exIdx === EXERCISES.length - 1;
  const muscleState = MUSCLE_STATES[step] || MUSCLE_STATES[4];

  useEffect(() => {
    if (!resting || restTime <= 0) return;
    const t = setInterval(() => setRestTime(v => { if (v <= 1) { setResting(false); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [resting, restTime]);

  useEffect(() => {
    if (!resting) return;
    let p = "in", prog = 0;
    const t = setInterval(() => { prog += 2; if (prog >= 100) { prog = 0; p = p === "in" ? "hold" : p === "hold" ? "out" : "in"; } setBreath(p); }, 80);
    return () => clearInterval(t);
  }, [resting]);

  const completeSet = () => {
    if (nextSet === -1) return;
    setComp(prev => { const n = prev.map(a => [...a]); n[exIdx][nextSet] = true; return n; });
    setStep(s => Math.min(s + 1, 4));
    const isLastSet = nextSet === sets.length - 1;
    if (!(isLastSet && isLast)) { setRestTime(60); setResting(true); }
  };

  const nextExercise = () => { setExIdx(i => i + 1); setResting(false); setRestTime(0); };
  const skipRest = () => { setResting(false); setRestTime(0); };
  const finish = () => {
    setConfetti(Array.from({ length: 40 }, (_, i) => ({ id: i, x: Math.random() * 100, color: ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#a855f7"][Math.floor(Math.random() * 5)], delay: Math.random() * 0.6 })));
    setDone(true);
  };
  const reset = () => { setStep(0); setExIdx(0); setResting(false); setRestTime(0); setDone(false); setConfetti([]); setComp(EXERCISES.map(e => e.sets.map(() => false))); };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const gi = (g: string) => (muscleState as any)[g] || 0;

  return (
    <>
      <style>{`
        @keyframes ryzn-confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(660px) rotate(720deg); opacity: 0; } }
        @keyframes ryzn-bounce-in { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
        <div style={{ width: "100%", height: "100%", background: "#0D0D0F", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <img src={ryznLogo} alt="RYZN" style={{ position: "absolute", top: 8, right: 12, width: 40, height: 40, objectFit: "contain", zIndex: 10, filter: "brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(400%) hue-rotate(90deg) brightness(95%)", opacity: 0.85 }} />
        {done ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", position: "relative", overflow: "hidden" }}>
            {confetti.map(p => <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: -10, width: 6, height: 6, background: p.color, borderRadius: 2, animation: `ryzn-confetti-fall ${1.5 + Math.random()}s ease-in ${p.delay}s forwards` }} />)}
            <div style={{ fontSize: 60, marginBottom: 16, animation: "ryzn-bounce-in 0.5s ease" }}>🏆</div>
            <h2 style={{ color: "white", fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>Great Work!</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 20px" }}>Workout Complete</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {[{ v: "4", l: "Sets" }, { v: "2", l: "Exercises" }, { v: "3,700", l: "Volume" }].map(s => (
                <div key={s.l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <svg viewBox="330 80 300 440" width={130} height={190}>
              {MUSCLE_PATHS.map(m => <path key={m.id} d={m.d} fill={getMuscleColor(gi(m.group))} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" style={{ transition: "fill 0.6s" }} />)}
            </svg>
            <button onClick={reset} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, background: "#22c55e", color: "black", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Try Again</button>
          </div>
        ) : (
          <>
            <div style={{ padding: "8px 16px 4px" }}>
              <h1 style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0 }}>Chest & Abs</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, margin: 0 }}>Push Day</p>
            </div>

            {resting && (
              <div style={{ margin: "0 16px 6px", background: "rgba(59,130,246,0.12)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.25)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#3b82f6", fontSize: 11, fontWeight: 600 }}>{breath === "in" ? "Breathe In" : breath === "hold" ? "Hold" : "Breathe Out"}</span>
                  <span style={{ color: "rgba(59,130,246,0.5)", fontSize: 10 }}>•</span>
                  <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: 14 }}>{fmt(restTime)}</span>
                </div>
                <button onClick={skipRest} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(59,130,246,0.3)", background: "transparent", color: "rgba(59,130,246,0.8)", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>Skip</button>
              </div>
            )}

            <div style={{ padding: "0 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                {EXERCISES.map((_, i) => <div key={i} style={{ height: 6, borderRadius: 3, transition: "all 0.3s", width: i === exIdx ? 24 : 6, background: i === exIdx ? "#4ade80" : i < exIdx ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.15)" }} />)}
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h2 style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{ex.name}</h2>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>Set {Math.min(nextSet + 1, sets.length)} of {sets.length}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ex.sets.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: `1px solid ${sets[i] ? "rgba(34, 197, 94,0.2)" : "rgba(255,255,255,0.06)"}`, background: sets[i] ? "rgba(34, 197, 94,0.1)" : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", width: 20, color: sets[i] ? "#4ade80" : "rgba(255,255,255,0.3)" }}>{i + 1}</span>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                        {s.w > 0 && <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}>{s.w} lbs</span>}
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>×</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}>{s.r} reps</span>
                      </div>
                      {sets[i] ? (
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      ) : i === nextSet ? (
                        <button onClick={completeSet} style={{ width: 32, height: 32, borderRadius: 16, border: "2px solid rgba(34, 197, 94,0.4)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34, 197, 94,0.5)" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </button>
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {allDone && !isLast && (
                <button onClick={nextExercise} style={{ width: "100%", padding: 12, borderRadius: 12, background: "#22c55e", color: "black", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Next Exercise <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              )}
              {allDone && isLast && (
                <button onClick={finish} style={{ width: "100%", padding: 12, borderRadius: 12, background: "#22c55e", color: "black", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", marginBottom: 8 }}>
                  🎉 Finish Workout
                </button>
              )}

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 8, display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <svg viewBox="330 80 300 440" width={150} height={210}>
                  {MUSCLE_PATHS.map(m => <path key={m.id} d={m.d} fill={getMuscleColor(gi(m.group))} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" style={{ transition: "fill 0.8s ease" }} />)}
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
