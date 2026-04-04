'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Album, AlbumPhoto } from '@/lib/types';
 
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
 
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#f5f0e8;font-family:'Cormorant Garamond','Georgia',serif;color:#2e2a24;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
 
/* ═══════ FORCE LANDSCAPE ═══════ */
.rotate-notice{display:none;position:fixed;inset:0;z-index:99999;background:#f5f0e8;flex-direction:column;align-items:center;justify-content:center;gap:1rem;text-align:center;padding:2rem}
.rotate-notice svg{width:48px;height:48px;animation:rotateHint 2s ease infinite}
@keyframes rotateHint{0%,100%{transform:rotate(0)}50%{transform:rotate(90deg)}}
.rotate-notice p{font-family:'Playfair Display',serif;font-size:1rem;color:#3c3326;line-height:1.5}
.rotate-notice span{font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;color:#b89a6e}
@media(orientation:portrait){
  .rotate-notice{display:flex!important}
  .app-root{display:none!important}
}
 
/* ═══════ LOADING ═══════ */
.ld{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f5f0e8;transition:opacity .6s,visibility .6s}
.ld.done{opacity:0;visibility:hidden;pointer-events:none}
.ld-ring{width:48px;height:48px;border:1.5px solid rgba(184,154,110,.12);border-top-color:#b89a6e;border-radius:50%;animation:spin .9s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ld-pct{margin-top:1rem;font-family:'Playfair Display',serif;font-size:1.8rem;color:#b89a6e;font-weight:300;letter-spacing:.1em}
.ld-sub{margin-top:.3rem;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(184,154,110,.4)}
.ld-bar{position:absolute;bottom:0;left:0;height:1.5px;background:linear-gradient(90deg,#b8922e,#e4c87a);transition:width .3s}
 
/* ═══════ GRAIN ═══════ */
.grain{position:fixed;inset:0;pointer-events:none;z-index:8000;opacity:.012;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E")}
 
/* ═══════ PROGRESS ═══════ */
.prog{position:fixed;top:0;left:0;right:0;height:1.5px;background:rgba(0,0,0,.03);z-index:7000}
.prog-fill{height:100%;background:linear-gradient(90deg,#b8922e,#e4c87a);transition:width .8s cubic-bezier(.2,.9,.4,1.1)}
 
/* ═══════ SCREENS ═══════ */
.scr{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .8s ease;z-index:1}
.scr.on{opacity:1;pointer-events:auto;z-index:10}
 
/* ── INTRO ── */
.intro{background:radial-gradient(ellipse at 50% 40%,#fefaf5,#f0ebe0);cursor:pointer;flex-direction:column}
.intro canvas{position:absolute;inset:0;width:100%;height:100%}
.intro-c{position:relative;z-index:2;text-align:center;opacity:0;transform:translateY(16px);transition:opacity 1.2s ease,transform 1.2s ease}
.intro-c.vis{opacity:1;transform:translateY(0)}
.intro-t{font-family:'Playfair Display',serif;font-size:clamp(1.2rem,3.5vw,2.2rem);font-weight:400;letter-spacing:.04em;color:#3c3326;line-height:1.5}
.intro-t i{color:#b89a6e;font-style:italic}
.intro-s{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(184,154,110,.45);margin-top:1rem;animation:pulse 2.5s infinite}
.intro-tap{position:absolute;bottom:1.5rem;font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(60,51,38,.15);animation:bounce 2s ease infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.8}}
 
/* ── GREETING ── */
.greet{background:radial-gradient(ellipse at 50% 35%,#fef7ef,#f0ebe0);flex-direction:column}
.greet-card{max-width:480px;padding:2rem;text-align:center}
.greet-lbl{font-size:.55rem;letter-spacing:.5em;color:rgba(184,154,110,.4);margin-bottom:1.2rem;text-transform:uppercase}
.greet-txt{font-family:'Playfair Display',serif;font-size:clamp(1rem,3vw,1.6rem);line-height:1.7;color:#3c3326;white-space:pre-wrap;min-height:3em}
.cursor-bl{display:inline-block;width:1.5px;height:.9em;background:#b89a6e;vertical-align:middle;margin-left:2px;animation:blink .85s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.greet-cta{margin-top:2rem;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:#b89a6e;cursor:pointer;opacity:0;transition:opacity .5s;padding:.6rem 1.5rem;border:1px solid rgba(184,154,110,.25);border-radius:30px;background:transparent}
.greet-cta.vis{opacity:1}
 
/* ── BOOK ── */
.bk{overflow:hidden}
.bk-bg{position:absolute;inset:0;transition:background 1s ease}
.bk-particles{position:absolute;inset:0;pointer-events:none;z-index:1}
.bk-wrap{position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;padding:0.8rem}
 
/* Book frame — centered, not touching edges */
.bk-frame{position:relative;width:min(80vw,720px);height:min(70vh,380px)}
.bk-shadow{position:absolute;bottom:-6px;left:10%;right:10%;height:12px;background:rgba(0,0,0,.06);filter:blur(10px);border-radius:50%}
.bk-3d{position:relative;width:100%;height:100%;perspective:2200px}
 
/* Spread */
.spread{position:absolute;inset:0;display:flex;border-radius:4px;overflow:hidden;box-shadow:0 12px 30px -8px rgba(0,0,0,.12),0 0 0 1px rgba(184,154,110,.12)}
 
/* LEFT = caption */
.sp-l{
  width:50%;height:100%;
  background:linear-gradient(155deg,#fffcf7,#fef7ef);
  display:flex;align-items:center;justify-content:center;
  padding:clamp(0.5rem,2vw,1.2rem);
  position:relative;
  overflow-y:auto;overflow-x:hidden;
}
.sp-l::after{content:'';position:absolute;right:0;top:0;bottom:0;width:14px;background:linear-gradient(to left,rgba(0,0,0,.02),transparent);pointer-events:none;z-index:2}
 
/* RIGHT = photo */
.sp-r{width:50%;height:100%;background:#fef9f2;overflow:hidden;position:relative;cursor:pointer}
.sp-r img{width:100%;height:100%;object-fit:cover;display:block}
 
/* Spine */
.spine{position:absolute;top:0;left:calc(50% - 6px);width:12px;height:100%;z-index:40;background:linear-gradient(90deg,#bfa065,#d4b87a,#e4d090,#d4b87a,#bfa065);box-shadow:0 0 4px rgba(0,0,0,.06);pointer-events:none}
 
/* Navigation — below book */
.nav-row{display:flex;align-items:center;gap:.6rem;margin-top:.6rem;opacity:0;transition:opacity .4s}
.nav-row.vis{opacity:1}
.nav-btn{width:28px;height:28px;border-radius:50%;background:rgba(184,154,110,.06);border:1px solid rgba(184,154,110,.2);color:#b89a6e;font-size:.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.nav-btn:hover:not(:disabled){background:rgba(184,154,110,.12)}
.nav-btn:disabled{opacity:.12;cursor:not-allowed}
.nav-dots{display:flex;gap:4px}
.dot{width:4px;height:4px;border-radius:50%;background:rgba(0,0,0,.08);cursor:pointer;transition:all .3s}
.dot.on{background:#b89a6e;transform:scale(1.5);box-shadow:0 0 4px rgba(184,154,110,.35)}
.nav-pg{font-size:.5rem;letter-spacing:.2em;color:rgba(184,154,110,.5)}
 
/* ── COVER ── */
.cover{position:absolute;top:0;right:0;width:50%;height:100%;z-index:30;transform-origin:left center;transition:transform 1s cubic-bezier(.23,1,.32,1);cursor:pointer;border-radius:0 4px 4px 0;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}
.cover.open{transform:rotateY(-178deg);pointer-events:none}
.cvr-f,.cvr-b{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}
.cvr-f{background:linear-gradient(140deg,#e6d8c4,#d8cab4);border:1px solid rgba(184,154,110,.3);border-radius:0 4px 4px 0;box-shadow:inset 0 0 20px rgba(0,0,0,.02),-2px 0 10px rgba(0,0,0,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;overflow:hidden}
.cvr-f::before{content:'';position:absolute;inset:8px;border:1px solid rgba(184,154,110,.15);border-radius:3px;pointer-events:none}
.cvr-b{transform:rotateY(180deg);background:linear-gradient(140deg,#d8cab4,#cebea8);border-radius:0 4px 4px 0}
.cvr-orn{width:32px;height:1px;background:linear-gradient(90deg,transparent,#b89a6e,transparent)}
.cvr-title{font-family:'Playfair Display',serif;font-size:clamp(.7rem,2.2vw,1rem);color:#3c3326;text-align:center;padding:0 1rem;line-height:1.5;font-weight:400}
.cvr-title i{color:#b89a6e;font-weight:500;font-style:italic}
.cvr-year{font-size:.5rem;letter-spacing:.3em;color:#b89a6e}
.cvr-tap{position:absolute;bottom:10px;font-size:.45rem;color:rgba(60,51,38,.18);letter-spacing:.2em;text-transform:uppercase;animation:pulse 2s infinite}
 
/* ── FLIP ── */
.flip{position:absolute;top:0;width:50%;height:100%;z-index:25;pointer-events:none;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}
.flip-fwd{left:50%;transform-origin:left center;animation:flipF .55s cubic-bezier(.36,.07,.19,.97) forwards}
.flip-bwd{left:0;transform-origin:right center;animation:flipB .55s cubic-bezier(.36,.07,.19,.97) forwards}
@keyframes flipF{0%{transform:rotateY(0)}100%{transform:rotateY(-180deg)}}
@keyframes flipB{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
.fl{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}
.fl-photo{background:#fef9f2;border-radius:0 4px 4px 0}
.fl-photo img{width:100%;height:100%;object-fit:cover;display:block}
.fl-cap{transform:rotateY(180deg);background:linear-gradient(155deg,#fffcf7,#fef7ef);border-radius:4px 0 0 4px;display:flex;align-items:center;justify-content:center;padding:clamp(.5rem,2vw,1.2rem);overflow-y:auto}
.fl-cap-f{background:linear-gradient(155deg,#fffcf7,#fef7ef);border-radius:4px 0 0 4px;display:flex;align-items:center;justify-content:center;padding:clamp(.5rem,2vw,1.2rem);overflow-y:auto}
.fl-photo-b{transform:rotateY(180deg);background:#fef9f2;border-radius:0 4px 4px 0;overflow:hidden}
.fl-photo-b img{width:100%;height:100%;object-fit:cover;display:block}
 
/* ── CAPTION (SVG ornaments, no emoji) ── */
.cap{text-align:center;width:100%;max-width:92%;display:flex;flex-direction:column;align-items:center;gap:clamp(2px,0.5vh,6px)}
.cap-num{font-size:clamp(.4rem,1vw,.55rem);letter-spacing:.2em;color:#a88d66;font-weight:600}
.cap-orn{width:20px;height:20px;opacity:.5}
.cap-season{font-family:'Playfair Display',serif;font-size:clamp(.6rem,1.5vw,.85rem);color:#4a3e30;font-weight:500;letter-spacing:.03em}
.cap-line{width:24px;height:0;border-top:1px solid rgba(184,154,110,.3)}
.cap-txt{font-size:clamp(.55rem,1.3vw,.72rem);color:#6b5a48;line-height:1.55;font-style:italic;word-break:break-word;max-height:clamp(40px,8vh,120px);overflow-y:auto}
.cap-year{font-size:clamp(.38rem,.9vw,.48rem);letter-spacing:.2em;color:#b89a6e;font-weight:500}
 
/* ── CASSETTE ── */
.cass{flex-direction:column;gap:1.2rem;background:radial-gradient(ellipse at 50% 45%,#fef7ef,#f0ebe0)}
.cass-t{font-family:'Playfair Display',serif;font-size:1rem;color:#3c3326;letter-spacing:.04em}
.cass-s{font-size:.55rem;letter-spacing:.25em;color:rgba(184,154,110,.45);text-transform:uppercase}
.cass-icon{cursor:pointer;transition:transform .3s}
.cass-icon:hover{transform:scale(1.03) translateY(-2px)}
.cass-icon.eject{animation:eject .6s forwards;pointer-events:none}
@keyframes eject{0%{transform:translateY(0) scale(1);opacity:1}30%{transform:translateY(-10px) scale(1.02)}100%{transform:translateY(30px) scale(.5);opacity:0}}
.cass-skip{font-size:.5rem;color:rgba(60,51,38,.18);text-transform:uppercase;letter-spacing:.2em;cursor:pointer;transition:color .2s}
.cass-skip:hover{color:rgba(60,51,38,.4)}
 
/* ── TV (smaller) ── */
.tv-modal{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s}
.tv-modal.on{opacity:1;pointer-events:auto}
.tv-fr{position:relative;width:min(70vw,420px);background:#2a251e;border-radius:14px 14px 20px 20px;padding:10px 14px 22px;box-shadow:0 16px 32px rgba(0,0,0,.5),0 0 0 1.5px #5e4e38,0 0 0 4px #1f1b14}
.tv-scr{background:#0f0e0a;border-radius:8px;padding:4px}
.tv-inner{position:relative;border-radius:6px;overflow:hidden;aspect-ratio:16/9;background:#000}
.tv-static{position:absolute;inset:0;background:#555;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");transition:opacity .5s;z-index:5}
.tv-static.off{opacity:0}
.tv-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2}
.tv-ifr{position:absolute;inset:0;width:100%;height:100%;z-index:2;border:none;display:none}
.tv-knobs{display:flex;justify-content:center;gap:6px;margin-top:4px}
.tv-knob{width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#6b5a48,#4a3e30);box-shadow:0 1px 2px rgba(0,0,0,.4)}
.tv-brand{text-align:center;margin-top:3px;font-family:'Playfair Display',serif;font-size:.4rem;letter-spacing:.3em;color:#5e4e38;text-transform:uppercase}
.tv-led{position:absolute;bottom:-8px;right:12px;width:4px;height:4px;border-radius:50%;background:#2a251e;transition:all .3s}
.tv-led.on{background:#2eff5e;box-shadow:0 0 6px #2eff5e}
.tv-close{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;background:#3c3326;border:1px solid #b89a6e;color:#e4c87a;font-size:.65rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;z-index:15}
.tv-close:hover{background:#b3472c;color:#fff}
 
/* ── FEEDBACK ── */
.fb{flex-direction:column;padding:1.2rem;background:radial-gradient(ellipse at 50% 25%,#fef7ef,#f0ebe0);overflow-y:auto}
.fb-card{background:rgba(255,252,245,.8);backdrop-filter:blur(8px);border:1px solid rgba(184,154,110,.18);border-radius:18px;padding:1.5rem;max-width:360px;width:100%;box-shadow:0 16px 32px -8px rgba(0,0,0,.06)}
.fb-title{font-family:'Playfair Display',serif;font-size:1.1rem;color:#3c3326;text-align:center;margin-bottom:.2rem}
.fb-sub{color:#a88d66;font-size:.6rem;text-align:center;margin-bottom:1rem;letter-spacing:.1em}
.stars{display:flex;justify-content:center;gap:.4rem;margin-bottom:.8rem}
.star{font-size:1.4rem;cursor:pointer;color:rgba(60,51,38,.07);transition:all .12s}
.star.on{color:#e4c87a;text-shadow:0 0 6px rgba(228,200,122,.3);transform:scale(1.06)}
.fb-input{width:100%;padding:.6rem .8rem;background:rgba(255,255,255,.45);border:1px solid rgba(184,154,110,.25);border-radius:10px;font-size:.72rem;margin-bottom:.5rem;outline:none;font-family:inherit;color:#2e2a24}
.fb-input:focus{border-color:#b89a6e}
.fb-input::placeholder{color:rgba(60,51,38,.15)}
textarea.fb-input{resize:none;height:60px}
.fb-btn{width:100%;padding:.6rem;background:linear-gradient(135deg,#b89a6e,#e4c87a);border:none;border-radius:30px;color:#2e2a24;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:all .2s;font-family:inherit;font-size:.72rem}
.fb-btn:disabled{opacity:.3;cursor:not-allowed}
.thx{text-align:center}
.thx-t{font-family:'Playfair Display',serif;font-size:1rem;color:#b89a6e;margin-bottom:.2rem}
.thx-s{color:#6b5a48;font-size:.65rem}
 
/* ── Hidden preload ── */
.preload{position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;opacity:0;visibility:hidden}
`;
 
/* ─── Season data ─── */
const SEASONS = [
  { name: 'Spring', bg: 'radial-gradient(ellipse at 50% 35%,#fef7ef,#f0ebe0)', icon: 'M12 2C12 2 7 7 7 12c0 2.76 2.24 5 5 5s5-2.24 5-5c0-5-5-10-5-10z' },
  { name: 'Summer', bg: 'radial-gradient(ellipse at 50% 35%,#fff4e8,#f0ebe0)', icon: 'M12 3L14.5 8.5L20.5 9L16 13.5L17.5 19.5L12 16.5L6.5 19.5L8 13.5L3.5 9L9.5 8.5Z' },
  { name: 'Autumn', bg: 'radial-gradient(ellipse at 50% 35%,#fef0e4,#f0ebe0)', icon: 'M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l.37-1C8 17 10 14 17 13v3l5-5-5-5v2z' },
  { name: 'Winter', bg: 'radial-gradient(ellipse at 50% 35%,#f0f4fa,#e8edf5)', icon: 'M12 2l1.09 3.26L16 4l-1.64 2.73L18 8l-3.26 1.09L16 12l-2.73-1.64L12 14l-1.27-3.64L8 12l1.26-2.91L6 8l3.64-1.27L8 4l2.91 1.26z' },
];
 
/* ─── URL helper (Supabase URLs pass through unchanged) ─── */
function resolveUrl(url: string): string {
  if (!url) return '';
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
}
function isYT(u: string) { return /youtu\.?be/.test(u); }
function ytId(u: string) { return u.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || ''; }
 
/* ─── Audio ─── */
let _ctx: AudioContext | null = null;
let _ok = false;
async function initAudio() {
  if (_ok) return;
  try { if (!_ctx) _ctx = new AudioContext(); if (_ctx.state === 'suspended') await _ctx.resume(); _ok = true; } catch {}
}
function playFlip() {
  if (!_ok || !_ctx) return;
  try { const n = _ctx.currentTime; const o = _ctx.createOscillator(); const g = _ctx.createGain(); o.connect(g); g.connect(_ctx.destination); o.type = 'sine'; o.frequency.value = 1100; g.gain.setValueAtTime(0.05, n); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.1); o.start(); o.stop(n + 0.1); } catch {}
}
function playKey() {
  if (!_ok || !_ctx) return;
  try { const n = _ctx.currentTime; const o = _ctx.createOscillator(); const g = _ctx.createGain(); o.connect(g); g.connect(_ctx.destination); o.frequency.value = 1700; g.gain.setValueAtTime(0.01, n); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.04); o.start(); o.stop(n + 0.04); } catch {}
}
 
/* ─── Season SVG icon (no emoji) ─── */
const SeasonIcon = ({ path }: { path: string }) => (
  <svg className="cap-orn" viewBox="0 0 24 24" fill="none" stroke="#b89a6e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);
 
/* ─── Caption Component ─── */
 
const SEASON_NAMES = ['Spring', 'Summer', 'Autumn', 'Winter'];
 
const Caption = ({ photo, index, year }: { photo: AlbumPhoto; index: number; year: string }) => {
  const seasonName = SEASON_NAMES[index % 4];
  // Try multiple possible field names for caption text
  const text = (photo as any).caption || (photo as any).description || (photo as any).text || (photo as any).message || 'A cherished memory';
 
  return (
    <div style={{
      textAlign: 'center',
      width: '100%',
      maxWidth: '90%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      color: '#4a3e30',
      fontFamily: "'Playfair Display', 'Georgia', serif",
    }}>
      <div style={{
        fontSize: '0.5rem',
        letterSpacing: '0.2em',
        color: '#a88d66',
        fontWeight: 600,
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>
 
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b89a6e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <path d="M12 3L14.5 8.5L20.5 9L16 13.5L17.5 19.5L12 16.5L6.5 19.5L8 13.5L3.5 9L9.5 8.5Z" />
      </svg>
 
      <div style={{
        fontSize: 'clamp(0.65rem, 1.8vw, 0.9rem)',
        fontWeight: 500,
        letterSpacing: '0.03em',
        color: '#4a3e30',
      }}>
        {seasonName}
      </div>
 
      <div style={{
        width: '24px',
        height: '0px',
        borderTop: '1px solid rgba(184,154,110,0.3)',
      }} />
 
      <div style={{
        fontSize: 'clamp(0.55rem, 1.4vw, 0.75rem)',
        color: '#6b5a48',
        lineHeight: 1.6,
        fontStyle: 'italic',
        fontWeight: 400,
        wordBreak: 'break-word' as const,
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        maxHeight: '120px',
        overflowY: 'auto' as const,
      }}>
        {text}
      </div>
 
      <div style={{
        fontSize: '0.45rem',
        letterSpacing: '0.2em',
        color: '#b89a6e',
        fontWeight: 500,
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}>
        {year}
      </div>
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
  const greeting = "Happy Mother's Day\nWith all our love";
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
 
  const cRef = useRef<HTMLCanvasElement>(null);
  const pRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const iRef = useRef<HTMLIFrameElement>(null);
  const txRef = useRef(0);
 
  const season = SEASONS[page % 4];
  const progress = screen === 'intro' ? 5 : screen === 'greet' ? 18 : screen === 'book' ? 35 + (page / Math.max(1, photos.length - 1)) * 45 : screen === 'cass' ? 85 : 98;
 
  /* ═══ PRELOAD ═══ */
  useEffect(() => {
    const urls = imageUrls.filter(Boolean);
    if (!urls.length) { setLoadPct(100); setLoaded(true); return; }
    let done = 0;
    Promise.all(urls.map(u => new Promise<void>(r => {
      const img = new Image();
      img.onload = img.onerror = () => { done++; setLoadPct(Math.round((done / urls.length) * 100)); r(); };
      img.src = u;
    }))).then(() => setTimeout(() => setLoaded(true), 200));
  }, [imageUrls]);
 
  /* ═══ CSS ═══ */
  useEffect(() => {
    let el = document.getElementById('mj-css') as HTMLStyleElement;
    if (!el) { el = document.createElement('style'); el.id = 'mj-css'; document.head.appendChild(el); }
    el.textContent = CSS;
    return () => { el?.remove(); };
  }, []);
 
  /* ═══ AUDIO INIT ═══ */
  useEffect(() => {
    const h = () => { initAudio(); document.removeEventListener('click', h); document.removeEventListener('touchstart', h); };
    document.addEventListener('click', h); document.addEventListener('touchstart', h);
    return () => { document.removeEventListener('click', h); document.removeEventListener('touchstart', h); };
  }, []);
 
  /* ═══ MUSIC ═══ */
  useEffect(() => {
    const mu = (album as any).background_music_url;
    if (!mu) return;
    const a = new Audio(mu); a.loop = true; a.volume = 0.2;
    const p = () => { a.play().catch(() => {}); document.removeEventListener('click', p); document.removeEventListener('touchstart', p); };
    document.addEventListener('click', p); document.addEventListener('touchstart', p);
    return () => { a.pause(); a.src = ''; document.removeEventListener('click', p); document.removeEventListener('touchstart', p); };
  }, [album]);
 
  /* ═══ INTRO STARS ═══ */
  useEffect(() => {
    if (screen !== 'intro' || !loaded) return;
    const cv = cRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!; let id: number;
    const re = () => { cv.width = innerWidth; cv.height = innerHeight; }; re(); addEventListener('resize', re);
    const st = Array.from({ length: 100 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1 + 0.2, a: Math.random(), d: (Math.random() * .004 + .001) * (Math.random() > .5 ? 1 : -1) }));
    setTimeout(() => setIntroVis(true), 400);
    const draw = () => { id = requestAnimationFrame(draw); ctx.clearRect(0, 0, cv.width, cv.height); for (const s of st) { s.a += s.d; if (s.a > .7 || s.a < .05) s.d *= -1; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(60,51,38,${.03 + s.a * .08})`; ctx.fill(); } }; draw();
    return () => { cancelAnimationFrame(id); removeEventListener('resize', re); };
  }, [screen, loaded]);
 
  /* ═══ TYPEWRITER ═══ */
  useEffect(() => {
    if (screen !== 'greet') return;
    const el = tRef.current; if (!el) return;
    el.textContent = ''; setGreetDone(false); let i = 0;
    const t = setInterval(() => { if (i >= greeting.length) { clearInterval(t); setTimeout(() => setGreetDone(true), 300); return; } const c = greeting[i++]; if (c === '\n') { el.appendChild(document.createElement('br')); } else { el.appendChild(document.createTextNode(c)); playKey(); } }, 50);
    return () => clearInterval(t);
  }, [screen, greeting]);
 
  /* ═══ PARTICLES ═══ */
  useEffect(() => {
    if (screen !== 'book') return;
    const cv = pRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!; let id: number;
    const re = () => { cv.width = innerWidth; cv.height = innerHeight; }; re(); addEventListener('resize', re);
    const pts: { x: number; y: number; vx: number; vy: number; s: number; l: number; m: number; a: number; sp: number }[] = [];
    const add = () => pts.push({ x: Math.random() * cv.width, y: cv.height + 5, vx: (Math.random() - .5) * .25, vy: -.4 - Math.random() * .5, s: 3 + Math.random() * 3, l: 0, m: 100 + Math.random() * 60, a: Math.random() * 6.28, sp: (Math.random() - .5) * .01 });
    for (let j = 0; j < 3; j++) add(); let f = 0;
    const draw = () => { id = requestAnimationFrame(draw); ctx.clearRect(0, 0, cv.width, cv.height); f++; if (f % 50 === 0 && pts.length < 10) add(); for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; p.x += p.vx; p.y += p.vy; p.l++; p.a += p.sp; const al = p.l < 18 ? p.l / 18 : p.l > p.m - 18 ? (p.m - p.l) / 18 : .25; if (p.l > p.m || p.y < -20) { pts.splice(i, 1); continue; } ctx.save(); ctx.globalAlpha = al; ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.beginPath(); ctx.moveTo(0, -p.s); for (let k = 0; k < 5; k++) { ctx.lineTo(Math.cos((k * 4 * Math.PI / 5) - Math.PI / 2) * p.s, Math.sin((k * 4 * Math.PI / 5) - Math.PI / 2) * p.s); } ctx.closePath(); ctx.fillStyle = 'rgba(184,154,110,.15)'; ctx.fill(); ctx.restore(); } }; draw();
    return () => { cancelAnimationFrame(id); removeEventListener('resize', re); };
  }, [screen, season]);
 
  /* ═══ FLIP ═══ */
  const doFlip = useCallback((dir: 'fwd' | 'bwd') => {
    if (busy || !coverOpen || flipDir) return;
    const tgt = dir === 'fwd' ? page + 1 : page - 1;
    if (tgt < 0 || tgt >= photos.length) return;
    setBusy(true); setFlipFrom(page); setFlipDir(dir); playFlip();
    setTimeout(() => {
      setPage(tgt); setFlipDir(null); setBusy(false);
      if (dir === 'fwd' && tgt === photos.length - 1) setTimeout(() => setScreen(videoUrl ? 'cass' : 'fb'), 700);
    }, 570);
  }, [busy, coverOpen, flipDir, page, photos.length, videoUrl]);
 
  const openCover = useCallback(() => {
    if (coverOpen || busy) return; initAudio(); setBusy(true); setCoverOpen(true);
    setTimeout(() => { setNavVis(true); setBusy(false); }, 1000);
  }, [coverOpen, busy]);
 
  const onTS = (e: React.TouchEvent) => { txRef.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => { if (!coverOpen) { openCover(); return; } const d = e.changedTouches[0].clientX - txRef.current; if (Math.abs(d) > 35) doFlip(d < 0 ? 'fwd' : 'bwd'); };
 
  /* ═══ TV ═══ */
  const openTV = () => {
    document.querySelector('.cass-icon')?.classList.add('eject');
    setTimeout(() => { setTvOn(true); setTvStatic(true); setTvLed(false);
      setTimeout(() => { setTvStatic(false); setTvLed(true);
        if (videoUrl) { if (isYT(videoUrl)) { const f = iRef.current; if (f) { f.src = `https://www.youtube-nocookie.com/embed/${ytId(videoUrl)}?autoplay=1&controls=1&rel=0`; f.style.display = 'block'; } } else { const v = vRef.current; if (v) { v.src = resolveUrl(videoUrl); v.muted = false; v.play().catch(() => { v.muted = true; v.play(); }); } } }
      }, 700); }, 400);
  };
  const closeTV = () => { setTvOn(false); setTvStatic(true); setTvLed(false); if (vRef.current) { vRef.current.pause(); vRef.current.src = ''; } if (iRef.current) { iRef.current.src = ''; iRef.current.style.display = 'none'; } document.querySelector('.cass-icon')?.classList.remove('eject'); setScreen('fb'); };
 
  /* ═══ FEEDBACK ═══ */
  const submitFb = async () => {
    if (!rating) { alert('Please select a rating'); return; } setFbLoading(true);
    try { const r = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ album_id: album.id, rating, comment: fbComment.trim() || (fbName ? `From ${fbName}` : 'Sent with love') }) }); if (!r.ok) throw new Error(); setFbSent(true); } catch { alert('Could not send. Please try again.'); } finally { setFbLoading(false); }
  };
 
  /* ═══════ RENDER ═══════ */
  return (
    <>
      {/* Force landscape notice */}
      <div className="rotate-notice">
        <svg viewBox="0 0 24 24" fill="none" stroke="#b89a6e" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M12 18h.01" /></svg>
        <p>Please rotate your phone<br />to landscape mode</p>
        <span>For the best experience</span>
      </div>
 
      {/* Hidden image preload */}
      <div className="preload" aria-hidden="true">
        {imageUrls.map((u, i) => u ? <img key={i} src={u} alt="" /> : null)}
      </div>
 
      <div className="app-root">
        {/* Loading */}
        <div className={`ld ${loaded ? 'done' : ''}`}>
          <div className="ld-ring" />
          <div className="ld-pct">{loadPct}%</div>
          <div className="ld-sub">Preparing your memories</div>
          <div className="ld-bar" style={{ width: `${loadPct}%` }} />
        </div>
 
        <div className="grain" />
        <div className="prog"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
 
        {/* ═══ INTRO ═══ */}
        <div className={`scr intro ${screen === 'intro' ? 'on' : ''}`} onClick={() => setScreen('greet')}>
          <canvas ref={cRef} />
          <div className={`intro-c ${introVis ? 'vis' : ''}`}>
            <div className="intro-t">To the world, you are a mother.<br /><span style={{ fontSize: '.72em', opacity: .55 }}>To our family, you are <i>the world</i>.</span></div>
            <div className="intro-s">Begin your journey</div>
          </div>
          <div className="intro-tap">TAP TO OPEN</div>
        </div>
 
        {/* ═══ GREETING ═══ */}
        <div className={`scr greet ${screen === 'greet' ? 'on' : ''}`}>
          <div className="greet-card">
            <div className="greet-lbl">A MESSAGE FOR YOU</div>
            <div className="greet-txt" ref={tRef}><span className="cursor-bl" /></div>
            <div className={`greet-cta ${greetDone ? 'vis' : ''}`} onClick={() => greetDone && setScreen('book')}>OPEN YOUR ALBUM</div>
          </div>
        </div>
 
        {/* ═══ BOOK ═══ */}
        <div className={`scr bk ${screen === 'book' ? 'on' : ''}`}>
          <div className="bk-bg" style={{ background: season.bg }} />
          <canvas ref={pRef} className="bk-particles" />
          <div className="bk-wrap">
            <div className="bk-frame">
              <div className="bk-shadow" />
              <div className="bk-3d" onTouchStart={onTS} onTouchEnd={onTE}>
 
                {/* Main spread — current page: caption left, photo right */}
                <div className="spread" style={{ zIndex: 5 }}>
                  <div className="sp-l">
                    {photos[page] ? <Caption photo={photos[page]} index={page} year={year} /> : null}
                  </div>
                  <div className="sp-r" onClick={() => coverOpen && !busy && doFlip('fwd')}>
                    {imageUrls[page] ? <img src={imageUrls[page]} alt="" /> : null}
                  </div>
                </div>
 
                <div className="spine" />
 
                {/* Flip overlay — only during animation */}
                {flipDir === 'fwd' && (
                  <div key={`f${flipFrom}`} className="flip flip-fwd" style={{ zIndex: 25 }}>
                    <div className="fl fl-photo">{imageUrls[flipFrom] ? <img src={imageUrls[flipFrom]} alt="" /> : null}</div>
                    <div className="fl fl-cap">{photos[flipFrom + 1] ? <Caption photo={photos[flipFrom + 1]} index={flipFrom + 1} year={year} /> : null}</div>
                  </div>
                )}
                {flipDir === 'bwd' && (
                  <div key={`b${flipFrom}`} className="flip flip-bwd" style={{ zIndex: 25 }}>
                    <div className="fl fl-cap-f">{photos[flipFrom] ? <Caption photo={photos[flipFrom]} index={flipFrom} year={year} /> : null}</div>
                    <div className="fl fl-photo-b">{imageUrls[flipFrom - 1] ? <img src={imageUrls[flipFrom - 1]} alt="" /> : null}</div>
                  </div>
                )}
 
                {/* Cover */}
                <div className={`cover ${coverOpen ? 'open' : ''}`} onClick={() => !coverOpen && openCover()}>
                  <div className="cvr-f">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b89a6e" strokeWidth="1" style={{ opacity: .5 }}>
                      <path d="M12 3L14.5 8.5L20.5 9L16 13.5L17.5 19.5L12 16.5L6.5 19.5L8 13.5L3.5 9L9.5 8.5Z" />
                    </svg>
                    <div className="cvr-orn" />
                    <div className="cvr-title">For the Most Wonderful<br /><i>{recipient}</i></div>
                    <div className="cvr-orn" />
                    <div className="cvr-year">{year}</div>
                    {!coverOpen && <div className="cvr-tap">TAP TO OPEN</div>}
                  </div>
                  <div className="cvr-b" />
                </div>
              </div>
            </div>
 
            <div className={`nav-row ${navVis ? 'vis' : ''}`}>
              <button className="nav-btn" disabled={page === 0 || busy} onClick={() => doFlip('bwd')}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2L4 6L8 10" /></svg>
              </button>
              <div className="nav-dots">
                {photos.map((_, i) => <div key={i} className={`dot ${i === page ? 'on' : ''}`} onClick={() => !busy && coverOpen && i !== page && doFlip(i > page ? 'fwd' : 'bwd')} />)}
              </div>
              <span className="nav-pg">{page + 1} / {photos.length}</span>
              <button className="nav-btn" disabled={busy} onClick={() => page < photos.length - 1 ? doFlip('fwd') : setScreen(videoUrl ? 'cass' : 'fb')}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2L8 6L4 10" /></svg>
              </button>
            </div>
          </div>
        </div>
 
        {/* ═══ CASSETTE ═══ */}
        <div className={`scr cass ${screen === 'cass' ? 'on' : ''}`}>
          <div className="cass-t">One Last Surprise</div>
          <div className="cass-s">press play to watch</div>
          <div className="cass-icon" onClick={openTV}>
            <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
              <rect x="6" y="12" width="188" height="96" rx="10" fill="#e9dbc9" stroke="#b89a6e" strokeWidth=".8" />
              <rect x="12" y="18" width="176" height="80" rx="6" fill="#fef7ef" />
              <rect x="22" y="26" width="156" height="42" rx="5" fill="#f4ede3" stroke="#d4c2a8" strokeWidth=".6" />
              <text x="100" y="48" fontFamily="'Playfair Display',serif" fontSize="10" fill="#b89a6e" textAnchor="middle" letterSpacing="3">MEMORIES</text>
              <text x="100" y="60" fontFamily="serif" fontSize="6" fill="#a88d66" textAnchor="middle" letterSpacing="2">WITH LOVE</text>
              <rect x="28" y="80" width="56" height="16" rx="3" fill="#e9dbc9" stroke="#b89a6e" strokeWidth=".5" />
              <rect x="116" y="80" width="56" height="16" rx="3" fill="#e9dbc9" stroke="#b89a6e" strokeWidth=".5" />
              <circle cx="56" cy="88" r="6" fill="#f4ede3" stroke="#b89a6e" strokeWidth=".5" /><circle cx="56" cy="88" r="2.5" fill="#b89a6e" />
              <circle cx="144" cy="88" r="6" fill="#f4ede3" stroke="#b89a6e" strokeWidth=".5" /><circle cx="144" cy="88" r="2.5" fill="#b89a6e" />
            </svg>
          </div>
          <div className="cass-skip" onClick={() => setScreen('fb')}>Skip</div>
        </div>
 
        {/* ═══ TV ═══ */}
        <div className={`tv-modal ${tvOn ? 'on' : ''}`}>
          <div className="tv-fr">
            <div className="tv-scr"><div className="tv-inner">
              <div className={`tv-static ${tvStatic ? '' : 'off'}`} />
              <video ref={vRef} className="tv-vid" playsInline controls onEnded={closeTV} />
              <iframe ref={iRef} className="tv-ifr" allow="autoplay" title="Video" />
            </div></div>
            <div className="tv-knobs"><div className="tv-knob" /><div className="tv-knob" /></div>
            <div className="tv-brand">MEMÓRIA</div>
            <div className={`tv-led ${tvLed ? 'on' : ''}`} />
            <div className="tv-close" onClick={closeTV}>✕</div>
          </div>
        </div>
 
        {/* ═══ FEEDBACK ═══ */}
        <div className={`scr fb ${screen === 'fb' ? 'on' : ''}`}>
          <div className="fb-card">
            {!fbSent ? (<>
              <div className="fb-title">How Did We Do?</div>
              <div className="fb-sub">Your voice means everything</div>
              <div className="stars">{[1,2,3,4,5].map(n => <span key={n} className={`star ${n <= rating ? 'on' : ''}`} onClick={() => setRating(n)}>&#9733;</span>)}</div>
              <input className="fb-input" placeholder="Your name (optional)" value={fbName} onChange={e => setFbName(e.target.value)} />
              <textarea className="fb-input" placeholder="Leave a message of love..." value={fbComment} onChange={e => setFbComment(e.target.value)} />
              <button className="fb-btn" disabled={fbLoading} onClick={submitFb}>{fbLoading ? 'Sending...' : 'Send Love'}</button>
            </>) : (
              <div className="thx">
                <div className="thx-t">Thank You</div>
                <div className="thx-s">Your message has been received with love.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
