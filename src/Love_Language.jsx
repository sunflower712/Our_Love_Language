import React, { useState } from "react";
import toast from "react-hot-toast";

// Plain React component without Tailwind or shadcn. Uses simple CSS classes defined below.
const MORSE_MAP = {
  "A": "...",
  "B": "..-",
  "C": "..+",
  "D": ".-.",
  "E": ".--",
  "F": ".-+",
  "G": ".+.",
  "H": ".+-",
  "I": ".++",
  "J": "-..",
  "K": "-.-",
  "L": "-.+",
  "M": "--.",
  "N": "---",
  "O": "--+",
  "P": "-+.",
  "Q": "-+-",
  "R": "-++",
  "S": "+..",
  "T": "+.-",
  "U": "+.+",
  "V": "+-.",
  "W": "+--",
  "X": "+-+",
  "Y": "++.",
  "Z": "++-",
  "❤️": "+++"
};

const REVERSE_MORSE = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

function ModeToggle({ mode, onChange }) {
  // a more realistic toggle with an animated slider and clear labels
  return (
    <div
      className="mode-toggle"
      role="tablist"
      aria-label="Encode or Decode mode"
    >
      <button
        className={`mode-btn ${mode === "encode" ? "active" : ""}`}
        onClick={() => onChange("encode")}
        aria-pressed={mode === "encode"}
        title="Encode mode"
      >
        <span className="mode-emoji">🔐</span>
        <span className="mode-label">Encode</span>
      </button>

      <div
        className={`mode-slider ${mode === "decode" ? "right" : "left"}`}
        aria-hidden="true"
      />

      <button
        className={`mode-btn ${mode === "decode" ? "active" : ""}`}
        onClick={() => onChange("decode")}
        aria-pressed={mode === "decode"}
        title="Decode mode"
      >
        <span className="mode-emoji">🔓</span>
        <span className="mode-label">Decode</span>
      </button>

      <style>{`
        .mode-toggle { position:relative; display:inline-flex; align-items:center; gap:8px; padding:6px; background:rgba(255,255,255,0.12); border-radius:999px; }
        .mode-btn { position:relative; z-index:2; border:0; background:transparent; color:rgba(255,255,255,0.95); padding:6px 10px; border-radius:999px; display:inline-flex; gap:8px; align-items:center; cursor:pointer; font-weight:700; }
        .mode-btn .mode-emoji { filter:drop-shadow(0 2px 4px rgba(0,0,0,0.12)); }
        .mode-slider { position:absolute; top:4px; bottom:4px; width:46%; left:4px; border-radius:999px; background:linear-gradient(90deg,#fff 0%, #fff 100%); opacity:0.12; transition:all 220ms cubic-bezier(.2,.9,.2,1); z-index:1; }
        .mode-slider.right { left:auto; right:4px; }
        .mode-btn.active { color:#111827; }
        @media (max-width:500px){ .mode-toggle{ padding:4px; } .mode-btn{ padding:6px 8px; font-size:13px; } }
      `}</style>
    </div>
  );
}

export default function PlainEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [showGuide, setShowGuide] = useState(false);

  function encodeToMorse(text) {
    const chars = text.toUpperCase();
    const encoded = [];
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      console.log(ch);
      if (MORSE_MAP.hasOwnProperty(ch)) encoded.push(MORSE_MAP[ch]);
      else if(ch == "❤") {encoded.push("+++"); i++;}
      else if(ch != "" && ch != " ") encoded.push("?");
      console.log(encoded);
    }
    return encoded.join(" ");
  }

  function decodeFromMorse(morse) {
    if (!morse) return "?";
    const tokens = morse.trim().split(" ");
    const decoded = tokens.map((t) => REVERSE_MORSE[t] ?? "?");
    return decoded.join("").replace(/\\/g, " ");
  }

  function handleRun() {
    if (mode === "encode") setOutput(encodeToMorse(input));
    else setOutput(decodeFromMorse(input));
  }

  function handleCopy() {
    try {
      navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
    } catch (e) {
      toast.error("Unable to copy.");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
  }

  function handleSwap() {
    setInput(output);
    setOutput("");
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  }

  return (
    <div className="ped-root">
      <style>{`
        .ped-root { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: linear-gradient(180deg,#fff5f8 0%, #f3f7ff 50%, #f0fff7 100%); display:flex; align-items:flex-start; justify-content:center; padding:50px 20px; margin:0; }
        .ped-card { width:100%; max-width:920px; background: #fff; border-radius:14px; box-shadow: 0 10px 30px rgba(99,102,241,0.08); overflow:hidden; border:1px solid rgba(0,0,0,0.03); }
        .ped-header { padding:22px 26px; background: linear-gradient(90deg,#ff9ccf 0%, #c792ff 50%, #79d7ff 100%); color:white; display:flex; align-items:center; justify-content:space-between; }
        .ped-title { margin:0; font-size:20px; font-weight:700; letter-spacing: -0.2px; }
        .ped-sub { margin-top:6px; font-size:13px; opacity:0.95; }
        .ped-body { padding:22px; background:linear-gradient(180deg,#ffffff 0%, #fffafc 100%); }
        .ped-grid { display:grid; grid-template-columns: 1fr 1fr; gap:18px; }
        .ped-label { display:block; margin-bottom:8px; font-size:13px; color:#374151; font-weight:600; }
        textarea.ped-input, textarea.ped-output { width:100%; min-height:120px; resize:vertical; padding:12px 14px; border-radius:10px; border:1px solid #f3e8ff; box-shadow: 0 2px 8px rgba(99,102,241,0.03); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; font-size:14px; }
        .ped-actions { margin-top:12px; display:flex; gap:10px; align-items:center; }
        .ped-btn { background:#fff; border: none; padding:8px 12px; border-radius:10px; cursor:pointer; box-shadow: 0 6px 18px rgba(99,102,241,0.06); font-weight:600; }
        .ped-btn.primary { background: linear-gradient(90deg,#ff9ccf,#c792ff); color:white; }
        .ped-btn.ghost { background:transparent; border:1px solid rgba(0,0,0,0.06); }
        .ped-select { padding:8px 10px; border-radius:10px; border:1px solid #f3e8ff; background:white; }
        .ped-note { margin-top:14px; background:#fff7fb; padding:10px; border-radius:10px; font-size:13px; color:#6b7280; }
        .ped-examples { margin-top:8px; display:flex; gap:8px; flex-direction:column; }
        .example { padding:10px; border-radius:10px; background:#fbf7ff; font-family: ui-monospace, Menlo, monospace; }

        .mode-pill { display:inline-flex; gap:8px; align-items:center; padding:8px 10px; border-radius:999px; background:rgba(255,255,255,0.18); font-weight:700; }
        .mode-pill .pill-dot { width:10px; height:10px; border-radius:999px; display:inline-block; }
        .pill-encode { background:#ff8ac2; }
        .pill-decode { background:#7c5cff; }

        /* Guide modal */
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:60; }
        .modal { background:white; border-radius:12px; width:90%; max-width:760px; padding:18px; box-shadow:0 20px 40px rgba(12,12,50,0.12); }
        .modal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:12px; }
        .modal-item { padding:8px; border-radius:8px; background:#fff; display:flex; justify-content:space-between; align-items:center; border:1px solid #faf5ff; }
        .modal-close { margin-top:12px; display:flex; justify-content:flex-end; }

        @media (max-width:800px){ .ped-grid{ grid-template-columns:1fr; } .modal-grid{ grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <div className="ped-card">
        <div className="ped-header">
          <div>
            <h1 className="ped-title">Cute Encoder & Decoder ✨</h1>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* realistic Mode Toggle */}
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
        </div>

        <div className="ped-body">
          <div className="ped-grid">
            <div>
              <div className="ped-actions">
                <button
                  className="ped-btn ghost"
                  onClick={() => setShowGuide(true)}
                >
                  Guide
                </button>

                <button className="ped-btn ghost" onClick={handleClear}>
                  Clear
                </button>
                <button className="ped-btn ghost" onClick={handleSwap}>
                  Swap
                </button>
              </div>
            </div>
            <br />
            <div>
              <label className="ped-label">Input</label>
              <textarea
                className="ped-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "encode"
                    ? "Type text to encode ..."
                    : "Type text to decode ..."
                }
              />
            </div>{" "}
            <br />
            <div>
              <label className="ped-label">Output</label>
              <textarea className="ped-output" value={output} readOnly />

              <div className="ped-actions">
                <button className="ped-btn primary" onClick={handleRun}>
                  Run
                </button>
                <button className="ped-btn" onClick={handleCopy}>
                  Copy
                </button>
                <button
                  className="ped-btn"
                  onClick={() => {
                    navigator.clipboard
                      .readText()
                      .then((t) => setInput(t))
                      .catch(() => toast.error("Paste failed"));
                  }}
                >
                  Paste into input
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="modal-backdrop" onClick={() => setShowGuide(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0 }}>Code Guide (A → Z)</h3>
            <div className="modal-grid">
              {Object.keys(MORSE_MAP)
                .filter((k) => k !== " ")
                .sort()
                .map((k) => (
                  <div key={k} className="modal-item">
                    <strong style={{ color: "#c026d3" }}>{k}</strong>
                    <span style={{ fontFamily: "ui-monospace", marginLeft: 8 }}>
                      {MORSE_MAP[k]}
                    </span>
                  </div>
                ))}
            </div>

            <div className="modal-close">
              <button className="ped-btn" onClick={() => setShowGuide(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

