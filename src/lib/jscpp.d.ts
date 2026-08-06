declare module 'JSCPP' {
  // JSCPP's runtime object is undocumented and untyped upstream; `any` here
  // is deliberate — see src/lib/heapAllocator.ts for the handful of methods
  // on it we actually rely on (regFunc, val, arrayPointerType, etc).
  export type CRuntime = any

  interface JSCPPInclude {
    load: (rt: CRuntime) => void
  }

  interface JSCPPConfig {
    stdio?: {
      write?: (s: string) => void
    }
    unsigned_overflow?: 'error' | 'warn' | 'ignore'
    includes?: Record<string, JSCPPInclude>
  }

  interface JSCPPStatic {
    run: (code: string, input?: string, config?: JSCPPConfig) => number | false
  }

  const JSCPP: JSCPPStatic
  export default JSCPP
}

declare module 'JSCPP/lib/includes/cstdlib' {
  import type { CRuntime } from 'JSCPP'
  const cstdlib: { load: (rt: CRuntime) => void }
  export default cstdlib
}
