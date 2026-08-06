import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import {
  SingleMachineScene,
  MACHINE_VIEW_WIDTH,
  MACHINE_VIEW_HEIGHT,
  type MachineState,
} from '../game/SingleMachineScene'

interface LevelMachineProps {
  state: MachineState
}

export function LevelMachine({ state }: LevelMachineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SingleMachineScene | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const scene = new SingleMachineScene()
    sceneRef.current = scene

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: MACHINE_VIEW_WIDTH,
      height: MACHINE_VIEW_HEIGHT,
      transparent: true,
      scene,
    })

    return () => {
      game.destroy(true)
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.setState(state)
  }, [state])

  return <div ref={containerRef} className="border-b border-neutral-800" />
}
