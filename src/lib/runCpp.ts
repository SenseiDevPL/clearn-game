import type { RunRequest, RunResponse } from './cpp.worker'
import type { HeapEvent } from './heapAllocator'

const TIMEOUT_MS = 4000

export interface RunResult {
  output: string
  exitCode: number | false
  error: string | null
  timedOut: boolean
  heapEvents: HeapEvent[]
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
