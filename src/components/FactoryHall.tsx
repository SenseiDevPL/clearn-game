import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { FactoryScene, MACHINE_GAP, MACHINE_HEIGHT, MACHINE_WIDTH, TOP_PADDING } from '../game/FactoryScene'
import type { Level } from '../types'

interface FactoryHallProps {
  levels: Level[]
  completed: Set<number>
  selectedIndex: number
  onSelect: (index: number) => void
}

const WIDTH = MACHINE_WIDTH + 24

export function FactoryHall({ levels, completed, selectedIndex, onSelect }: FactoryHallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<FactoryScene | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!containerRef.current) return
    const height = TOP_PADDING + levels.length * (MACHINE_HEIGHT + MACHINE_GAP)
    const scene = new FactoryScene()
    scene.onSelect = (i) => onSelectRef.current(i)
    sceneRef.current = scene

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: WIDTH,
      height,
      transparent: true,
      scene,
    })

    return () => {
      game.destroy(true)
      sceneRef.current = null
    }
    // Only rebuilt if the level count changes (never happens at runtime today);
    // level/completed/selection updates flow through setState below instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels.length])

  useEffect(() => {
    sceneRef.current?.setState({ levels, completed, selectedIndex })
  }, [levels, completed, selectedIndex])

  return <div ref={containerRef} />
}
