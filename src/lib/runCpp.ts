import type { RunRequest, RunResponse } from './cpp.worker'

const TIMEOUT_MS = 4000

export interface RunResult {
  output: string
  exitCode: number | false
  error: string | null
  timedOut: boolean
}

export function runCpp(code: string, input = ''): Promise<RunResult> {
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
      })
    }

    const request: RunRequest = { code, input }
    worker.postMessage(request)
  })
}
