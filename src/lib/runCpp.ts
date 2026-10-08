import type { RunRequest, RunResponse } from './cpp.worker'
import type { HeapEvent } from './heapAllocator'
import type { XccRequest, XccResponse } from './xcc.worker'

const TIMEOUT_MS = 4000

export interface RunResult {
  output: string
  exitCode: number | false
  error: string | null
  timedOut: boolean
  heapEvents: HeapEvent[]
  /** Real compiler only: the code didn't compile (error holds the messages). */
  compileError?: boolean
}

export function runCpp(
  code: string,
  options: { input?: string; mode?: 'output' | 'memory' } = {},
): Promise<RunResult> {
  const { input = '', mode = 'output' } = options
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./cpp.worker.ts', import.meta.url), {
      type: 'module',
    })

    const timer = setTimeout(() => {
      worker.terminate()
      resolve({
        output: '',
        exitCode: false,
        error: null,
        timedOut: true,
        heapEvents: [],
      })
    }, TIMEOUT_MS)

    worker.onmessage = (e: MessageEvent<RunResponse>) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ ...e.data, timedOut: false })
    }

    worker.onerror = (e) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({
        output: '',
        exitCode: false,
        error: e.message,
        timedOut: false,
        heapEvents: [],
      })
    }

    const request: RunRequest = { code, input, mode }
    worker.postMessage(request)
  })
}

/** Compiles and runs real C (xcc → WebAssembly) in a worker; same result shape. */
export function runXcc(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./xcc.worker.ts', import.meta.url), { type: 'module' })
    const done = (result: RunResult) => {
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }
    const timer = setTimeout(
      () => done({ output: '', exitCode: false, error: null, timedOut: true, heapEvents: [] }),
      TIMEOUT_MS + 2000, // first run also downloads the compiler
    )
    worker.onmessage = (e: MessageEvent<XccResponse>) => {
      const r = e.data
      if (r.stage === 'compile') {
        done({ output: '', exitCode: false, error: r.output || r.crash || 'compile failed', timedOut: false, heapEvents: [], compileError: true })
      } else if (r.stage === 'internal' || r.crash) {
        done({ output: r.output, exitCode: false, error: `TRAP: ${r.crash}`, timedOut: false, heapEvents: [] })
      } else {
        done({ output: r.output, exitCode: r.exitCode ?? false, error: null, timedOut: false, heapEvents: [] })
      }
    }
    worker.onerror = (e) => done({ output: '', exitCode: false, error: e.message, timedOut: false, heapEvents: [] })
    const request: XccRequest = { code }
    worker.postMessage(request)
  })
}
