import { useEffect, useState } from 'react'
import type { MemoryLevel } from '../types'
import type { HeapEvent } from '../lib/heapAllocator'

const REPLAY_STEP_MS = 220

type Phase = 'idle' | 'replaying' | 'crashed' | 'success'

interface MemoryVisualizerProps {
  level: MemoryLevel
  /** null = level hasn't been run yet since it was opened/edited. */
  events: HeapEvent[] | null
  /** Bump on every run so a re-run with an identical event list still replays. */
  runToken: number
  onOutcome: (outcome: 'success' | 'crash') => void
  onRun: () => void
  running: boolean
}

export function MemoryVisualizer({
  level,
  events,
  runToken,
  onOutcome,
  onRun,
  running,
}: MemoryVisualizerProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentBytes, setCurrentBytes] = useState(0)
  const [log, setLog] = useState<HeapEvent[]>([])
  const [noAllocations, setNoAllocations] = useState(false)

  useEffect(() => {
    if (events === null) {
      setPhase('idle')
      setCurrentBytes(0)
      setLog([])
      setNoAllocations(false)
      return
    }

    let cancelled = false
    let index = 0
    let running = 0
    setPhase('replaying')
    setCurrentBytes(0)
    setLog([])
    setNoAllocations(false)

    const finish = (finalPhase: 'success' | 'crashed') => {
      if (cancelled) return
      setPhase(finalPhase)
      onOutcome(finalPhase === 'success' ? 'success' : 'crash')
    }

    if (events.length === 0) {
      setNoAllocations(true)
      finish('crashed')
      return
    }

    const timer = setInterval(() => {
      if (cancelled) return
      const event = events[index]
      running += event.type === 'alloc' ? event.bytes : -event.bytes
      index += 1
      setCurrentBytes(running)
      setLog((prev) => [...prev, event])

      if (running >= level.memoryLimitBytes) {
        clearInterval(timer)
        finish('crashed')
        return
      }
      if (index >= events.length) {
        clearInterval(timer)
        finish(running > 0 ? 'crashed' : 'success')
      }
    }, REPLAY_STEP_MS)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, runToken, level.memoryLimitBytes])

  const fraction = Math.min(1, currentBytes / level.memoryLimitBytes)
  const warning = fraction >= level.warningThresholdFraction && phase === 'replaying'
  const barColor =
    phase === 'crashed'
      ? 'bg-red-500'
      : warning
        ? 'bg-amber-400'
        : 'bg-emerald-400'

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-300">Wizualizacja RAM</span>
          <button
            onClick={onRun}
            disabled={running}
            className="rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {running ? 'Uruchamiam…' : 'Uruchom'}
          </button>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-mono text-xs text-neutral-400">
            {currentBytes} / {level.memoryLimitBytes} B
          </span>
        </div>
        <div className="mt-2 h-4 w-full rounded bg-neutral-800 overflow-hidden">
          <div
            className={`h-full transition-[width] duration-200 ${barColor} ${
              phase === 'crashed' ? 'animate-pulse' : ''
            }`}
            style={{ width: `${fraction * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {phase === 'idle' && (
          <span className="text-neutral-600 font-sans">
            Kliknij "Uruchom", żeby zobaczyć zużycie pamięci na żywo.
          </span>
        )}

        {log.map((event, i) => (
          <div key={i} className={event.type === 'alloc' ? 'text-amber-300' : 'text-emerald-400'}>
            {event.type === 'alloc' ? `malloc() +${event.bytes} B` : `free()   -${event.bytes} B`}
          </div>
        ))}

        {warning && (
          <div className="mt-3 font-sans font-medium text-amber-400 animate-pulse">
            ⚠ Zbliża się Segmentation Fault...
          </div>
        )}

        {phase === 'crashed' && (
          <div className="mt-3 font-sans">
            <div className="font-bold text-red-400">CRASH: Segmentation fault (core dumped)</div>
            <div className="mt-1 text-red-300">
              {noAllocations
                ? 'Nie wykryto żadnej alokacji — sprawdź, czy przetworz_pakiet() nadal wywołuje malloc().'
                : 'Pamięć nie została zwolniona — spróbuj ponownie.'}
            </div>
          </div>
        )}

        {phase === 'success' && (
          <div className="mt-3 font-sans font-medium text-emerald-400">
            ✓ System uratowany! Cała zaalokowana pamięć została zwolniona.
          </div>
        )}
      </div>
    </div>
  )
}
