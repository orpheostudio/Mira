import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --night:      #080609;
  --night2:     #0f0b10;
  --night3:     #181320;
  --night4:     #1f1828;
  --sakura:     #e8607a;
  --sakura2:    #f092a5;
  --sakura3:    #fcd0d8;
  --sakura-g:   rgba(232,96,122,0.14);
  --sakura-g2:  rgba(232,96,122,0.06);
  --white:      #fdf4f6;
  --white2:     #ecdde2;
  --muted:      #7a6068;
  --muted2:     #4a3840;
  --border:     rgba(232,96,122,0.2);
  --border2:    rgba(232,96,122,0.08);
  --border3:    rgba(253,244,246,0.08);
  --google:     #4285f4;
  --github:     #f0f6fc;
  --magic:      #c9b46a;
  --font-d: 'Shippori Mincho', serif;
  --font-b: 'Cormorant Garamond', serif;
  --font-u: 'Zen Kaku Gothic New', sans-serif;
}

html, body { height: 100%; }

body {
  background: var(--night);
  color: var(--white);
  font-family: var(--font-b);
  overflow: hidden;
  height: 100vh;
}

/* ── SCENE ── */
.scene {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── BG KANJI ── */
.bg-kanji {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
}

.bg-kanji-char {
  font-family: var(--font-d);
  font-weight: 800;
  font-size: min(88vw, 88vh);
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(232,96,122,0.055);
  line-height: 1;
  user-select: none;
  animation: kanjiRotate 40s linear infinite;
  letter-spacing: -0.05em;
}

@keyframes kanjiRotate {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(6deg) scale(1.04); }
  100% { transform: rotate(0deg) scale(1); }
}

/* ── GLOW ── */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

.bg-glow-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(232,96,122,0.09) 0%, transparent 65%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.bg-glow-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(201,180,106,0.07) 0%, transparent 65%);
  top: 20%; right: 15%;
  animation-delay: -3s;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

/* ── PETALS ── */
.petal {
  position: absolute;
  top: -40px;
  font-size: 14px;
  opacity: 0;
  animation: petalFall linear infinite;
  pointer-events: none;
  filter: blur(0.4px);
}

@keyframes petalFall {
  0%   { opacity: 0;   transform: translateY(0)      rotate(0deg)   translateX(0); }
  8%   { opacity: 0.5; }
  92%  { opacity: 0.25; }
  100% { opacity: 0;   transform: translateY(105vh)  rotate(480deg) translateX(60px); }
}

/* ── CARD ── */
.card-wrap {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.card {
  background: rgba(15,11,16,0.88);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border2);
  padding: 44px 40px 36px;
  position: relative;
  overflow: hidden;
  animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

/* corner ornaments */
.card::before,
.card::after {
  content: '';
  position: absolute;
  width: 24px; height: 24px;
  border-color: var(--sakura);
  border-style: solid;
  opacity: 0.35;
}
.card::before { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
.card::after  { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }

.card-inner-glow {
  position: absolute;
  top: -60px; left: 50%;
  transform: translateX(-50%);
  width: 280px; height: 180px;
  background: radial-gradient(ellipse, rgba(232,96,122,0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* ── LOGO ── */
.card-logo {
  text-align: center;
  margin-bottom: 28px;
}

.card-logo-name {
  font-family: var(--font-d);
  font-size: 32px;
  font-weight: 700;
  color: var(--white);
  letter-spacing: 0.04em;
  line-height: 1;
}

.card-logo-kanji {
  font-family: var(--font-d);
  font-size: 14px;
  color: var(--sakura);
  letter-spacing: 0.18em;
  margin-left: 8px;
  opacity: 0.85;
}

.card-logo-sub {
  font-family: var(--font-u);
  font-size: 9px;
  font-weight: 300;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 4px;
  display: block;
}

/* ── PAGE TOGGLE ── */
.page-toggle {
  display: flex;
  border: 1px solid var(--border2);
  margin-bottom: 28px;
  position: relative;
}

.page-toggle-bg {
  position: absolute;
  top: 0; bottom: 0;
  width: 50%;
  background: var(--sakura-g);
  border-bottom: 2px solid var(--sakura);
  transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  font-family: var(--font-u);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  position: relative;
  z-index: 1;
}

.toggle-btn.active { color: var(--sakura2); }

/* ── FORM WRAPPER ── */
.form-wrapper {
  position: relative;
  overflow: hidden;
}

.form-page {
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}

.form-page.hidden {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 0; left: 0; right: 0;
  transform: translateX(30px);
}

.form-page.visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── FIELD ── */
.field {
  margin-bottom: 14px;
}

.field-label {
  font-family: var(--font-u);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  display: block;
  margin-bottom: 6px;
}

.field-input-wrap {
  position: relative;
}

.field-input {
  width: 100%;
  background: var(--night4);
  border: 1px solid var(--border3);
  padding: 11px 14px 11px 38px;
  color: var(--white);
  font-family: var(--font-b);
  font-size: 15px;
  font-weight: 300;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  letter-spacing: 0.02em;
}

.field-input::placeholder {
  color: var(--muted2);
  font-style: italic;
}

.field-input:focus {
  border-color: var(--sakura);
  background: rgba(31,24,40,0.9);
}

.field-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  opacity: 0.35;
  pointer-events: none;
}

.field-input.no-icon { padding-left: 14px; }

.field-hint {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 11px;
  color: var(--muted2);
  margin-top: 4px;
  display: block;
}

.field-error {
  font-family: var(--font-u);
  font-size: 10px;
  color: var(--sakura);
  margin-top: 4px;
  display: block;
  letter-spacing: 0.06em;
}

/* ── PASSWORD TOGGLE ── */
.pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  padding: 2px;
  transition: color 0.2s;
}
.pw-toggle:hover { color: var(--sakura2); }

/* ── PSEUDÔNIMO ── */
.pseudo-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* ── FORGOT ── */
.forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
  margin-top: -6px;
}

.forgot-link {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: none;
}
.forgot-link:hover { color: var(--sakura2); }

/* ── PRIMARY BTN ── */
.btn-submit {
  width: 100%;
  background: var(--sakura);
  border: none;
  color: var(--night);
  padding: 13px;
  font-family: var(--font-u);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.45s;
}

.btn-submit:hover::before { transform: translateX(100%); }

.btn-submit:hover {
  background: var(--sakura2);
  box-shadow: 0 6px 28px rgba(232,96,122,0.38);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ── DIVIDER ── */
.or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.or-line {
  flex: 1;
  height: 1px;
  background: var(--border3);
}

.or-text {
  font-family: var(--font-u);
  font-size: 9px;
  font-weight: 300;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted2);
}

/* ── OAUTH BTNS ── */
.oauth-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 12px;
  background: var(--night4);
  border: 1px solid var(--border3);
  color: var(--white2);
  font-family: var(--font-u);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
}

.oauth-btn:hover {
  border-color: var(--border);
  background: rgba(31,24,40,0.9);
}

.oauth-btn.google:hover { border-color: rgba(66,133,244,0.4); color: #7eb3ff; }
.oauth-btn.github:hover { border-color: rgba(240,246,252,0.25); color: #f0f6fc; }

.oauth-icon {
  font-size: 14px;
  line-height: 1;
}

/* ── MAGIC LINK BTN ── */
.magic-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: var(--night4);
  border: 1px solid rgba(201,180,106,0.2);
  color: var(--magic);
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.magic-btn:hover {
  border-color: rgba(201,180,106,0.45);
  background: rgba(201,180,106,0.07);
  box-shadow: 0 0 16px rgba(201,180,106,0.12);
}

.magic-icon { font-size: 13px; }

/* ── MAGIC SENT ── */
.magic-sent {
  text-align: center;
  padding: 20px 0 8px;
  animation: fadeUp 0.4s ease both;
}

.magic-sent-icon { font-size: 36px; margin-bottom: 10px; display: block; }

.magic-sent-title {
  font-family: var(--font-d);
  font-size: 20px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 6px;
}

.magic-sent-body {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

.magic-sent-back {
  font-family: var(--font-u);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted2);
  cursor: pointer;
  margin-top: 14px;
  display: inline-block;
  transition: color 0.2s;
}
.magic-sent-back:hover { color: var(--sakura2); }

/* ── SUCCESS STATE ── */
.success-state {
  text-align: center;
  padding: 20px 0;
  animation: fadeUp 0.5s ease both;
}

.success-icon { font-size: 44px; margin-bottom: 12px; display: block; animation: bloom 0.6s ease both; }

@keyframes bloom {
  0%   { transform: scale(0.4) rotate(-20deg); opacity: 0; }
  60%  { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.success-title {
  font-family: var(--font-d);
  font-size: 24px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 6px;
}

.success-body {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 15px;
  color: var(--muted);
  line-height: 1.7;
}

.success-kanji {
  font-family: var(--font-d);
  font-size: 48px;
  color: var(--sakura);
  opacity: 0.15;
  display: block;
  margin-top: 8px;
  line-height: 1;
}

/* ── TERMS ── */
.terms-note {
  font-family: var(--font-b);
  font-style: italic;
  font-size: 11px;
  color: var(--muted2);
  text-align: center;
  line-height: 1.6;
  margin-top: 14px;
}

.terms-note a {
  color: var(--sakura);
  cursor: pointer;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.terms-note a:hover { opacity: 1; }

/* ── SWITCH LINK ── */
.switch-link {
  text-align: center;
  margin-top: 18px;
  font-family: var(--font-b);
  font-style: italic;
  font-size: 13px;
  color: var(--muted);
}

.switch-link a {
  color: var(--sakura2);
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;
}

.switch-link a:hover { color: var(--sakura3); }

/* ── CORNER BACK ── */
.back-link {
  position: fixed;
  top: 24px; left: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-u);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s;
  z-index: 20;
}

.back-link:hover { color: var(--sakura2); }

/* ── STEP INDICATOR (cadastro) ── */
.step-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
}

.step-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--night4);
  border: 1px solid var(--border);
  transition: all 0.3s;
}

.step-dot.active {
  background: var(--sakura);
  border-color: var(--sakura);
  box-shadow: 0 0 8px var(--sakura-g);
}

.step-dot.done {
  background: rgba(232,96,122,0.4);
  border-color: rgba(232,96,122,0.4);
}

/* ── PASSWORD STRENGTH ── */
.pw-strength {
  margin-top: 6px;
  display: flex;
  gap: 4px;
}

.pw-bar {
  height: 2px;
  flex: 1;
  background: var(--night4);
  border-radius: 2px;
  transition: background 0.3s;
}

.pw-bar.weak   { background: var(--sakura); }
.pw-bar.medium { background: var(--magic); }
.pw-bar.strong { background: #3ddc84; }

.pw-strength-label {
  font-family: var(--font-u);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 4px;
  display: block;
}

.pw-strength-label.weak   { color: var(--sakura); }
.pw-strength-label.medium { color: var(--magic); }
.pw-strength-label.strong { color: #3ddc84; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── RESPONSIVE ── */
@media (max-width: 480px) {
  .card { padding: 36px 24px 28px; }
  .oauth-grid { grid-template-columns: 1fr; }
  .pseudo-row { grid-template-columns: 1fr; }
}
`;

// ── helpers ──
function pwStrength(pw) {
  if (!pw) return null;
  if (pw.length < 6) return "weak";
  if (pw.length < 10 || !/[0-9]/.test(pw)) return "medium";
  return "strong";
}

const LABELS = { weak: "Fraca", medium: "Média", strong: "Forte" };

const PETALS_DATA = Array.from({ length: 14 }, (_, i) => ({
  left: Math.random() * 100,
  delay: Math.random() * 14,
  duration: 9 + Math.random() * 8,
  size: 10 + Math.random() * 8,
}));

// ── MAIN ──
export default function KakuAuth() {
  const [page, setPage] = useState("login"); // "login" | "register"
  const [magicSent, setMagicSent] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw]       = useState("");
  const [loginErr, setLoginErr]     = useState("");

  // register fields — step 1: credenciais, step 2: pseudônimo
  const [step, setStep]         = useState(1);
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw]       = useState("");
  const [regName, setRegName]   = useState("");
  const [regPseudo, setRegPseudo] = useState("");
  const [regErr, setRegErr]     = useState("");

  // magic
  const [magicEmail, setMagicEmail] = useState("");
  const [showMagic, setShowMagic]   = useState(false);

  const strength = pwStrength(page === "login" ? loginPw : regPw);

  function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPw) { setLoginErr("Preencha todos os campos."); return; }
    setLoginErr("");
    setSuccess(true);
  }

  function handleRegStep1(e) {
    e.preventDefault();
    if (!regEmail || !regPw) { setRegErr("Preencha todos os campos."); return; }
    if (regPw.length < 6)    { setRegErr("Senha muito curta."); return; }
    setRegErr("");
    setStep(2);
  }

  function handleRegStep2(e) {
    e.preventDefault();
    if (!regName) { setRegErr("Informe seu nome."); return; }
    setRegErr("");
    setSuccess(true);
  }

  function handleMagic(e) {
    e.preventDefault();
    if (!magicEmail) return;
    setMagicSent(true);
  }

  function switchPage(p) {
    setPage(p);
    setSuccess(false);
    setMagicSent(false);
    setShowMagic(false);
    setStep(1);
    setLoginErr(""); setRegErr("");
  }

  return (
    <>
      <style>{CSS}</style>

      <div className="scene">
        {/* bg kanji */}
        <div className="bg-kanji">
          <span className="bg-kanji-char">{page === "login" ? "書" : "始"}</span>
        </div>

        {/* glows */}
        <div className="bg-glow bg-glow-1" />
        <div className="bg-glow bg-glow-2" />

        {/* petals */}
        {PETALS_DATA.map((p, i) => (
          <div key={i} className="petal" style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}>🌸</div>
        ))}

        {/* back */}
        <div className="back-link">← Kaku 書く</div>

        {/* card */}
        <div className="card-wrap">
          <div className="card" key={page}>
            <div className="card-inner-glow" />

            {/* logo */}
            <div className="card-logo">
              <span className="card-logo-name">Kaku<span className="card-logo-kanji">書く</span></span>
              <span className="card-logo-sub">comunidade de escritores</span>
            </div>

            {/* toggle */}
            {!success && !magicSent && (
              <div className="page-toggle">
                <div className="page-toggle-bg" style={{ left: page === "login" ? "0%" : "50%" }} />
                <button className={`toggle-btn ${page === "login" ? "active" : ""}`} onClick={() => switchPage("login")}>Entrar</button>
                <button className={`toggle-btn ${page === "register" ? "active" : ""}`} onClick={() => switchPage("register")}>Criar conta</button>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {success && (
              <div className="success-state">
                <span className="success-icon">🌸</span>
                <div className="success-title">
                  {page === "login" ? "Bem-vindo de volta!" : "Bem-vindo ao Kaku!"}
                </div>
                <p className="success-body">
                  {page === "login"
                    ? "Suas histórias estavam com saudade. Redirecionando para o feed…"
                    : `É um prazer ter você aqui${regPseudo ? `, ${regPseudo}` : ""}. Seu perfil está sendo preparado…`}
                </p>
                <span className="success-kanji">{page === "login" ? "書" : "始"}</span>
              </div>
            )}

            {/* ── MAGIC SENT ── */}
            {magicSent && !success && (
              <div className="magic-sent">
                <span className="magic-sent-icon">✨</span>
                <div className="magic-sent-title">Link enviado!</div>
                <p className="magic-sent-body">
                  Enviamos um link mágico para <strong style={{color:"var(--white2)"}}>{magicEmail}</strong>.
                  <br />Clique nele para entrar — sem senha.
                </p>
                <span className="magic-sent-back" onClick={() => setMagicSent(false)}>← Voltar</span>
              </div>
            )}

            {/* ── LOGIN ── */}
            {page === "login" && !success && !magicSent && !showMagic && (
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label className="field-label">E-mail</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">✉</span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Senha</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">🔒</span>
                    <input
                      className="field-input"
                      type={showPw ? "text" : "password"}
                      placeholder="sua senha"
                      value={loginPw}
                      onChange={e => setLoginPw(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {loginErr && <span className="field-error">{loginErr}</span>}

                <div className="forgot-row">
                  <a className="forgot-link">Esqueceu a senha?</a>
                </div>

                <button className="btn-submit" type="submit">Entrar</button>

                <div className="or-divider">
                  <div className="or-line" />
                  <span className="or-text">ou continue com</span>
                  <div className="or-line" />
                </div>

                <div className="oauth-grid">
                  <button type="button" className="oauth-btn google">
                    <span className="oauth-icon">🌐</span> Google
                  </button>
                  <button type="button" className="oauth-btn github">
                    <span className="oauth-icon">🐙</span> GitHub
                  </button>
                </div>

                <button type="button" className="magic-btn" onClick={() => setShowMagic(true)}>
                  <span className="magic-icon">✨</span> Magic Link — sem senha
                </button>
              </form>
            )}

            {/* ── MAGIC LINK FORM ── */}
            {page === "login" && !success && !magicSent && showMagic && (
              <form onSubmit={handleMagic} style={{animation:"fadeUp 0.35s ease both"}}>
                <div className="field">
                  <label className="field-label">Seu e-mail</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">✨</span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="seu@email.com"
                      value={magicEmail}
                      onChange={e => setMagicEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <span className="field-hint">Enviaremos um link mágico — sem precisar de senha.</span>
                </div>
                <button className="btn-submit" type="submit" style={{marginTop:8}}>Enviar link mágico ✨</button>
                <button type="button" className="magic-btn" onClick={() => setShowMagic(false)}>← Voltar para login normal</button>
              </form>
            )}

            {/* ── REGISTER STEP 1 ── */}
            {page === "register" && !success && step === 1 && (
              <form onSubmit={handleRegStep1} style={{animation:"fadeUp 0.35s ease both"}}>
                <div className="step-dots">
                  <div className="step-dot active" />
                  <div className="step-dot" />
                </div>

                <div className="field">
                  <label className="field-label">E-mail</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">✉</span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="seu@email.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Senha</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">🔒</span>
                    <input
                      className="field-input"
                      type={showPw ? "text" : "password"}
                      placeholder="mínimo 6 caracteres"
                      value={regPw}
                      onChange={e => setRegPw(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {regPw && (
                    <>
                      <div className="pw-strength">
                        {["weak","medium","strong"].map((l, i) => {
                          const levels = {weak:1, medium:2, strong:3};
                          const filled = levels[strength] >= i+1;
                          return <div key={l} className={`pw-bar ${filled ? strength : ""}`} />;
                        })}
                      </div>
                      <span className={`pw-strength-label ${strength}`}>{LABELS[strength]}</span>
                    </>
                  )}
                </div>

                {regErr && <span className="field-error">{regErr}</span>}

                <button className="btn-submit" type="submit">Continuar →</button>

                <div className="or-divider">
                  <div className="or-line" />
                  <span className="or-text">ou crie com</span>
                  <div className="or-line" />
                </div>

                <div className="oauth-grid">
                  <button type="button" className="oauth-btn google">
                    <span className="oauth-icon">🌐</span> Google
                  </button>
                  <button type="button" className="oauth-btn github">
                    <span className="oauth-icon">🐙</span> GitHub
                  </button>
                </div>

                <p className="terms-note">
                  Ao criar sua conta você concorda com os <a>Termos de Uso</a> e a <a>Política de Privacidade</a> do Kaku.
                </p>
              </form>
            )}

            {/* ── REGISTER STEP 2 ── */}
            {page === "register" && !success && step === 2 && (
              <form onSubmit={handleRegStep2} style={{animation:"fadeUp 0.35s ease both"}}>
                <div className="step-dots">
                  <div className="step-dot done" />
                  <div className="step-dot active" />
                </div>

                <div className="field">
                  <label className="field-label">Seu nome</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">👤</span>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Como você se chama?"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Pseudônimo literário <span style={{opacity:0.5, fontStyle:"italic", textTransform:"none", letterSpacing:0}}>(opcional)</span></label>
                  <div className="field-input-wrap">
                    <span className="field-icon">✒️</span>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="ex: Ren The Writer"
                      value={regPseudo}
                      onChange={e => setRegPseudo(e.target.value)}
                    />
                  </div>
                  <span className="field-hint">É como você vai aparecer para outros escritores.</span>
                </div>

                {regErr && <span className="field-error">{regErr}</span>}

                <button className="btn-submit" type="submit">Criar minha conta 🌸</button>
                <button type="button" className="magic-btn" onClick={() => setStep(1)}>← Voltar</button>
              </form>
            )}

            {/* switch link */}
            {!success && !magicSent && (
              <div className="switch-link">
                {page === "login"
                  ? <>Novo por aqui? <a onClick={() => switchPage("register")}>Crie sua conta</a></>
                  : <>Já tem conta? <a onClick={() => switchPage("login")}>Entrar</a></>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
