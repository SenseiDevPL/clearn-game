import Phaser from 'phaser'

export const MACHINE_VIEW_WIDTH = 352
export const MACHINE_VIEW_HEIGHT = 160

export type MachineState =
  | { kind: 'idle' }
  | { kind: 'danger'; fraction: number }
  | { kind: 'success' }
  | { kind: 'fault' }

const STATUS_LABEL: Record<MachineState['kind'], string> = {
  idle: 'GOTOWA',
  danger: 'AWARIA W TOKU',
  success: 'NAPRAWIONO',
  fault: 'USTERKA',
}

const STATUS_COLOR: Record<MachineState['kind'], string> = {
  idle: '#a1a1aa',
  danger: '#f87171',
  success: '#34d399',
  fault: '#f87171',
}

const EMOJI: Record<MachineState['kind'], string> = {
  idle: '⚙️',
  danger: '🔥',
  success: '✅',
  fault: '💥',
}

// The big single-machine view shown inside a level, reacting live to the run.
// Uses a large emoji as the main picture (colorful, unmistakably a picture —
// procedurally drawn shapes read as "just a grey box" to non-technical eyes)
// plus a status word and particle effects layered around it: idle/calm, red
// fire + smoke that intensifies with `fraction` while a memory leak grows,
// a green checkmark pulse on success, an explosion + shake on any failure.
export class SingleMachineScene extends Phaser.Scene {
  private state: MachineState = { kind: 'idle' }
  private ready = false

  private emojiText!: Phaser.GameObjects.Text
  private statusText!: Phaser.GameObjects.Text
  private smokeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  private sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  private flashTween: Phaser.Tweens.Tween | null = null
  private idleTween: Phaser.Tweens.Tween | null = null

  constructor() {
    super('single-machine')
  }

  create() {
    const dot = this.add.graphics()
    dot.fillStyle(0xffffff, 1)
    dot.fillCircle(8, 8, 8)
    dot.generateTexture('machine-dot', 16, 16)
    dot.destroy()

    const w = MACHINE_VIEW_WIDTH
    const h = MACHINE_VIEW_HEIGHT
    const cx = w / 2

    this.cameras.main.setBackgroundColor(0x131316)
    const backdrop = this.add.graphics()
    backdrop.fillStyle(0x131316, 1)
    backdrop.fillRect(0, 0, w, h)
    backdrop.lineStyle(1, 0x27272a, 1)
    for (let x = 0; x < w; x += 20) backdrop.lineBetween(x, 0, x, h)
    for (let y = 0; y < h; y += 20) backdrop.lineBetween(0, y, w, y)

    this.emojiText = this.add
      .text(cx, 58, EMOJI.idle, { fontSize: '56px' })
      .setOrigin(0.5, 0.5)

    this.statusText = this.add
      .text(cx, 118, STATUS_LABEL.idle, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: STATUS_COLOR.idle,
      })
      .setOrigin(0.5, 0.5)

    this.smokeEmitter = this.add.particles(cx - 30, 30, 'machine-dot', {
      speed: { min: 8, max: 20 },
      angle: { min: 250, max: 290 },
      scale: { start: 1.1, end: 0.15 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 1100,
      frequency: 400,
      tint: 0xb4b4bd,
    })
    this.smokeEmitter.stop()

    this.sparkEmitter = this.add.particles(cx, 58, 'machine-dot', {
      speed: { min: 60, max: 170 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 550,
      tint: [0xef4444, 0xf59e0b],
      quantity: 26,
    })
    this.sparkEmitter.stop()

    this.ready = true
    this.applyState()
  }

  setState(next: MachineState) {
    this.state = next
    if (!this.ready) return
    this.applyState()
  }

  private applyState() {
    this.flashTween?.stop()
    this.idleTween?.stop()
    this.emojiText.setScale(1)
    this.emojiText.setAngle(0)
    this.emojiText.setText(EMOJI[this.state.kind])
    this.statusText.setText(STATUS_LABEL[this.state.kind])
    this.statusText.setColor(STATUS_COLOR[this.state.kind])

    switch (this.state.kind) {
      case 'idle': {
        this.smokeEmitter.stop()
        this.idleTween = this.tweens.add({
          targets: this.emojiText,
          angle: { from: -6, to: 6 },
          duration: 1600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
        break
      }
      case 'danger': {
        const f = Phaser.Math.Clamp(this.state.fraction, 0, 1)
        this.smokeEmitter.setFrequency(Phaser.Math.Linear(420, 60, f))
        this.smokeEmitter.start()
        this.flashTween = this.tweens.add({
          targets: this.emojiText,
          scale: { from: 1, to: 1.08 + f * 0.25 },
          duration: Phaser.Math.Linear(500, 130, f),
          yoyo: true,
          repeat: -1,
        })
        break
      }
      case 'success': {
        this.smokeEmitter.stop()
        this.flashTween = this.tweens.add({
          targets: this.emojiText,
          scale: 1.5,
          duration: 260,
          yoyo: true,
          ease: 'Back.easeOut',
        })
        break
      }
      case 'fault': {
        this.smokeEmitter.stop()
        this.sparkEmitter.explode(26)
        this.cameras.main.shake(250, 0.008)
        this.flashTween = this.tweens.add({
          targets: this.emojiText,
          scale: { from: 0.6, to: 1.3 },
          angle: { from: -8, to: 8 },
          duration: 90,
          yoyo: true,
          repeat: 4,
        })
        break
      }
    }
  }
}
