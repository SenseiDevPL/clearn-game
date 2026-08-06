import Phaser from 'phaser'

export const MACHINE_VIEW_WIDTH = 352
export const MACHINE_VIEW_HEIGHT = 160

export type MachineState =
  | { kind: 'idle' }
  | { kind: 'danger'; fraction: number }
  | { kind: 'success' }
  | { kind: 'fault' }

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
  private gauge!: Phaser.GameObjects.Arc
  private gaugeGlow!: Phaser.GameObjects.Arc
  private smokeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  private sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  private flashTween: Phaser.Tweens.Tween | null = null

  constructor() {
    super('single-machine')
  }

  create() {
    const dot = this.add.graphics()
    dot.fillStyle(0xffffff, 1)
    dot.fillCircle(8, 8, 8)
    dot.generateTexture('machine-dot', 16, 16)
    dot.destroy()

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)')

    const w = MACHINE_VIEW_WIDTH
    const h = MACHINE_VIEW_HEIGHT
    const bodyW = w - 40
    const bodyH = h - 44
    const cx = w / 2
    const cy = h / 2 + 4

    this.body = this.add.graphics()
    this.drawBody(cx, cy, bodyW, bodyH, 0x2a2a30)

    const chimneyX = cx - bodyW / 2 + 30
    const chimneyTopY = cy - bodyH / 2 - 4
    this.add.rectangle(chimneyX, chimneyTopY, 18, 26, 0x3f3f46).setStrokeStyle(1, 0x52525b)

    this.gaugeGlow = this.add.circle(cx + bodyW / 2 - 34, cy - bodyH / 2 + 26, 20, 0x52525b, 0.25)
    this.gauge = this.add.circle(cx + bodyW / 2 - 34, cy - bodyH / 2 + 26, 13, 0x52525b)
    this.gauge.setStrokeStyle(2, 0x18181b)

    this.smokeEmitter = this.add.particles(chimneyX, chimneyTopY - 12, 'machine-dot', {
      speed: { min: 6, max: 16 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.9, end: 0.1 },
      alpha: { start: 0.65, end: 0 },
      lifespan: 1000,
      frequency: 400,
      tint: 0xa1a1aa,
    })
    this.smokeEmitter.stop()

    this.sparkEmitter = this.add.particles(cx, cy, 'machine-dot', {
      speed: { min: 60, max: 160 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.7, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      tint: [0xef4444, 0xf59e0b],
      quantity: 18,
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
    g.lineStyle(2, 0x3f3f46, 1)
    g.strokeRoundedRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH, 10)
    g.fillStyle(0x1f1f24, 1)
    g.fillRoundedRect(cx - bodyW / 2 + 10, cy - bodyH / 2 + 10, bodyW - 20, 30, 5)
    g.fillStyle(0x52525b, 1)
    const inset = 10
    ;[
      [cx - bodyW / 2 + inset, cy - bodyH / 2 + inset],
      [cx + bodyW / 2 - inset, cy - bodyH / 2 + inset],
      [cx - bodyW / 2 + inset, cy + bodyH / 2 - inset],
      [cx + bodyW / 2 - inset, cy + bodyH / 2 - inset],
    ].forEach(([x, y]) => g.fillCircle(x, y, 2.5))
  }

  private applyState() {
    this.flashTween?.stop()
    this.gauge.setScale(1)
    this.gaugeGlow.setScale(1)

    switch (this.state.kind) {
      case 'idle': {
        this.smokeEmitter.stop()
        this.gauge.setFillStyle(0x52525b)
        this.gaugeGlow.setFillStyle(0x52525b, 0.2)
        break
      }
      case 'danger': {
        const f = Phaser.Math.Clamp(this.state.fraction, 0, 1)
        this.gauge.setFillStyle(0xef4444)
        this.gaugeGlow.setFillStyle(0xef4444, 0.2 + f * 0.4)
        this.gaugeGlow.setScale(1 + f * 0.6)
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
        this.gaugeGlow.setFillStyle(0x34d399, 0.35)
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
        this.gaugeGlow.setFillStyle(0xef4444, 0.4)
        this.sparkEmitter.explode(18)
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
