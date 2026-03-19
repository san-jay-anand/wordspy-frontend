// All sounds generated using Web Audio API — no external files needed!

const AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// Short beep sound
function beep(frequency = 440, duration = 0.1, volume = 0.3, type = "sine") {
  try {
    const context  = getCtx();
    const oscillator = context.createOscillator();
    const gainNode   = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  } catch (err) {
    console.log("Sound error:", err);
  }
}

// 🔊 Timer tick — short click
export function playTick() {
  beep(800, 0.05, 0.2, "square");
}

// 🔊 Timer warning — urgent beep
export function playWarningTick() {
  beep(1200, 0.08, 0.3, "square");
}

// 🔔 Your turn — rising ding
export function playYourTurn() {
  try {
    const context  = getCtx();
    const oscillator = context.createOscillator();
    const gainNode   = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(400, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, context.currentTime + 0.15);
    oscillator.frequency.linearRampToValueAtTime(1200, context.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.4, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.4);
  } catch (err) {}
}

// 🎵 Whoosh — new round
export function playWhoosh() {
  try {
    const context  = getCtx();
    const oscillator = context.createOscillator();
    const gainNode   = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(200, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  } catch (err) {}
}

// ⚡ Description pop
export function playPop() {
  beep(600, 0.08, 0.2, "sine");
}

// 🎉 Win sound
export function playWin() {
  try {
    const context = getCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc  = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, context.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + i * 0.15 + 0.3);
      osc.start(context.currentTime + i * 0.15);
      osc.stop(context.currentTime + i * 0.15 + 0.3);
    });
  } catch (err) {}
}

// 😈 Lose sound
export function playLose() {
  try {
    const context = getCtx();
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
      const osc  = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.frequency.value = freq;
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.2, context.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + i * 0.15 + 0.3);
      osc.start(context.currentTime + i * 0.15);
      osc.stop(context.currentTime + i * 0.15 + 0.3);
    });
  } catch (err) {}
}