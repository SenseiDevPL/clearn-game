import Phaser from 'phaser'
import type { Level } from '../types'

export const MACHINE_WIDTH = 208
export const MACHINE_HEIGHT = 116
export const MACHINE_GAP = 18
export const TOP_PADDING = 18

export interface FactoryState {
  levels: Level[]
  completed: Set<number>
  selectedIndex: number
}

// A clickable "factory floor" of machines, one per level: red gauge + smoke
// while broken, green + calm once fixed. Public fields (onSelect, state) are
// assigned directly by the React wrapper rather than through Phaser's scene
// init-data mechanism, since we hand Phaser an already-constructed instance.
export class FactoryScene extends Phaser.Scene {
  onSelect: (index: number) => void = () => {}

  private state: FactoryState = { levels: [], completed: new Set(), selectedIndex: 0 }
  private machines: Phaser.GameObjects.Container[] = []
  private gauges: Phaser.GameObjects.Arc[] = []
  private gaugeGlows: Phaser.GameObjects.Arc[] = []
  private smokeEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = []
  private pipes!: Phaser.GameObjects.Graphics
  private ready = false

  constructor() {
    super('factory')
  }

  create() {
    const dot = this.add.graphics()
    dot.fillStyle(0xffffff, 1)
    dot.fillCircle(8, 8, 8)
    dot.generateTexture('smoke-dot', 16, 16)
    dot.destroy()

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)')

    const floor = this.add.graphics()
    floor.lineStyle(1, 0x1f1f23, 1)
    for (let y = 0; y < this.scale.height; y += 24) {
      floor.lineBetween(0, y, this.scale.width, y)
    }

    this.pipes = this.add.graphics()

    this.ready = true
    this.rebuildMachines()
  }

  setState(next: FactoryState) {
    const levelsChanged = next.levels !== this.state.levels
    this.state = next
    if (!this.ready) return
    if (levelsChanged || this.machines.length !== next.levels.length) {
      this.rebuildMachines()
    } else {
      this.refreshVisuals()
    }
  }

  private rebuildMachines() {
    this.machines.forEach((c) => c.destroy())
    this.machines = []
    this.gauges = []
    this.gaugeGlows = []
    this.smokeEmitters.forEach((e) => e.destroy())
    this.smokeEmitters = []

    const centerX = this.scale.width / 2
    const bodyW = MACHINE_WIDTH
    const bodyH = MACHINE_HEIGHT - 28
    const chimneyX = -bodyW / 2 + 26

    // Pipes connecting consecutive machines, drawn once behind everything.
    this.pipes.clear()
    this.pipes.fillStyle(0x3f3f46, 1)
    for (let i = 0; i < this.state.levels.length - 1; i++) {
      const yTop = TOP_PADDING + i * (MACHINE_HEIGHT + MACHINE_GAP) + MACHINE_HEIGHT
      this.pipes.fillRect(centerX + chimneyX - 4, yTop, 8, MACHINE_GAP)
    }

    this.state.levels.forEach((level, i) => {
      const y = TOP_PADDING + i * (MACHINE_HEIGHT + MACHINE_GAP) + MACHINE_HEIGHT / 2
      const container = this.add.container(centerX, y)

      const selectionRect = this.add.rectangle(0, 0, MACHINE_WIDTH + 10, MACHINE_HEIGHT + 10)
      selectionRect.setStrokeStyle(2, 0x34d399, 0)
      container.add(selectionRect)

      const body = this.add.graphics()
      body.fillStyle(0x2a2a30, 1)
      body.fillRoundedRect(-bodyW / 2, 8 - bodyH / 2, bodyW, bodyH, 8)
      body.lineStyle(2, 0x3f3f46, 1)
      body.strokeRoundedRect(-bodyW / 2, 8 - bodyH / 2, bodyW, bodyH, 8)
      // control-panel strip along the top of the body
      body.fillStyle(0x1f1f24, 1)
      body.fillRoundedRect(-bodyW / 2 + 8, 8 - bodyH / 2 + 8, bodyW - 16, 22, 4)
      // corner rivets
      body.fillStyle(0x52525b, 1)
      const rivetOffsets: [number, number][] = [
        [-bodyW / 2 + 8, 8 - bodyH / 2 + 8],
        [bodyW / 2 - 8, 8 - bodyH / 2 + 8],
        [-bodyW / 2 + 8, 8 + bodyH / 2 - 8],
        [bodyW / 2 - 8, 8 + bodyH / 2 - 8],
      ]
      rivetOffsets.forEach(([rx, ry]) => body.fillCircle(rx, ry, 2))
      container.add(body)

      const chimney = this.add.rectangle(chimneyX, -MACHINE_HEIGHT / 2 - 2, 14, 20, 0x3f3f46)
      chimney.setStrokeStyle(1, 0x52525b)
      container.add(chimney)

      const gaugeGlow = this.add.circle(MACHINE_WIDTH / 2 - 24, 8 - bodyH / 2 + 19, 13, 0xef4444, 0.25)
      container.add(gaugeGlow)
      this.gaugeGlows.push(gaugeGlow)

      const gauge = this.add.circle(MACHINE_WIDTH / 2 - 24, 8 - bodyH / 2 + 19, 8, 0xef4444)
      gauge.setStrokeStyle(2, 0x18181b)
      container.add(gauge)
      this.gauges.push(gauge)

      const numberText = this.add
        .text(-bodyW / 2 + 16, 8 - bodyH / 2 + 11, String(level.id), {
          fontFamily: 'ui-monospace, monospace',
          fontSize: '13px',
          color: '#a1a1aa',
        })
        .setOrigin(0, 0)
      container.add(numberText)

      const titleText = this.add
        .text(0, MACHINE_HEIGHT / 2 - 4, level.title, {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          color: '#d4d4d8',
          align: 'center',
          wordWrap: { width: MACHINE_WIDTH - 12 },
        })
        .setOrigin(0.5, 0)
      container.add(titleText)

      const hitZone = this.add
        .rectangle(0, 8, bodyW, bodyH)
        .setInteractive({ useHandCursor: true })
      hitZone.on('pointerover', () => body.setAlpha(0.85))
      hitZone.on('pointerout', () => body.setAlpha(1))
      hitZone.on('pointerdown', () => this.onSelect(i))
      container.add(hitZone)

      const emitter = this.add.particles(centerX + chimneyX, y - MACHINE_HEIGHT / 2 - 18, 'smoke-dot', {
        speed: { min: 5, max: 14 },
        angle: { min: 255, max: 285 },
        scale: { start: 0.8, end: 0.1 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 1100,
        frequency: 160,
        tint: 0xa1a1aa,
      })
      this.smokeEmitters.push(emitter)

      this.machines.push(container)
    })

    this.refreshVisuals()
  }

  private refreshVisuals() {
    this.state.levels.forEach((level, i) => {
      const done = this.state.completed.has(level.id)

      const gauge = this.gauges[i]
      gauge?.setFillStyle(done ? 0x34d399 : 0xef4444)
      const glow = this.gaugeGlows[i]
      glow?.setFillStyle(done ? 0x34d399 : 0xef4444, 0.25)

      const emitter = this.smokeEmitters[i]
      if (emitter) {
        if (done) emitter.stop()
        else emitter.start()
      }

      const container = this.machines[i]
      const selectionRect = container?.list[0] as Phaser.GameObjects.Rectangle | undefined
      selectionRect?.setStrokeStyle(2, 0x34d399, i === this.state.selectedIndex ? 1 : 0)
    })
  }
}
