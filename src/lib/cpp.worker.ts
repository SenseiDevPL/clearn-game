// Runs student C code through JSCPP inside a Web Worker, isolated from the UI
// thread so an infinite loop in student code can't freeze the page — the
// caller just terminates this worker after a timeout.
import JSCPP from 'JSCPP'

export interface RunRequest {
  code: string
  input: string
}

export interface RunResponse {
  output: string
  exitCode: number | false
  error: string | null
}

self.onmessage = (e: MessageEvent<RunRequest>) => {
  const { code, input } = e.data
  let output = ''
  const config = {
    stdio: {
      write: (s: string) => {
        output += s
      },
    },
    unsigned_overflow: 'error' as const,
  }

  let exitCode: number | false = false
  let error: string | null = null
  try {
    exitCode = JSCPP.run(code, input, config)
  } catch (e) {
    console.error('JSCPP run failed', e)
    error = e instanceof Error ? e.message : String(e)
  }

  const response: RunResponse = { output, exitCode, error }
  ;(self as unknown as Worker).postMessage(response)
}
