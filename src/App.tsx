import { useEffect, useState } from 'react'
import { levels } from './levels/levels'
import { runCpp } from './lib/runCpp'
import { CodeEditor } from './components/CodeEditor'
import { MemoryVisualizer } from './components/MemoryVisualizer'
import { FactoryHall } from './components/FactoryHall'
import type { HeapEvent } from './lib/heapAllocator'

const PROGRESS_KEY = 'clearn-progress'
const codeKey = (levelId: number) => `clearn-code-${levelId}`

function loadProgress(): Set<number> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return new Set(raw ? (JSON.parse(raw) as number[]) : [])
  } catch {
    return new Set()
  }
}

function saveProgress(completed: Set<number>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]))
}

type RunState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'success'; output: string }
  | { status: 'wrong'; output: string }
  | { status: 'error'; message: string }
  | { status: 'timeout' }

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(loadProgress)
  const [runState, setRunState] = useState<RunState>({ status: 'idle' })
  const [heapEvents, setHeapEvents] = useState<HeapEvent[] | null>(null)
  const [runToken, setRunToken] = useState(0)
  const level = levels[levelIndex]

  const [code, setCode] = useState(
    () => localStorage.getItem(codeKey(level.id)) ?? level.starterCode,
  )

  useEffect(() => {
    setCode(localStorage.getItem(codeKey(level.id)) ?? level.starterCode)
    setRunState({ status: 'idle' })
    setHeapEvents(null)
  }, [level.id, level.starterCode])

  function handleCodeChange(value: string) {
    setCode(value)
    localStorage.setItem(codeKey(level.id), value)
  }

  function markCompleted() {
    const next = new Set(completed)
    next.add(level.id)
    setCompleted(next)
    saveProgress(next)
  }

  async function handleRun() {
    setRunState({ status: 'running' })
    if (level.kind === 'memory') setHeapEvents(null)

    const result = await runCpp(code, { mode: level.kind === 'memory' ? 'memory' : 'output' })

    if (result.timedOut) {
      setRunState({ status: 'timeout' })
      return
    }
    if (result.error) {
      setRunState({ status: 'error', message: result.error })
      return
    }

    if (level.kind === 'memory') {
      setRunState({ status: 'idle' })
      setHeapEvents(result.heapEvents)
      setRunToken((t) => t + 1)
      return
    }

    const actual = result.output.trim()
    if (actual === level.expectedOutput) {
      markCompleted()
      setRunState({ status: 'success', output: result.output })
    } else {
      setRunState({ status: 'wrong', output: result.output })
    }
  }

  function handleMemoryOutcome(outcome: 'success' | 'crash') {
    if (outcome === 'success') markCompleted()
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      <aside className="w-64 shrink-0 border-r border-neutral-800 overflow-y-auto">
        <h1 className="px-4 py-4 text-lg font-semibold text-neutral-100">
          clearn <span className="text-emerald-400">C</span>
        </h1>
        <FactoryHall
          levels={levels}
          completed={completed}
          selectedIndex={levelIndex}
          onSelect={setLevelIndex}
        />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-neutral-800 px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-semibold">{level.title}</h2>
            <span className="text-xs uppercase tracking-wide text-neutral-500">
              {level.concept}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-400">{level.instructions}</p>
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 min-w-0 border-r border-neutral-800">
            <CodeEditor value={code} onChange={handleCodeChange} />
          </div>

          <div className="w-96 shrink-0 flex flex-col">
            {(runState.status === 'error' || runState.status === 'timeout') && (
              <div className="px-4 py-3 border-b border-neutral-800 font-mono text-sm">
                {runState.status === 'error' && (
                  <>
                    <div className="mb-1 text-red-400 font-sans font-medium">
                      Błąd kompilacji/wykonania
                    </div>
                    <div className="text-red-300">{runState.message}</div>
                  </>
                )}
                {runState.status === 'timeout' && (
                  <div className="text-red-400">
                    Przekroczono limit czasu — prawdopodobnie nieskończona pętla.
                  </div>
                )}
              </div>
            )}
            {level.kind === 'memory' ? (
              <MemoryVisualizer
                level={level}
                events={heapEvents}
                runToken={runToken}
                onOutcome={handleMemoryOutcome}
                onRun={handleRun}
                running={runState.status === 'running'}
              />
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-300">Konsola</span>
                  <button
                    onClick={handleRun}
                    disabled={runState.status === 'running'}
                    className="rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {runState.status === 'running' ? 'Uruchamiam…' : 'Uruchom'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm whitespace-pre-wrap">
                  {runState.status === 'idle' && (
                    <span className="text-neutral-600">
                      Kliknij "Uruchom", żeby zobaczyć wynik.
                    </span>
                  )}
                  {runState.status === 'success' && (
                    <>
                      <div className="mb-2 text-emerald-400 font-sans font-medium">
                        ✓ Poziom ukończony!
                      </div>
                      <div className="text-neutral-300">{runState.output}</div>
                    </>
                  )}
                  {runState.status === 'wrong' && (
                    <>
                      <div className="mb-2 text-amber-400 font-sans font-medium">
                        Jeszcze nie to — sprawdź wynik.
                      </div>
                      <div className="text-neutral-400 mb-2">Twój output:</div>
                      <div className="text-neutral-300 mb-3">{runState.output || '(brak)'}</div>
                      <div className="text-neutral-400 mb-2">Oczekiwany:</div>
                      <div className="text-neutral-300">{level.expectedOutput}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {level.hints.length > 0 && (
              <details key={`hints-${level.id}`} className="border-t border-neutral-800 px-4 py-3 text-sm">
                <summary className="cursor-pointer text-neutral-400">Podpowiedzi</summary>
                <ul className="mt-2 space-y-1 text-neutral-400 list-disc list-inside">
                  {level.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </details>
            )}

            <details key={`solution-${level.id}`} className="border-t border-neutral-800 px-4 py-3 text-sm">
              <summary className="cursor-pointer text-neutral-400">Pokaż rozwiązanie</summary>
              <pre className="mt-2 overflow-x-auto rounded bg-neutral-900 p-3 font-mono text-xs text-neutral-300">
                {level.solution}
              </pre>
            </details>
          </div>
        </div>
      </main>
    </div>
  )
}
