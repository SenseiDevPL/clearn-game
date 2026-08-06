// Runs student C code through JSCPP inside a Web Worker, isolated from the UI
// thread so an infinite loop in student code can't freeze the page — the
// caller just terminates this worker after a timeout.
import JSCPP from 'JSCPP'
import { createHeapTracker, type HeapEvent } from './heapAllocator'

export interface RunRequest {
  code: string
  input: string
  /** 'memory' registers a tracked malloc/free and returns heapEvents. */
  mode?: 'output' | 'memory'
}

export interface RunResponse {
  output: string
  exitCode: number | false
  error: string | null
  heapEvents: HeapEvent[]
}

self.onmessage = (e: MessageEvent<RunRequest>) => {
  const { code, input, mode = 'output' } = e.data
  let output = ''

  const tracker = mode === 'memory' ? createHeapTracker() : null

  const config = {
    stdio: {
      write: (s: string) => {
        output += s
      },
    },
    unsigned_overflow: 'error' as const,
    ...(tracker ? { includes: { cstdlib: tracker.cstdlibOverride } } : {}),
  }

  let exitCode: number | false = false
  let error: string | null = null
  try {
    exitCode = JSCPP.run(code, input, config)
  } catch (e) {
    console.error('JSCPP run failed', e)
    error = e instanceof Error ? e.message : String(e)
  }

  const response: RunResponse = {
    output,
    exitCode,
    error,
    heapEvents: tracker?.events ?? [],
  }
  ;(self as unknown as Worker).postMessage(response)
}
