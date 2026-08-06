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

// The big single-machine view shown inside a level, reacting live to the run:
// grey and calm when idle, red + smoke that intensifies with `fraction` while
// a memory leak grows, a green pulse on success, a red flash + spark burst on
// any failure (wrong output, compile error, timeout, crash). Same drawing
// language as FactoryScene's per-level machines, just bigger and reactive to
// a single continuous "how bad is it" value instead of a done/not-done flag.
export class SingleMachineScene extends Phaser.Scene {
  private state: MachineState = { kind: 'idle' }
  private ready = false

  private body!: Phaser.GameObjects.Graphics
  private statusText!: Phaser.GameObjects.Text
  private gauge!: Phaser.GameObjects.Arc
  private gaugeGlow!: Phaser.GameObjects.Arc
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
    const bodyW = w - 40
    const bodyH = h - 44
    const cx = w / 2
    const cy = h / 2 + 4

    // Panel backdrop so the whole thing reads as a distinct framed display,
    // not empty space blending into the app's near-black background.
    this.cameras.main.setBackgroundColor(0x131316)
    const backdrop = this.add.graphics()
    backdrop.fillStyle(0x131316, 1)
    backdrop.fillRect(0, 0, w, h)
    backdrop.lineStyle(1, 0x27272a, 1)
    for (let x = 0; x < w; x += 20) backdrop.lineBetween(x, 0, x, h)
    for (let y = 0; y < h; y += 20) backdrop.lineBetween(0, y, w, y)

    this.body = this.add.graphics()
    this.drawBody(cx, cy, bodyW, bodyH, 0x35353d)

    const chimneyX = cx - bodyW / 2 + 32
    const chimneyTopY = cy - bodyH / 2 - 4
    this.add
      .rectangle(chimneyX, chimneyTopY, 20, 28, 0x46464f)
      .setStrokeStyle(2, 0x5a5a66)

    this.statusText = this.add
      .text(cx - bodyW / 2 + 60, cy - bodyH / 2 + 14, STATUS_LABEL.idle, {
        fontFamily: 'ui-monospace, monospace',
        fontSize: '15px',
        fontStyle: 'bold',
        color: STATUS_COLOR.idle,
      })
      .setOrigin(0, 0.5)

    this.gaugeGlow = this.add.circle(cx + bodyW / 2 - 38, cy - bodyH / 2 + 20, 22, 0x71717a, 0.25)
    this.gauge = this.add.circle(cx + bodyW / 2 - 38, cy - bodyH / 2 + 20, 14, 0x71717a)
    this.gauge.setStrokeStyle(3, 0x18181b)

    this.smokeEmitter = this.add.particles(chimneyX, chimneyTopY - 14, 'machine-dot', {
      speed: { min: 6, max: 16 },
      angle: { min: 250, max: 290 },
      scale: { start: 1, end: 0.15 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 1000,
      frequency: 400,
      tint: 0xb4b4bd,
    })
    this.smokeEmitter.stop()

    this.sparkEmitter = this.add.particles(cx, cy, 'machine-dot', {
      speed: { min: 60, max: 160 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      tint: [0xef4444, 0xf59e0b],
      quantity: 22,
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

  private drawBody(cx: number, cy: number, bodyW: number, bodyH: number, fill: number) {
    const g = this.body
    g.clear()
    g.fillStyle(fill, 1)
    g.fillRoundedRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH, 10)
    g.lineStyle(3, 0x5a5a66, 1)
    g.strokeRoundedRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH, 10)
    g.fillStyle(0x1f1f24, 1)
    g.fillRoundedRect(cx - bodyW / 2 + 10, cy - bodyH / 2 + 10, bodyW - 20, 32, 5)
    g.lineStyle(1, 0x3f3f46, 1)
    g.strokeRoundedRect(cx - bodyW / 2 + 10, cy - bodyH / 2 + 10, bodyW - 20, 32, 5)
    g.fillStyle(0x71717a, 1)
    const inset = 10
    ;[
      [cx - bodyW / 2 + inset, cy - bodyH / 2 + inset],
      [cx + bodyW / 2 - inset, cy - bodyH / 2 + inset],
      [cx - bodyW / 2 + inset, cy + bodyH / 2 - inset],
      [cx + bodyW / 2 - inset, cy + bodyH / 2 - inset],
    ].forEach(([x, y]) => g.fillCircle(x, y, 3))
  }

  private applyState() {
    this.flashTween?.stop()
    this.idleTween?.stop()
    this.gauge.setScale(1)
    this.gaugeGlow.setScale(1)
    this.statusText.setText(STATUS_LABEL[this.state.kind])
    this.statusText.setColor(STATUS_COLOR[this.state.kind])

    switch (this.state.kind) {
      case 'idle': {
        this.smokeEmitter.stop()
        this.gauge.setFillStyle(0x71717a)
        this.gaugeGlow.setFillStyle(0x71717a, 0.2)
        this.idleTween = this.tweens.add({
          targets: this.gaugeGlow,
          alpha: { from: 0.5, to: 1 },
          duration: 1400,
          yoyo: true,
          repeat: -1,
        })
        break
      }
      case 'danger': {
        const f = Phaser.Math.Clamp(this.state.fraction, 0, 1)
        this.gauge.setFillStyle(0xef4444)
        this.gaugeGlow.setFillStyle(0xef4444, 0.25 + f * 0.45)
        this.gaugeGlow.setScale(1 + f * 0.7)
        this.smokeEmitter.setFrequency(Phaser.Math.Linear(420, 60, f))
        this.smokeEmitter.start()
        if (f > 0.75) {
          this.flashTween = this.tweens.add({
            targets: this.gauge,
            scale: 1.25,
            duration: 180,
            yoyo: true,
            repeat: -1,
          })
        }
        break
      }
      case 'success': {
        this.smokeEmitter.stop()
        this.gauge.setFillStyle(0x34d399)
        this.gaugeGlow.setFillStyle(0x34d399, 0.4)
        this.flashTween = this.tweens.add({
          targets: [this.gauge, this.gaugeGlow],
          scale: 1.4,
          duration: 220,
          yoyo: true,
          ease: 'Quad.easeOut',
        })
        break
      }
      case 'fault': {
        this.smokeEmitter.stop()
        this.gauge.setFillStyle(0xef4444)
        this.gaugeGlow.setFillStyle(0xef4444, 0.45)
        this.sparkEmitter.explode(22)
        this.cameras.main.shake(220, 0.006)
        this.flashTween = this.tweens.add({
          targets: this.gauge,
          scale: 1.3,
          duration: 90,
          yoyo: true,
          repeat: 4,
        })
        break
      }
    }
  }
}
