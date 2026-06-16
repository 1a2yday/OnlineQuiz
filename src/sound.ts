/**
 * 音效模块 — 使用 Web Audio API 程序化合成音效
 * 零文件下载，极小流量消耗（纯 JS 生成，~2KB）
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // 用户交互后可能被暂停，自动恢复
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** 播放简单音调 */
function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  rampDown = true,
): void {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    if (rampDown) {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // 静默失败，不阻塞游戏流程
  }
}

/** 播放双音（如正确音效的 C→E 和弦） */
function playDualTone(
  f1: number,
  f2: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.12,
): void {
  try {
    const ctx = getCtx();
    [f1, f2].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(volume, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + duration);
    });
  } catch { /* 静默 */ }
}

// ========== 公开 API ==========

/** 选项点击 / 选中音效 — 短促清脆嗒声 */
export function playSelect(): void {
  playTone(880, 0.08, 'sine', 0.06);
}

/** 消消乐配对成功 — 升调叮咚 */
export function playMatch(): void {
  playTone(660, 0.12, 'triangle', 0.12);
  setTimeout(() => playTone(880, 0.1, 'triangle', 0.1), 80);
}

/** 答对 — 欢快 C→E 双音 */
export function playCorrect(): void {
  playDualTone(523, 659, 0.2, 'sine', 0.14);
}

/** 答错 / 配对失败 — 低沉嗡声 */
export function playWrong(): void {
  playTone(200, 0.25, 'sawtooth', 0.05);
}

/** 消消乐全部完成 — 更强的正确音效 */
export function playAllMatched(): void {
  try {
    const ctx = getCtx();
    // 三音上行: C→E→G
    [523, 659, 784].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.25);
    });
  } catch { /* 静默 */ }
}
