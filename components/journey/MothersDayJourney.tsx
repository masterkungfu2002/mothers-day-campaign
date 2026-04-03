'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Album, AlbumPhoto } from '@/lib/types';

/* ═══════════════════════════════════════
   CSS — Light Cream Luxury Theme
   ═══════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#f8f4ed;font-family:'Cormorant Garamond','Georgia',serif;color:#2e2a24;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}

/* ── Loading Screen ── */
.ld{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 40%,#fdf9f2,#f0ebe0);transition:opacity .8s,visibility .8s}
.ld.done{opacity:0;visibility:hidden;pointer-events:none}
.ld-ring{width:56px;height:56px;border:2px solid rgba(184,154,110,.12);border-top-color:#b89a6e;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ld-pct{margin-top:1.4rem;font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4.5vw,2.5rem);color:#b89a6e;font-weight:300;letter-spacing:.12em}
.ld-sub{margin-top:.4rem;font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;color:rgba(184,154,110,.4);animation:pulse 2s ease infinite}
.ld-bar{position:absolute;bottom:0;left:0;height:2px;background:linear-gradient(90deg,#b8922e,#e4c87a);transition:width .4s ease}

/* ── Grain Overlay ── */
.grain{position:fixed;inset:0;pointer-events:none;z-index:8000;opacity:.012;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E")}

/* ── Progress Bar ── */
.prog{position:fixed;top:0;left:0;right:0;height:2px;background:rgba(0,0,0,.03);z-index:7000}
.prog-fill{height:100%;background:linear-gradient(90deg,#b8922e,#e4c87a);transition:width .8s cubic-bezier(.2,.9,.4,1.1)}

/* ── Screen System ── */
.scr{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .9s cubic-bezier(.22,1,.36,1);z-index:1}
.scr.on{opacity:1;pointer-events:auto;z-index:10}

/* ── INTRO ── */
.intro{background:radial-gradient(ellipse at 50% 40%,#fefaf5,#f4ede3);cursor:pointer;flex-direction:column;gap:1rem}
.intro canvas{position:absolute;inset:0;width:100%;height:100%}
.intro-c{position:relative;z-index:2;text-align:center;opacity:0;transform:translateY(22px);transition:opacity 1.4s cubic-bezier(.22,1,.36,1),transform 1.4s cubic-bezier(.22,1,.36,1)}
.intro-c.vis{opacity:1;transform:translateY(0)}
.intro-t{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,4.5vw,2.6rem);font-weight:400;letter-spacing:.05em;color:#3c3326;line-height:1.5}
.intro-t em{color:#b89a6e;font-style:italic}
.intro-s{font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(184,154,110,.5);margin-top:1.2rem;animation:pulse 2.5s infinite}
.intro-tap{position:absolute;bottom:2.5rem;font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(60,51,38,.18);animation:bounce 2.2s ease infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.85}}

/* ── GREETING ── */
.greet{background:radial-gradient(ellipse at 50% 30%,#fef7ef,#f9efdf);flex-direction:column}
.greet-card{max-width:540px;padding:2.5rem;text-align:center;position:relative;z-index:2}
.greet-lbl{font-size:.6rem;letter-spacing:.5em;color:rgba(184,154,110,.5);margin-bottom:1.6rem;text-transform:uppercase}
.greet-txt{font-family:'Playfair Display',serif;font-size:clamp(1.1rem,3.5vw,2rem);line-height:1.7;color:#3c3326;white-space:pre-wrap;min-height:3.5em}
.cursor-bl{display:inline-block;width:2px;height:1em;background:#b89a6e;vertical-align:middle;margin-left:3px;animation:blink .85s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.greet-cta{margin-top:2.5rem;font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;color:#b89a6e;cursor:pointer;opacity:0;transition:opacity .6s;padding:.8rem 2rem;border:1px solid rgba(184,154,110,.3);border-radius:40px;background:transparent}
.greet-cta.vis{opacity:1}
.greet-cta:hover{background:rgba(184,154,110,.06)}

/* ── BOOK SCREEN ── */
.bk{overflow:hidden}
.bk-bg{position:absolute;inset:0;transition:background 1.2s ease}
.bk-particles{position:absolute;inset:0;pointer-events:none;z-index:1}
.bk-wrap{
  position:relative;
  z-index:10;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:.8rem;
  width:100%;
  max-width:1000px;
  padding:0 1.5rem;
}
.bk-lbl{font-size:.6rem;letter-spacing:.45em;color:rgba(184,154,110,.5);text-transform:uppercase}

/* Book Frame */
.bk-frame{
  position:relative;
  width:min(80vw,680px); 
  aspect-ratio:2/1;
  margin:0 auto; 
}
@media(max-width:640px){.bk-frame{aspect-ratio:1.5/1}}
.bk-shadow{position:absolute;bottom:-8px;left:8%;right:8%;height:16px;background:rgba(0,0,0,.08);filter:blur(12px);border-radius:50%}
.bk-3d{position:relative;width:100%;height:100%;perspective:2400px}

/* Spread (book pages) */
.spread{position:absolute;inset:0;display:flex;border-radius:6px;overflow:hidden;box-shadow:0 20px 40px -12px rgba(0,0,0,.15),0 0 0 1px rgba(184,154,110,.15)}

/* Left page = caption */
.sp-l{width:50%;height:100%;background:linear-gradient(155deg,#fffcf7,#fef7ef);display:flex;align-items:center;justify-content:center;padding:clamp(.6rem,2.5vw,1.5rem);position:relative;overflow:hidden}
.sp-l::after{content:'';position:absolute;right:0;top:0;bottom:0;width:18px;background:linear-gradient(to left,rgba(0,0,0,.025),transparent);pointer-events:none}

/* Right page = photo */
.sp-r{width:50%;height:100%;background:#fef9f2;overflow:hidden;position:relative;cursor:pointer}
.sp-r img{width:100%;height:100%;object-fit:cover;display:block}

/* Spine */
.spine{position:absolute;top:0;left:calc(50% - 8px);width:16px;height:100%;z-index:40;background:linear-gradient(90deg,#c0a06a,#d4b87a,#e8d4a0,#d4b87a,#c0a06a);box-shadow:0 0 6px rgba(0,0,0,.08);pointer-events:none;border-radius:1px}

/* ── COVER ── */
.cover{position:absolute;top:0;right:0;width:50%;height:100%;z-index:30;transform-origin:left center;transition:transform 1.1s cubic-bezier(.23,1,.32,1);cursor:pointer;border-radius:0 6px 6px 0;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}
.cover.open{transform:rotateY(-178deg);pointer-events:none}
.cvr-f,.cvr-b{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}
.cvr-f{background:linear-gradient(140deg,#e9dbc9,#ddceb8);border:1px solid rgba(184,154,110,.35);border-radius:0 6px 6px 0;box-shadow:inset 0 0 30px rgba(0,0,0,.03),-2px 0 12px rgba(0,0,0,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;overflow:hidden}
.cvr-f::before{content:'';position:absolute;inset:10px;border:1px solid rgba(184,154,110,.18);border-radius:4px;pointer-events:none}
.cvr-f::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent 50%);pointer-events:none}
.cvr-b{transform:rotateY(180deg);background:linear-gradient(140deg,#ddceb8,#d4c2a8);border-radius:0 6px 6px 0}
.cvr-orn{width:40px;height:1px;background:linear-gradient(90deg,transparent,#b89a6e,transparent)}
.cvr-title{font-family:'Playfair Display',serif;font-size:clamp(.85rem,2.8vw,1.25rem);color:#3c3326;text-align:center;padding:0 1.2rem;line-height:1.5;font-weight:400}
.cvr-title em{color:#b89a6e;font-weight:500}
.cvr-year{font-size:.55rem;letter-spacing:.35em;color:#b89a6e;text-transform:uppercase}
.cvr-tap{position:absolute;bottom:14px;font-size:.5rem;color:rgba(60,51,38,.22);letter-spacing:.25em;text-transform:uppercase;animation:pulse 2.2s infinite}

/* ── FLIP ANIMATION ── */
.flip{position:absolute;top:0;width:50%;height:100%;z-index:25;pointer-events:none;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}
.flip-fwd{left:50%;transform-origin:left center;animation:flipFwd .6s cubic-bezier(.36,.07,.19,.97) forwards}
.flip-bwd{left:0;transform-origin:right center;animation:flipBwd .6s cubic-bezier(.36,.07,.19,.97) forwards}
@keyframes flipFwd{0%{transform:rotateY(0)}100%{transform:rotateY(-180deg)}}
@keyframes flipBwd{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
.fl-face{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}

/* Forward flip faces */
.fl-photo{background:#fef9f2;border-radius:0 6px 6px 0}
.fl-photo img{width:100%;height:100%;object-fit:cover;display:block}
.fl-cap{transform:rotateY(180deg);background:linear-gradient(155deg,#fffcf7,#fef7ef);border-radius:6px 0 0 6px;display:flex;align-items:center;justify-content:center;padding:clamp(.6rem,2.5vw,1.5rem)}

/* Backward flip faces */
.fl-cap-front{background:linear-gradient(155deg,#fffcf7,#fef7ef);border-radius:6px 0 0 6px;display:flex;align-items:center;justify-content:center;padding:clamp(.6rem,2.5vw,1.5rem)}
.fl-photo-back{transform:rotateY(180deg);background:#fef9f2;border-radius:0 6px 6px 0;overflow:hidden}
.fl-photo-back img{width:100%;height:100%;object-fit:cover;display:block}

/* Flip shadow */
.flip-fwd::after{content:'';position:absolute;top:0;left:0;width:30px;height:100%;background:linear-gradient(to right,rgba(0,0,0,.06),transparent);z-index:99;pointer-events:none}
.flip-bwd::after{content:'';position:absolute;top:0;right:0;width:30px;height:100%;background:linear-gradient(to left,rgba(0,0,0,.06),transparent);z-index:99;pointer-events:none}

/* ── CAPTION ── */
.cap{text-align:center;max-width:88%;display:flex;flex-direction:column;align-items:center}
.cap-num{font-size:clamp(.45rem,1.2vw,.6rem);letter-spacing:.2em;color:#a88d66;margin-bottom:.4rem;font-weight:500}
.cap-icon{font-size:clamp(.9rem,2.5vw,1.2rem);margin-bottom:.15rem;color:#b89a6e;line-height:1}
.cap-season{font-family:'Playfair Display',serif;font-size:clamp(.7rem,2vw,.95rem);color:#4a3e30;margin-bottom:.2rem;font-weight:500;letter-spacing:.04em}
.cap-div{width:28px;height:1px;background:linear-gradient(90deg,transparent,#b89a6e,transparent);margin:.4rem 0}
.cap-txt{font-size:clamp(.6rem,1.6vw,.78rem);color:#6b5a48;line-height:1.6;font-style:italic;font-weight:400;word-break:break-word}
.cap-year{font-size:clamp(.4rem,1vw,.52rem);letter-spacing:.2em;color:#b89a6e;margin-top:.4rem;font-weight:500}

/* ── NAVIGATION ── */
.nav{display:flex;align-items:center;gap:.7rem;opacity:0;transition:opacity .5s;margin-top:.5rem}
.nav.vis{opacity:1}
.nav-btn{width:34px;height:34px;border-radius:50%;background:rgba(184,154,110,.08);border:1px solid rgba(184,154,110,.25);color:#b89a6e;font-size:.85rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.nav-btn:hover:not(:disabled){background:rgba(184,154,110,.15);transform:scale(1.05)}
.nav-btn:disabled{opacity:.15;cursor:not-allowed}
.nav-dots{display:flex;gap:5px}
.dot{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.08);cursor:pointer;transition:all .35s}
.dot.on{background:#b89a6e;transform:scale(1.4);box-shadow:0 0 6px rgba(184,154,110,.4)}

/* ── CASSETTE ── */
.cass{flex-direction:column;gap:1.8rem;background:radial-gradient(ellipse at 50% 45%,#fef7ef,#f4ede3)}
.cass-t{font-family:'Playfair Display',serif;font-size:1.2rem;color:#3c3326;letter-spacing:.05em}
.cass-s{font-size:.65rem;letter-spacing:.25em;color:rgba(184,154,110,.5);text-transform:uppercase}
.cass-icon{cursor:pointer;transition:transform .3s}
.cass-icon:hover{transform:scale(1.02) translateY(-3px)}
.cass-icon.eject{animation:eject .6s forwards;pointer-events:none}
@keyframes eject{0%{transform:translateY(0) scale(1);opacity:1}30%{transform:translateY(-12px) scale(1.02)}100%{transform:translateY(40px) scale(.6);opacity:0}}
.cass-skip{font-size:.6rem;color:rgba(60,51,38,.2);text-transform:uppercase;letter-spacing:.2em;cursor:pointer;transition:color .2s}
.cass-skip:hover{color:rgba(60,51,38,.5)}

/* ── TV MODAL ── */
.tv-modal{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s}
.tv-modal.on{opacity:1;pointer-events:auto}
.tv-fr{position:relative;width:min(88vw,480px);background:#2a251e;border-radius:18px 18px 26px 26px;padding:10px 14px 24px;box-shadow:0 20px 40px rgba(0,0,0,.5),0 0 0 2px #5e4e38,0 0 0 5px #1f1b14}
.tv-scr{background:#0f0e0a;border-radius:10px;padding:5px}
.tv-inner{position:relative;border-radius:7px;overflow:hidden;aspect-ratio:4/3;background:#000}
.tv-static{position:absolute;inset:0;background:#555;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");transition:opacity .6s;z-index:5}
.tv-static.off{opacity:0}
.tv-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2}
.tv-ifr{position:absolute;inset:0;width:100%;height:100%;z-index:2;border:none;display:none}
.tv-led{position:absolute;bottom:-12px;right:14px;width:5px;height:5px;border-radius:50%;background:#2a251e;transition:all .3s}
.tv-led.on{background:#2eff5e;box-shadow:0 0 8px #2eff5e}
.tv-knobs{display:flex;justify-content:center;gap:8px;margin-top:6px}
.tv-knob{width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#6b5a48,#4a3e30);box-shadow:0 1px 3px rgba(0,0,0,.5)}
.tv-brand{text-align:center;margin-top:5px;font-family:'Playfair Display',serif;font-size:.45rem;letter-spacing:.35em;color:#5e4e38;text-transform:uppercase}
.tv-close{position:absolute;top:-10px;right:-10px;width:26px;height:26px;border-radius:50%;background:#3c3326;border:1px solid #b89a6e;color:#e4c87a;font-size:.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;z-index:15}
.tv-close:hover{background:#b3472c;color:#fff}

/* ── FEEDBACK ── */
.fb{flex-direction:column;padding:1.5rem;background:radial-gradient(ellipse at 50% 25%,#fef7ef,#f4ede3);overflow-y:auto}
.fb-card{background:rgba(255,252,245,.85);backdrop-filter:blur(10px);border:1px solid rgba(184,154,110,.2);border-radius:22px;padding:2rem;max-width:440px;width:100%;box-shadow:0 20px 40px -12px rgba(0,0,0,.08)}
.fb-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:#3c3326;text-align:center;margin-bottom:.25rem}
.fb-sub{color:#a88d66;font-size:.65rem;text-align:center;margin-bottom:1.5rem;letter-spacing:.12em}
.stars{display:flex;justify-content:center;gap:.5rem;margin-bottom:1rem}
.star{font-size:1.6rem;cursor:pointer;color:rgba(60,51,38,.08);transition:all .15s}
.star.on{color:#e4c87a;text-shadow:0 0 8px rgba(228,200,122,.35);transform:scale(1.08)}
.fb-input{width:100%;padding:.75rem 1rem;background:rgba(255,255,255,.5);border:1px solid rgba(184,154,110,.3);border-radius:12px;font-size:.78rem;margin-bottom:.7rem;outline:none;font-family:inherit;color:#2e2a24}
.fb-input:focus{border-color:#b89a6e}
.fb-input::placeholder{color:rgba(60,51,38,.18)}
textarea.fb-input{resize:none;height:76px}
.fb-btn{width:100%;padding:.75rem;background:linear-gradient(135deg,#b89a6e,#e4c87a);border:none;border-radius:40px;color:#2e2a24;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:all .2s;font-family:inherit;font-size:.8rem}
.fb-btn:hover{filter:brightness(1.04);transform:scale(1.01)}
.fb-btn:disabled{opacity:.35;cursor:not-allowed}
.thx{text-align:center}
.thx-icon{font-size:2.2rem;margin-bottom:.5rem}
.thx-t{font-family:'Playfair Display',serif;font-size:1.2rem;color:#b89a6e;margin-bottom:.25rem}
.thx-s{color:#6b5a48;font-size:.72rem}

/* ── Hidden preload ── */
.preload{position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;opacity:0}
/* ── FORCE LANDSCAPE ── */
@media screen and (orientation: portrait) {
  body::before {
    content: "Please rotate your device ↻";
    position: fixed;
    inset: 0;
    background: #f8f4ed;
    color: #3c3326;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    letter-spacing: .1em;
    z-index: 99999;
  }

  .scr, .ld, .grain, .prog {
    display: none !important;
  }
}

/* ── SLOW CAPTION REVEAL ── */
.slow-reveal{
  opacity:0;
  filter:blur(6px);
  transform:translateY(10px);
  animation:fadeSlow 1.6s ease forwards;
}

@keyframes fadeSlow{
  to{
    opacity:1;
    filter:blur(0);
    transform:translateY(0);
  }
}
.typing{
  overflow:hidden;
  white-space:normal;
  animation:fadeUp 1.8s ease forwards;
}

@keyframes fadeUp{
  0%{opacity:0; transform:translateY(15px)}
  100%{opacity:1; transform:translateY(0)}
}
`;

/* ─────────── Seasons ─────────── */
const SEASONS = [
  { name: 'Spring', bg: 'radial-gradient(ellipse at 50% 35%,#fef7ef,#f9efdf)', em: '❀' },
  { name: 'Summer', bg: 'radial-gradient(ellipse at 50% 35%,#fff4e8,#faead4)', em: '✦' },
  { name: 'Autumn', bg: 'radial-gradient(ellipse at 50% 35%,#fef0e4,#fbe6d0)', em: '✧' },
  { name: 'Winter', bg: 'radial-gradient(ellipse at 50% 35%,#f0f4fa,#e8edf5)', em: '❋' },
];

/* ─────────── URL Helper ─────────── */
function resolveUrl(url: string): string {
  if (!url) return '';
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
}
function isYT(u: string) { return /youtu\.?be/.test(u); }
function ytId(u: string) { return u.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || ''; }

/* ─────────── Audio ─────────── */
let _ctx: AudioContext | null = null;
let _ready = false;
async function initAudio() {
  if (_ready) return;
  try {
    if (!_ctx) _ctx = new AudioContext();
    if (_ctx.state === 'suspended') await _ctx.resume();
    _ready = true;
  } catch {}
}
function playFlip() {
  if (!_ready || !_ctx) return;
  try {
    const now = _ctx.currentTime;
    const o = _ctx.createOscillator(); const g = _ctx.createGain();
    o.connect(g); g.connect(_ctx.destination);
    o.type = 'sine'; o.frequency.value = 1100;
    g.gain.setValueAtTime(0.05, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    o.start(); o.stop(now + 0.11);
  } catch {}
}
function playKey() {
  if (!_ready || !_ctx) return;
  try {
    const now = _ctx.currentTime;
    const o = _ctx.createOscillator(); const g = _ctx.createGain();
    o.connect(g); g.connect(_ctx.destination);
    o.frequency.value = 1700;
    g.gain.setValueAtTime(0.012, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    o.start(); o.stop(now + 0.04);
  } catch {}
}

/* ─────────── Caption ─────────── */
const Caption = ({ photo, index, year }: { photo: AlbumPhoto; index: number; year: string }) => {
  const s = SEASONS[index % 4];
  return (
    <div className="cap">
      <div className="cap-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="cap-icon">{s.em}</div>
      <div className="cap-season">{s.name}</div>
      <div className="cap-div" />
      <div key={index} className="cap-txt typing">
  {photo.caption || 'A cherished memory'}
</div>  
      <div className="cap-year">{year}</div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export function MothersDayJourney({ album }: { album: Album }) {
  const photos = album.photos || [];
  const videoUrl = album.video_url || '';
  const recipient = album.recipient_name || 'Mom';
  const year = new Date(album.created_at).getFullYear().toString();
  const greetingMsg = "Happy Mother's Day\nWith all our love";

  const imageUrls = useMemo(() => photos.map(p => resolveUrl(p.url || '')), [photos]);

  const [loadPct, setLoadPct] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState<'intro' | 'greet' | 'book' | 'cass' | 'fb'>('intro');
  const [introVis, setIntroVis] = useState(false);
  const [greetDone, setGreetDone] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [flipDir, setFlipDir] = useState<'fwd' | 'bwd' | null>(null);
  const [flipFrom, setFlipFrom] = useState(0);
  const [busy, setBusy] = useState(false);
  const [navVis, setNavVis] = useState(false);
  const [tvOn, setTvOn] = useState(false);
  const [tvStatic, setTvStatic] = useState(true);
  const [tvLed, setTvLed] = useState(false);
  const [rating, setRating] = useState(0);
  const [fbSent, setFbSent] = useState(false);
  const [fbName, setFbName] = useState('');
  const [fbComment, setFbComment] = useState('');
  const [fbLoading, setFbLoading] = useState(false);

  const introCanvas = useRef<HTMLCanvasElement>(null);
  const particleCanvas = useRef<HTMLCanvasElement>(null);
  const typeEl = useRef<HTMLDivElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const ifrEl = useRef<HTMLIFrameElement>(null);
  const touchX = useRef(0);

  const season = SEASONS[page % 4];
  const progress = screen === 'intro' ? 5 : screen === 'greet' ? 18 : screen === 'book' ? 35 + (page / Math.max(1, photos.length - 1)) * 45 : screen === 'cass' ? 85 : 98;

  // ═══ PRELOAD ═══
  useEffect(() => {
    const urls = imageUrls.filter(Boolean);
    if (!urls.length) { setLoadPct(100); setLoaded(true); return; }
    let done = 0;
    const total = urls.length;
    Promise.all(urls.map(url => new Promise<void>(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => { done++; setLoadPct(Math.round((done / total) * 100)); resolve(); };
      img.src = url;
    }))).then(() => setTimeout(() => setLoaded(true), 300));
  }, [imageUrls]);

  // ═══ CSS ═══
  useEffect(() => {
    let el = document.getElementById('mj-css') as HTMLStyleElement;
    if (!el) { el = document.createElement('style'); el.id = 'mj-css'; document.head.appendChild(el); }
    el.textContent = CSS;
    return () => { el?.remove(); };
  }, []);

  // ═══ AUDIO ═══
  useEffect(() => {
    const h = () => { initAudio(); document.removeEventListener('click', h); document.removeEventListener('touchstart', h); };
    document.addEventListener('click', h); document.addEventListener('touchstart', h);
    return () => { document.removeEventListener('click', h); document.removeEventListener('touchstart', h); };
  }, []);

  // ═══ MUSIC ═══
  useEffect(() => {
    const mu = (album as any).background_music_url;
    if (!mu) return;
    const a = new Audio(mu); a.loop = true; a.volume = 0.22;
    const p = () => { a.play().catch(() => {}); document.removeEventListener('click', p); document.removeEventListener('touchstart', p); };
    document.addEventListener('click', p); document.addEventListener('touchstart', p);
    return () => { a.pause(); a.src = ''; document.removeEventListener('click', p); document.removeEventListener('touchstart', p); };
  }, [album]);

  // ═══ INTRO STARS ═══
  useEffect(() => {
    if (screen !== 'intro' || !loaded) return;
    const cv = introCanvas.current; if (!cv) return;
    const ctx = cv.getContext('2d')!; let anim: number;
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; }; resize(); addEventListener('resize', resize);
    const stars = Array.from({ length: 120 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.1 + 0.2, a: Math.random(), d: (Math.random() * 0.005 + 0.001) * (Math.random() > 0.5 ? 1 : -1) }));
    setTimeout(() => setIntroVis(true), 500);
    const draw = () => { anim = requestAnimationFrame(draw); ctx.clearRect(0, 0, cv.width, cv.height); for (const s of stars) { s.a += s.d; if (s.a > 0.7 || s.a < 0.05) s.d *= -1; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(60,51,38,${0.03 + s.a * 0.09})`; ctx.fill(); } }; draw();
    return () => { cancelAnimationFrame(anim); removeEventListener('resize', resize); };
  }, [screen, loaded]);

  // ═══ TYPEWRITER ═══
  useEffect(() => {
    if (screen !== 'greet') return;
    const el = typeEl.current; if (!el) return;
    el.innerHTML = ''; setGreetDone(false); let i = 0;
    const timer = setInterval(() => { if (i >= greetingMsg.length) { clearInterval(timer); setTimeout(() => setGreetDone(true), 350); return; } const ch = greetingMsg[i++]; if (ch === '\n') el.innerHTML += '<br>'; else { el.innerHTML += ch; playKey(); } }, 50);
    return () => clearInterval(timer);
  }, [screen, greetingMsg]);

  // ═══ PARTICLES ═══
  useEffect(() => {
    if (screen !== 'book') return;
    const cv = particleCanvas.current; if (!cv) return;
    const ctx = cv.getContext('2d')!; let anim: number;
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; }; resize(); addEventListener('resize', resize);
    type P = { x: number; y: number; vx: number; vy: number; sz: number; ch: string; life: number; mx: number; angle: number; spin: number };
    const pts: P[] = [];
    const add = () => pts.push({ x: Math.random() * cv.width, y: cv.height + 6, vx: (Math.random() - 0.5) * 0.3, vy: -0.5 - Math.random() * 0.7, sz: 10 + Math.random() * 8, ch: season.em, life: 0, mx: 120 + Math.random() * 70, angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.015 });
    for (let j = 0; j < 4; j++) add(); let f = 0;
    const draw = () => { anim = requestAnimationFrame(draw); ctx.clearRect(0, 0, cv.width, cv.height); f++; if (f % 45 === 0 && pts.length < 12) add(); for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; p.x += p.vx; p.y += p.vy; p.life++; p.angle += p.spin; const al = p.life < 20 ? p.life / 20 : p.life > p.mx - 20 ? (p.mx - p.life) / 20 : 0.3; if (p.life > p.mx || p.y < -30) { pts.splice(i, 1); continue; } ctx.save(); ctx.globalAlpha = al; ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.font = `${p.sz}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#b89a6e'; ctx.fillText(p.ch, 0, 0); ctx.restore(); } }; draw();
    return () => { cancelAnimationFrame(anim); removeEventListener('resize', resize); };
  }, [screen, season]);

  // ═══ FLIP ═══
  const flipPage = useCallback((dir: 'fwd' | 'bwd') => {
    if (busy || !coverOpen || flipDir) return;
    const target = dir === 'fwd' ? page + 1 : page - 1;
    if (target < 0 || target >= photos.length) return;
    setBusy(true); setFlipFrom(page); setFlipDir(dir); playFlip();
    setTimeout(() => { setPage(target); setFlipDir(null); setBusy(false); if (dir === 'fwd' && target === photos.length - 1) setTimeout(() => setScreen(videoUrl ? 'cass' : 'fb'), 800); }, 620);
  }, [busy, coverOpen, flipDir, page, photos.length, videoUrl]);

  const openCover = useCallback(() => {
    if (coverOpen || busy) return; initAudio(); setBusy(true); setCoverOpen(true);
    setTimeout(() => { setNavVis(true); setBusy(false); }, 1100);
  }, [coverOpen, busy]);

  const onTS = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => { if (!coverOpen) { openCover(); return; } const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 35) flipPage(dx < 0 ? 'fwd' : 'bwd'); };

  const openTV = () => {
    document.querySelector('.cass-icon')?.classList.add('eject');
    setTimeout(() => { setTvOn(true); setTvStatic(true); setTvLed(false);
      setTimeout(() => { setTvStatic(false); setTvLed(true);
        if (videoUrl) { if (isYT(videoUrl)) { const ifr = ifrEl.current; if (ifr) { ifr.src = `https://www.youtube-nocookie.com/embed/${ytId(videoUrl)}?autoplay=1&controls=1&rel=0`; ifr.style.display = 'block'; } } else { const v = videoEl.current; if (v) { v.src = resolveUrl(videoUrl); v.muted = false; v.play().catch(() => { v.muted = true; v.play(); }); } } }
      }, 800); }, 500);
  };
  const closeTV = () => {
    setTvOn(false); setTvStatic(true); setTvLed(false);
    if (videoEl.current) { videoEl.current.pause(); videoEl.current.src = ''; }
    if (ifrEl.current) { ifrEl.current.src = ''; ifrEl.current.style.display = 'none'; }
    document.querySelector('.cass-icon')?.classList.remove('eject');
    setScreen('fb');
  };

  const submitFb = async () => {
    if (!rating) { alert('Please select a rating'); return; } setFbLoading(true);
    try { const r = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ album_id: album.id, rating, comment: fbComment.trim() || (fbName ? `From ${fbName}` : 'Sent with love') }) }); if (!r.ok) throw new Error(); setFbSent(true); } catch { alert('Could not send. Please try again.'); } finally { setFbLoading(false); }
  };

  /* ═══ RENDER ═══ */
  return (
    <>
      <div className="preload" aria-hidden="true">
        {imageUrls.map((url, i) => url ? <img key={i} src={url} alt="" /> : null)}
      </div>

      <div className={`ld ${loaded ? 'done' : ''}`}>
        <div className="ld-ring" />
        <div className="ld-pct">{loadPct}%</div>
        <div className="ld-sub">Preparing your memories</div>
        <div className="ld-bar" style={{ width: `${loadPct}%` }} />
      </div>

      <div className="grain" />
      <div className="prog"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>

      {/* INTRO */}
      <div className={`scr intro ${screen === 'intro' ? 'on' : ''}`} onClick={() => setScreen('greet')}>
        <canvas ref={introCanvas} />
        <div className={`intro-c ${introVis ? 'vis' : ''}`}>
          <div className="intro-t">To the world, you are a mother.<br /><span style={{ fontSize: '.72em', opacity: 0.6 }}>To our family, you are <em>the world</em>.</span></div>
          <div className="intro-s">Begin your journey</div>
        </div>
        <div className="intro-tap">TAP TO OPEN</div>
      </div>

      {/* GREETING */}
      <div className={`scr greet ${screen === 'greet' ? 'on' : ''}`}>
        <div className="greet-card">
          <div className="greet-lbl">A MESSAGE FOR YOU</div>
          <div className="greet-txt" ref={typeEl}><span className="cursor-bl" /></div>
          <div className={`greet-cta ${greetDone ? 'vis' : ''}`} onClick={() => greetDone && setScreen('book')}>OPEN YOUR ALBUM →</div>
        </div>
      </div>

      {/* BOOK */}
      <div className={`scr bk ${screen === 'book' ? 'on' : ''}`}>
        <div className="bk-bg" style={{ background: season.bg }} />
        <canvas ref={particleCanvas} className="bk-particles" />
        <div className="bk-wrap">
          <div className="bk-lbl">{season.name.toUpperCase()} ✦ {String(page + 1).padStart(2, '0')}</div>
          <div className="bk-frame">
            <div className="bk-shadow" />
            <div className="bk-3d" onTouchStart={onTS} onTouchEnd={onTE}>

              {/* LAYER 1: Under-spread — nội dung trang kế tiếp, lộ ra khi lật */}
              {flipDir === 'fwd' && flipFrom + 1 < photos.length && (
                <div className="spread" style={{ zIndex: 2 }}>
                  <div className="sp-l"><Caption photo={photos[flipFrom]} index={flipFrom} year={year} /></div>
                  <div className="sp-r">{imageUrls[flipFrom + 1] && <img src={imageUrls[flipFrom + 1]} alt="" />}</div>
                </div>
              )}
              {flipDir === 'bwd' && flipFrom - 1 >= 0 && (
                <div className="spread" style={{ zIndex: 2 }}>
                  <div className="sp-l"><Caption photo={photos[flipFrom - 1]} index={flipFrom - 1} year={year} /></div>
                  <div className="sp-r">{imageUrls[flipFrom] && <img src={imageUrls[flipFrom]} alt="" />}</div>
                </div>
              )}

              {/* LAYER 2: Main spread — trang hiện tại */}
              <div className="spread" style={{ zIndex: flipDir ? 1 : 5 }}>
                <div className="sp-l">{photos[page] && <Caption photo={photos[page]} index={page} year={year} />}</div>
                <div className="sp-r" onClick={() => coverOpen && !busy && flipPage('fwd')}>{imageUrls[page] && <img src={imageUrls[page]} alt="" />}</div>
              </div>

              <div className="spine" />

              {/* LAYER 3: Flip overlay — animation lật trang */}
              {flipDir === 'fwd' && (
                <div key={`f${flipFrom}`} className="flip flip-fwd" style={{ zIndex: 25 }}>
                  <div className="fl-face fl-photo">{imageUrls[flipFrom] && <img src={imageUrls[flipFrom]} alt="" />}</div>
                  <div className="fl-face fl-cap">{photos[flipFrom + 1] && <Caption photo={photos[flipFrom + 1]} index={flipFrom + 1} year={year} />}</div>
                </div>
              )}
              {flipDir === 'bwd' && (
                <div key={`b${flipFrom}`} className="flip flip-bwd" style={{ zIndex: 25 }}>
                  <div className="fl-face fl-cap-front">{photos[flipFrom] && <Caption photo={photos[flipFrom]} index={flipFrom} year={year} />}</div>
                  <div className="fl-face fl-photo-back">{imageUrls[flipFrom - 1] && <img src={imageUrls[flipFrom - 1]} alt="" />}</div>
                </div>
              )}

              {/* COVER */}
              <div className={`cover ${coverOpen ? 'open' : ''}`} onClick={() => !coverOpen && openCover()}>
                <div className="cvr-f">
                  <div style={{ fontSize: '1.5rem', opacity: 0.6 }}>✦</div>
                  <div className="cvr-orn" />
                  <div className="cvr-title">For the Most Wonderful<br /><em>{recipient}</em></div>
                  <div className="cvr-orn" />
                  <div className="cvr-year">{year}</div>
                  {!coverOpen && <div className="cvr-tap">TAP TO OPEN</div>}
                </div>
                <div className="cvr-b" />
              </div>
            </div>
          </div>

          <nav className={`nav ${navVis ? 'vis' : ''}`}>
            <button className="nav-btn" disabled={page === 0 || busy} onClick={() => flipPage('bwd')}>←</button>
            <div className="nav-dots">{photos.map((_, i) => <div key={i} className={`dot ${i === page ? 'on' : ''}`} onClick={() => !busy && coverOpen && i !== page && flipPage(i > page ? 'fwd' : 'bwd')} />)}</div>
            <button className="nav-btn" disabled={busy} onClick={() => page < photos.length - 1 ? flipPage('fwd') : setScreen(videoUrl ? 'cass' : 'fb')}>→</button>
          </nav>
        </div>
      </div>

      {/* CASSETTE */}
      <div className={`scr cass ${screen === 'cass' ? 'on' : ''}`}>
        <div className="cass-t">One Last Surprise</div>
        <div className="cass-s">press play to watch</div>
        <div className="cass-icon" onClick={openTV}>
          <svg width="260" height="160" viewBox="0 0 260 160" fill="none">
            <rect x="8" y="16" width="244" height="128" rx="12" fill="#e9dbc9" stroke="#b89a6e" strokeWidth="1" />
            <rect x="16" y="24" width="228" height="104" rx="8" fill="#fef7ef" />
            <rect x="28" y="34" width="204" height="56" rx="6" fill="#f4ede3" stroke="#d4c2a8" strokeWidth=".8" />
            <text x="130" y="62" fontFamily="'Playfair Display',serif" fontSize="12" fill="#b89a6e" textAnchor="middle" letterSpacing="4">MEMORIES</text>
            <text x="130" y="78" fontFamily="serif" fontSize="7" fill="#a88d66" textAnchor="middle" letterSpacing="2">WITH LOVE</text>
            <rect x="36" y="106" width="72" height="22" rx="4" fill="#e9dbc9" stroke="#b89a6e" strokeWidth=".6" />
            <rect x="152" y="106" width="72" height="22" rx="4" fill="#e9dbc9" stroke="#b89a6e" strokeWidth=".6" />
            <circle cx="72" cy="117" r="8" fill="#f4ede3" stroke="#b89a6e" strokeWidth=".6" /><circle cx="72" cy="117" r="3" fill="#b89a6e" />
            <circle cx="188" cy="117" r="8" fill="#f4ede3" stroke="#b89a6e" strokeWidth=".6" /><circle cx="188" cy="117" r="3" fill="#b89a6e" />
          </svg>
        </div>
        <div className="cass-skip" onClick={() => setScreen('fb')}>Skip →</div>
      </div>

      {/* TV */}
      <div className={`tv-modal ${tvOn ? 'on' : ''}`}>
        <div className="tv-fr">
          <div className="tv-scr"><div className="tv-inner">
            <div className={`tv-static ${tvStatic ? '' : 'off'}`} />
            <video ref={videoEl} className="tv-vid" playsInline controls onEnded={closeTV} />
            <iframe ref={ifrEl} className="tv-ifr" allow="autoplay" title="Video" />
          </div></div>
          <div className="tv-knobs"><div className="tv-knob" /><div className="tv-knob" /></div>
          <div className="tv-brand">MEMÓRIA</div>
          <div className={`tv-led ${tvLed ? 'on' : ''}`} />
          <div className="tv-close" onClick={closeTV}>✕</div>
        </div>
      </div>

      {/* FEEDBACK */}
      <div className={`scr fb ${screen === 'fb' ? 'on' : ''}`}>
        <div className="fb-card">
          {!fbSent ? (<>
            <div className="fb-title">How Did We Do?</div>
            <div className="fb-sub">Your voice means everything</div>
            <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= rating ? 'on' : ''}`} onClick={() => setRating(n)}>★</span>)}</div>
            <input className="fb-input" placeholder="Your name (optional)" value={fbName} onChange={e => setFbName(e.target.value)} />
            <textarea className="fb-input" placeholder="Leave a message of love..." value={fbComment} onChange={e => setFbComment(e.target.value)} />
            <button className="fb-btn" disabled={fbLoading} onClick={submitFb}>{fbLoading ? 'Sending...' : 'Send Love'}</button>
          </>) : (
            <div className="thx">
              <div className="thx-icon">💝</div>
              <div className="thx-t">Thank You</div>
              <div className="thx-s">Your message has been received with love.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
