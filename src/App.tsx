import { useEffect, useState } from 'react'
import { levels } from './levels/levels'
import { runCpp } from './lib/runCpp'
import { CodeEditor } from './components/CodeEditor'
import { MemoryVisualizer } from './components/MemoryVisualizer'
import { FactoryHall } from './components/FactoryHall'
import { LevelMachine } from './components/LevelMachine'
import type { MachineState } from './game/SingleMachineScene'
import type { HeapEvent } from './lib/heapAllocator'

// v2: code saved before 2026-09-25 could be scrambled by the old editor
// bug / browser auto-translate, so it is discarded once and never loaded.
const PROGRESS_KEY = 'clearn-v2-progress'
const codeKey = (levelId: number) => `clearn-v2-code-${levelId}`
const lessonKey = (levelId: number) => `clearn-v2-lesson-${levelId}`

try {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('clearn-') && !k.startsWith('clearn-v2-')) localStorage.removeItem(k)
  }
} catch {
  // storage blocked — nothing old to clean up
}

function lessonSeen(levelId: number): boolean {
  try {
    return localStorage.getItem(lessonKey(levelId)) === '1'
  } catch {
    return false
  }
}

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
  const [machineState, setMachineState] = useState<MachineState>({ kind: 'idle' })
  const [editorKey, setEditorKey] = useState(0)
  const level = levels[levelIndex]
  const [lessonOpen, setLessonOpen] = useState(() => !lessonSeen(level.id))

  const [code, setCode] = useState(
    () => localStorage.getItem(codeKey(level.id)) ?? level.starterCode,
  )

  useEffect(() => {
    setCode(localStorage.getItem(codeKey(level.id)) ?? level.starterCode)
    setRunState({ status: 'idle' })
    setHeapEvents(null)
    setMachineState({ kind: 'idle' })
    setLessonOpen(!lessonSeen(level.id))
  }, [level.id, level.starterCode])

  function closeLesson() {
    try {
      localStorage.setItem(lessonKey(level.id), '1')
    } catch {
      // ignore — lesson just shows again next time
    }
    setLessonOpen(false)
  }

  function insertSolution() {
    localStorage.setItem(codeKey(level.id), level.solution)
    setCode(level.solution)
    setEditorKey((k) => k + 1)
    setRunState({ status: 'idle' })
    setMachineState({ kind: 'idle' })
  }

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
    setMachineState({ kind: 'idle' })
    if (level.kind === 'memory') setHeapEvents(null)

    const result = await runCpp(code, { mode: level.kind === 'memory' ? 'memory' : 'output' })

    if (result.timedOut) {
      setRunState({ status: 'timeout' })
      setMachineState({ kind: 'fault' })
      return
    }
    if (result.error) {
      setRunState({ status: 'error', message: result.error })
      setMachineState({ kind: 'fault' })
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
      setMachineState({ kind: 'success' })
    } else {
      setRunState({ status: 'wrong', output: result.output })
      setMachineState({ kind: 'fault' })
    }
  }

  function handleMemoryOutcome(outcome: 'success' | 'crash') {
    if (outcome === 'success') markCompleted()
    setMachineState(outcome === 'success' ? { kind: 'success' } : { kind: 'fault' })
  }

  function handleMemoryTick(fraction: number) {
    setMachineState({ kind: 'danger', fraction })
  }

  function handleReset() {
    if (!window.confirm('Przywrócić kod początkowy tego poziomu? Twoje zmiany znikną.')) return
    localStorage.removeItem(codeKey(level.id))
    setCode(level.starterCode)
    setEditorKey((k) => k + 1)
    setRunState({ status: 'idle' })
    setHeapEvents(null)
    setMachineState({ kind: 'idle' })
  }

  function handleResetAll() {
    if (!window.confirm('Zacząć całą grę od nowa? Znikną wszystkie ukończone poziomy i Twój kod.')) return
    try {
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith('clearn-')) localStorage.removeItem(k)
      }
    } catch {
      // storage blocked — nothing saved anyway
    }
    window.location.reload()
  }

  const isDone = completed.has(level.id)
  const hasNext = levelIndex < levels.length - 1
  const running = runState.status === 'running'

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      <aside className="w-64 shrink-0 border-r border-neutral-800 overflow-y-auto">
        <h1 className="px-4 pt-4 text-lg font-semibold text-neutral-100">
          clearn <span className="text-emerald-400">C</span>
        </h1>
        <p className="px-4 pb-3 pt-1 text-sm text-neutral-400">
          Wybierz maszynę do naprawy (poziom). Ukończone: {completed.size} z {levels.length}
        </p>
        <FactoryHall
          levels={levels}
          completed={completed}
          selectedIndex={levelIndex}
          onSelect={setLevelIndex}
        />
        <div className="px-4 py-4">
          <button
            onClick={handleResetAll}
            className="w-full rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-400 hover:border-red-500 hover:text-red-300"
          >
            ↺ Zacznij całą grę od nowa
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-neutral-800 px-6 py-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Poziom {levelIndex + 1} z {levels.length} · {level.concept}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="text-xl font-semibold">{level.title}</h2>
            {!lessonOpen && (
              <button
                onClick={() => setLessonOpen(true)}
                className="rounded-lg border border-sky-600 px-3 py-1 text-sm text-sky-300 hover:bg-sky-950"
              >
                📖 Pokaż lekcję jeszcze raz
              </button>
            )}
          </div>
          {!lessonOpen && (
          <>
          <div className="mt-3 rounded-lg border border-emerald-700/60 bg-emerald-950/40 px-4 py-3">
            <div className="text-sm font-semibold text-emerald-300">Twoje zadanie</div>
            <p className="mt-1 text-base text-neutral-100">{level.instructions}</p>
            {level.kind === 'output' && (
              <div className="mt-2 text-sm text-neutral-300">
                Program ma wypisać:{' '}
                <code className="whitespace-pre rounded bg-neutral-900 px-2 py-0.5 font-mono text-emerald-300">
                  {level.expectedOutput.replaceAll('\n', ' ⏎ ')}
                </code>
              </div>
            )}
          </div>
          <ol className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-400">
            <li><b className="text-neutral-200">1.</b> Przeczytaj zadanie</li>
            <li><b className="text-neutral-200">2.</b> Kliknij w kod poniżej i dopisz swój kod w miejscu „Twój kod tutaj”</li>
            <li><b className="text-neutral-200">3.</b> Kliknij zielony przycisk „▶ Uruchom kod”</li>
            <li>Utknąłeś? Na dole po prawej są podpowiedzi i rozwiązanie.</li>
          </ol>
          </>
          )}
        </div>

        <div className="relative flex-1 flex min-h-0">
        {lessonOpen && (
          <div className="absolute inset-0 z-10 overflow-y-auto bg-neutral-950">
            <div className="mx-auto max-w-3xl px-6 py-8">
              <div className="text-sm font-semibold uppercase tracking-wide text-sky-300">
                📖 Lekcja — przeczytaj, zanim zaczniesz
              </div>
              <div className="mt-4 space-y-3 text-lg leading-relaxed text-neutral-200">
                {level.lesson.paragraphs.map((t, i) => (
                  <p key={i}>
                    {t.split('`').map((part, j) =>
                      j % 2 === 1 ? (
                        <code
                          key={j}
                          className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-base text-sky-200"
                        >
                          {part}
                        </code>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                ))}
              </div>
              <div className="mt-6 text-sm font-semibold text-neutral-300">Przykład:</div>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-base text-sky-200">
                {level.lesson.example}
              </pre>
              <div className="mt-4 text-sm font-semibold text-neutral-300">
                Na ekranie pojawi się:
              </div>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-black p-4 font-mono text-base text-emerald-300">
                {level.lesson.exampleOutput}
              </pre>
              <button
                onClick={closeLesson}
                className="mt-8 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-neutral-950 hover:bg-emerald-400"
              >
                Rozumiem — przejdź do zadania →
              </button>
            </div>
          </div>
        )}
        {/* Work area stays mounted under the lesson: the Phaser machine
            inside must not be recreated per level, or browsers run out of
            WebGL contexts and blank the factory hall. */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 min-w-0 flex flex-col border-r border-neutral-800">
            <div className="flex-1 min-h-0">
              <CodeEditor
                key={`${level.id}-${editorKey}`}
                initialValue={localStorage.getItem(codeKey(level.id)) ?? level.starterCode}
                onChange={handleCodeChange}
              />
            </div>
            <div className="flex items-center gap-3 border-t border-neutral-800 px-4 py-3">
              <button
                onClick={handleRun}
                disabled={running}
                className="rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                {running ? 'Uruchamiam…' : '▶ Uruchom kod'}
              </button>
              {isDone && hasNext && (
                <button
                  onClick={() => setLevelIndex(levelIndex + 1)}
                  className="rounded-lg border border-emerald-500 px-5 py-3 text-base font-semibold text-emerald-300 hover:bg-emerald-950"
                >
                  Następny poziom →
                </button>
              )}
              <button
                onClick={handleReset}
                className="ml-auto rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              >
                ↺ Zacznij poziom od nowa
              </button>
            </div>
          </div>

          <div className="w-96 shrink-0 flex flex-col">
            <LevelMachine state={machineState} />
            {(runState.status === 'error' || runState.status === 'timeout') && (
              <div className="px-4 py-3 border-b border-neutral-800 text-sm">
                {runState.status === 'error' && (
                  <>
                    <div className="mb-1 text-red-400 font-medium">
                      Komputer nie rozumie tego kodu
                    </div>
                    <div className="text-neutral-300">
                      Sprawdź średniki <code>;</code> na końcu linii, cudzysłowy <code>"</code> i
                      nawiasy — każdy otwarty musi być zamknięty.
                    </div>
                    <div className="mt-2 font-mono text-xs text-red-300/80">
                      Szczegóły: {runState.message}
                    </div>
                  </>
                )}
                {runState.status === 'timeout' && (
                  <div className="text-red-400">
                    Program działał za długo i został zatrzymany — prawdopodobnie pętla, która
                    nigdy się nie kończy.
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
                onTick={handleMemoryTick}
              />
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="px-4 py-3 border-b border-neutral-800">
                  <span className="text-sm font-medium text-neutral-300">
                    Wynik programu
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm whitespace-pre-wrap">
                  {runState.status === 'idle' && (
                    <span className="font-sans text-neutral-500">
                      Tu pojawi się to, co wypisze Twój program, po kliknięciu „▶ Uruchom kod”.
                    </span>
                  )}
                  {runState.status === 'success' && (
                    <>
                      <div className="mb-2 text-emerald-400 font-sans font-medium">
                        ✓ Brawo, maszyna naprawiona!
                        {hasNext && ' Kliknij „Następny poziom →”.'}
                      </div>
                      <div className="text-neutral-300">{runState.output}</div>
                    </>
                  )}
                  {runState.status === 'wrong' && (
                    <>
                      <div className="mb-2 text-amber-400 font-sans font-medium">
                        Program działa, ale wypisał co innego niż trzeba.
                      </div>
                      <div className="text-neutral-400 mb-2 font-sans">Twój program wypisał:</div>
                      <div className="text-neutral-300 mb-3">{runState.output || '(nic)'}</div>
                      <div className="text-neutral-400 mb-2 font-sans">A powinien:</div>
                      <div className="text-emerald-300">{level.expectedOutput}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {level.hints.length > 0 && (
              <details key={`hints-${level.id}`} className="border-t border-neutral-800 px-4 py-3 text-sm">
                <summary className="cursor-pointer text-neutral-300">💡 Podpowiedzi</summary>
                <ul className="mt-2 space-y-1 text-neutral-400 list-disc list-inside">
                  {level.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </details>
            )}

            <details key={`solution-${level.id}`} className="border-t border-neutral-800 px-4 py-3 text-sm">
              <summary className="cursor-pointer text-neutral-300">🔑 Pokaż rozwiązanie</summary>
              <div className="mt-2 text-neutral-300">{level.solutionWhere}</div>
              <pre className="mt-2 overflow-x-auto rounded bg-neutral-900 p-3 font-mono text-sm text-emerald-300">
                {level.solutionSnippet}
              </pre>
              <button
                onClick={insertSolution}
                className="mt-2 rounded-lg border border-emerald-600 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-950"
              >
                Wstaw rozwiązanie za mnie
              </button>
            </details>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
