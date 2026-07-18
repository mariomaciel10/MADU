import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import MuralFotos from "./components/MeuSentimento";

const FLOATIES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 10,
  size: 10 + Math.random() * 18,
  symbol: ["☽", "☾", "✦", "˚", "✧", "☽", "☽"][Math.floor(Math.random() * 7)],
  opacity: 0.15 + Math.random() * 0.35,
}));

function Floatie({ x, delay, duration, size, symbol, opacity }: (typeof FLOATIES)[0]) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        bottom: "-40px",
        fontSize: size,
        opacity,
        color: ["#e07fa8", "#c87dd6", "#b888e0", "#9b6ed4"][Math.floor(Math.random() * 4)],
      }}
      animate={{
        y: [0, -(window.innerHeight + 80)],
        x: [0, (Math.random() - 0.5) * 80],
        rotate: [0, (Math.random() - 0.5) * 30],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    >
      {symbol}
    </motion.div>
  );
}

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 4,
}));

function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "rgba(240, 168, 200, 0.6)",
          }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

const sections = [
  {
    id: "parabens",
    emoji: "",
    tag: "para você",
    heading: "Parabéns",
    sub: "feliz aniversário",
    body: "Hoje é muito especial. Ou amanhã? Talvez ontem... não sei mas eu comemoro a vida de uma pessoa incrível. O que torna você tão especial é justamente aquilo que faz de você ser diferente. Quero que saiba o quanto você é importante para mim e para tantas outras pessoas.Já ouvi pessoas como Stelina, Ray, Everson e Miranda falarem sobre o quanto você as ajudou e sobre sua contribuição para o laboratório de História. Isso mostra o impacto positivo que você deixa por onde passa. Sou muito grato por ter conhecido você. Mesmo que hoje a gente não converse tanto quanto antes, você continua sendo alguém que marcou minha vida e que sempre será lembrada com muito carinho.",
    color: "#e07fa8",
    badge: "para você ",
  },
  {
    id: "agradecimento",
    emoji: "",
    tag: "presente",
    heading: "o que eu gosto em você",
    sub: "e por isso que eu gosto de você",
    body: "Ter você na minha vida é um presente que recebo com muito carinho. Obrigado por cada momento, por cada conversa, por ser exatamente quem você é. Você faz tudo mais bonito só de existir, e eu sou muito grato por isso. 💕",
    color: "#c87dd6",
    badge: "presente ",
  },
  {
    id: "admiracao",
    emoji: "",
    tag: "minha adimiração",
    heading: "Você me inspira!",
    sub: "admiração de coração",
    body: "eu te adimiro tanto pela forma como você vive, não sei o que passa nessa cabeçinha linda mas ao meu ver só demonstra coragem, você não liga o que os outros pensam, e se liga esconde muito bem e eu acho que é isso que me faz te amar tanto só quero que saiba Eduarda, eu te amo muito",
    color: "#b888e0",
    badge: "minha adimiração",
  },
];

// --- Happy Birthday melody via Web Audio ---
const MELODY: [number, number][] = [
  [261, 0.3],[261, 0.3],[294, 0.6],[261, 0.6],[349, 0.6],[330, 1.0],
  [261, 0.3],[261, 0.3],[294, 0.6],[261, 0.6],[392, 0.6],[349, 1.0],
  [261, 0.3],[261, 0.3],[523, 0.6],[440, 0.6],[349, 0.6],[330, 0.6],[294, 1.0],
  [466, 0.3],[466, 0.3],[440, 0.6],[349, 0.6],[392, 0.6],[349, 1.2],
];

function playBirthday() {
  const audio = new Audio("/source.mp3");
  audio.volume = 0.5;
  audio.play();
}

// --- Phrases hidden under cups ---
const PHRASES = [
  { text: "Algumas pessoas são poesia escrita em forma de gente. Você é uma delas.", special: true },
  { text: "Se o amor tivesse um rosto, ele se pareceria com o brilho dos seus olhos.", special: false },
  { text: "Amar você é encontrar poesia até nos dias mais comuns.", special: false },
];

type CupPhase = "peek" | "shuffle" | "choose" | "reveal"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CupGame() {
  const [phase, setPhase] = useState<CupPhase>("peek")
  const [order, setOrder] = useState([0, 1, 2])  // indices into PHRASES
  const [lifted, setLifted] = useState<number | null>(null) // cup index lifted during peek
  const [chosen, setChosen] = useState<number | null>(null)
  const [shuffleStep, setShuffleStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const special = order.findIndex((pi) => PHRASES[pi].special)

  // On mount: peek phase — lift the special cup briefly
  useEffect(() => {
    setLifted(special);
    timerRef.current = setTimeout(() => {
      setLifted(null);
      timerRef.current = setTimeout(() => startShuffle(), 700);
    }, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []); // eslint-disable-line

  function startShuffle() {
    setPhase("shuffle");
    setShuffleStep(0);
  }

  // Perform 6 shuffle swaps
  useEffect(() => {
    if (phase !== "shuffle") return;
    if (shuffleStep >= 6) {
      timerRef.current = setTimeout(() => setPhase("choose"), 400);
      return;
    }
    timerRef.current = setTimeout(() => {
      setOrder((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 2);
        if (j >= i) j++;
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
      setShuffleStep((s) => s + 1);
    }, 380);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, shuffleStep]);

  function pick(cupIndex: number) {
    if (phase !== "choose") return;
    setChosen(cupIndex);
    setLifted(cupIndex);
    setPhase("reveal");
    if (order[cupIndex] === order[special] || cupIndex === special) {
      // found the special one
    }
    const phraseIdx = order[cupIndex];
    if (PHRASES[phraseIdx].special) {
      setTimeout(() => playBirthday(), 400);
    }
  }

  function reset() {
    setChosen(null);
    setLifted(null);
    setShuffleStep(0);
    setOrder(shuffle([0, 1, 2]));
    setPhase("peek");
    // re-trigger peek
    const newOrder = shuffle([0, 1, 2]);
    setOrder(newOrder);
    const newSpecial = newOrder.findIndex((pi) => PHRASES[pi].special);
    timerRef.current = setTimeout(() => {
      setLifted(newSpecial);
      timerRef.current = setTimeout(() => {
        setLifted(null);
        timerRef.current = setTimeout(() => startShuffle(), 700);
      }, 1200);
    }, 200);
  }

  const cupPositions = [0, 1, 2];

  return (
    <motion.div
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "#c87dd6", fontWeight: 400 }}>
        mini jogo
      </div>
      <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Fraunces', serif", color: "#ede0f8" }}>
        Qual copo esconde a frase?
      </h3>
      <p className="text-sm mb-8" style={{ color: "#9a7fa0", fontWeight: 300 }}>
        {phase === "peek" && "Memorize onde está a frase especial ✦"}
        {phase === "shuffle" && "Acompanhe o copo com os olhos... 👀"}
        {phase === "choose" && "Qual copo esconde a mensagem? Toque para descobrir! ✦"}
        {phase === "reveal" && (chosen !== null && PHRASES[order[chosen]].special
          ? "🎉 Você encontrou! A música é para você!"
          : "Ops! Não era esse... tente de novo ")}
      </p>

      {/* Cups */}
      <div className="relative flex justify-center gap-6 sm:gap-10 mb-8" style={{ height: 140 }}>
        {cupPositions.map((pos) => {
          const phraseIdx = order[pos];
          const phrase = PHRASES[phraseIdx];
          const isLifted = lifted === pos;
          const isChosen = chosen === pos;
          const isReveal = phase === "reveal";

          return (
            <div key={pos} className="relative flex flex-col items-center" style={{ width: 80 }}>
              {/* Phrase under cup */}
              <AnimatePresence>
                {isLifted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.35 }}
                    className="absolute text-center px-2 py-1.5 rounded-xl text-xs font-semibold"
                    style={{
                      bottom: 12,
                      width: 100,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: phrase.special ? "linear-gradient(135deg,#e07fa822,#c87dd633)" : "rgba(155,110,212,0.15)",
                      border: `1px solid ${phrase.special ? "#e07fa855" : "#9b6ed433"}`,
                      color: phrase.special ? "#e07fa8" : "#b888e0",
                      zIndex: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {phrase.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cup SVG */}
              <motion.button
                onClick={() => pick(pos)}
                disabled={phase !== "choose"}
                animate={{ y: isLifted ? -54 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                whileHover={phase === "choose" ? { y: -10, scale: 1.06 } : {}}
                style={{
                  background: "none",
                  border: "none",
                  cursor: phase === "choose" ? "pointer" : "default",
                  padding: 0,
                  position: "absolute",
                  bottom: 0,
                }}
              >
                <svg width="72" height="90" viewBox="0 0 72 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Cup body */}
                  <path
                    d="M10 18 L18 80 Q18 85 36 85 Q54 85 54 80 L62 18 Z"
                    fill={isChosen && isReveal
                      ? phrase.special ? "url(#cupSpecial)" : "url(#cupNormal)"
                      : phase === "choose" ? "url(#cupActive)" : "url(#cupBase)"}
                    stroke={phrase.special && isReveal && isChosen ? "#e07fa8" : "rgba(200,125,214,0.35)"}
                    strokeWidth="1.5"
                  />
                  {/* Cup rim */}
                  <rect x="6" y="12" width="60" height="10" rx="5"
                    fill={phase === "choose" ? "url(#rimActive)" : "url(#rimBase)"}
                    stroke="rgba(200,125,214,0.3)" strokeWidth="1"
                  />
                  {/* Shine */}
                  <ellipse cx="24" cy="32" rx="4" ry="10" fill="rgba(255,255,255,0.06)" transform="rotate(-10 24 32)" />
                  {/* Defs */}
                  <defs>
                    <linearGradient id="cupBase" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1e1530" />
                      <stop offset="100%" stopColor="#13101e" />
                    </linearGradient>
                    <linearGradient id="cupActive" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#251840" />
                      <stop offset="100%" stopColor="#1a1030" />
                    </linearGradient>
                    <linearGradient id="cupSpecial" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3d1a2e" />
                      <stop offset="100%" stopColor="#2a1040" />
                    </linearGradient>
                    <linearGradient id="cupNormal" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1a1030" />
                      <stop offset="100%" stopColor="#100c1e" />
                    </linearGradient>
                    <linearGradient id="rimBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2e1e4a" />
                      <stop offset="100%" stopColor="#1e1535" />
                    </linearGradient>
                    <linearGradient id="rimActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d2460" />
                      <stop offset="100%" stopColor="#2a1848" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Glow on hover when choosable */}
                {phase === "choose" && (
                  <div className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ boxShadow: "0 0 20px rgba(200,125,214,0.0)", transition: "box-shadow 0.2s" }} />
                )}
              </motion.button>

              {/* Number label */}
              <div className="absolute" style={{ bottom: -22, fontSize: 11, color: "#6a5580", fontFamily: "'Nunito', sans-serif" }}>
                {pos + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal all / Reset */}
      {phase === "reveal" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {/* Show all phrases */}
          <div className="flex gap-3 justify-center mb-6 flex-wrap">
            {cupPositions.map((pos) => {
              const phrase = PHRASES[order[pos]];
              return (
                <div key={pos} className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: phrase.special ? "rgba(224,127,168,0.15)" : "rgba(155,110,212,0.1)",
                    border: `1px solid ${phrase.special ? "rgba(224,127,168,0.3)" : "rgba(155,110,212,0.2)"}`,
                    color: phrase.special ? "#e07fa8" : "#9b6ed4",
                  }}>
                  Copo {pos + 1}: {phrase.text}
                </div>
              );
            })}
          </div>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #e07fa8, #c87dd6)",
              color: "#0d0b14",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(224,127,168,0.25)",
            }}
          >
            Jogar de novo ✦
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  const sec = sections[active];

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, #1a0d24 0%, #0d0b14 40%, #100c1a 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <StarField />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ left: "10%", top: "5%", width: 400, height: 400, transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(200,125,214,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute rounded-full" style={{ right: "5%", bottom: "20%", width: 350, height: 350, background: "radial-gradient(circle, rgba(224,127,168,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute rounded-full" style={{ left: "50%", top: "50%", width: 500, height: 500, transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(180,100,200,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Floating symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {FLOATIES.map((f) => <Floatie key={f.id} {...f} />)}
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 text-center pt-14 pb-6 px-6"
        initial={{ opacity: 0, y: -40 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.div
          className="text-6xl mb-4 inline-block"
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🖤
        </motion.div>

        <div className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c87dd6", fontWeight: 400, letterSpacing: "0.3em" }}>
          <span>um presente especial</span>
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight"
          style={{
            fontFamily: "'Fraunces', serif",
            background: "linear-gradient(135deg, #ede0f8 0%, #e07fa8 35%, #c87dd6 65%, #ede0f8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
         Feliz Aniversário
        </h1>

        <div className="text-xl sm:text-2xl mt-2 font-light italic" style={{ fontFamily: "'Fraunces', serif", color: "#c87dd6" }}>
          Que seu dia seja tão especial quanto você é para mim 
        </div>

        <motion.div
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={revealed ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="h-px w-16 sm:w-28" style={{ background: "linear-gradient(to right, transparent, #e07fa8)" }} />
          <span style={{ color: "#e07fa8", fontSize: 16 }}>♡</span>
          <span style={{ color: "#c87dd6", fontSize: 12 }}>✦</span>
          <span style={{ color: "#e07fa8", fontSize: 16 }}>♡</span>
          <div className="h-px w-16 sm:w-28" style={{ background: "linear-gradient(to left, transparent, #e07fa8)" }} />
        </motion.div>
      </motion.header>

      {/* Tab pills */}
      <motion.nav
        className="relative z-10 flex justify-center gap-2 sm:gap-3 px-4 mb-10 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className="relative px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-400"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
              border: `1.5px solid ${active === i ? s.color : "rgba(224,127,168,0.2)"}`,
              background: active === i ? `linear-gradient(135deg, ${s.color}22, ${s.color}44)` : "transparent",
              color: active === i ? s.color : "#9a7fa0",
              cursor: "pointer",
              boxShadow: active === i ? `0 0 20px ${s.color}30` : "none",
            }}
          >
            {s.emoji} {s.tag}
          </button>
        ))}
      </motion.nav>

      {/* Card */}
      <main className="relative z-10 max-w-xl mx-auto px-5 pb-24">
        <AnimatePresence mode="wait">
          <motion.article
            key={active}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative rounded-3xl overflow-hidden p-8 sm:p-10"
            style={{
              background: "linear-gradient(145deg, rgba(25,18,38,0.95), rgba(20,14,32,0.95))",
              border: `1.5px solid ${sec.color}30`,
              boxShadow: `0 0 60px ${sec.color}12, 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs px-3 py-1 rounded-full font-semibold tracking-wide"
                style={{ background: `${sec.color}18`, border: `1px solid ${sec.color}35`, color: sec.color, fontFamily: "'Nunito', sans-serif" }}>
                {sec.badge}
              </span>
              <motion.span
                className="text-3xl"
                animate={{ rotate: [-8, 8, -8], scale: [1, 1.12, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {sec.emoji}
              </motion.span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-1" style={{ fontFamily: "'Fraunces', serif", color: "#ede0f8" }}>
              {sec.heading}
            </h2>

            <div className="text-base italic mb-7 font-light" style={{ fontFamily: "'Fraunces', serif", color: sec.color }}>
              — {sec.sub}
            </div>

            <div className="h-px mb-7 rounded-full" style={{ background: `linear-gradient(to right, ${sec.color}60, transparent)` }} />

            {sec.id === "agradecimento" ? (
              <MuralFotos />
            ) : (
        <p
            className="text-base sm:text-lg leading-relaxed"
            style={{
              color: "#cdb8d4",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 300,
              lineHeight: 1.9,
            }}
            >
          {sec.body}
        </p>
)}

            <div className="flex justify-center gap-3 mt-10">
              {sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: active === i ? 28 : 8,
                    height: 8,
                    background: active === i ? `linear-gradient(to right, ${s.color}, ${s.color}aa)` : "rgba(154,127,160,0.25)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: active === i ? `0 0 10px ${s.color}60` : "none",
                  }}
                />
              ))}
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Cup Game */}
        <CupGame />

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="inline-flex items-center gap-2 text-sm" style={{ color: "rgba(200,125,214,0.5)", fontFamily: "'Nunito', sans-serif", fontWeight: 300 }}>
            <span>♡</span>
            <span style={{ letterSpacing: "0.15em", fontSize: 11, textTransform: "uppercase" }}>com muito carinho e amor</span>
            <span>♡</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
