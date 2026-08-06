import type { CRuntime } from 'JSCPP'
import cstdlib from 'JSCPP/lib/includes/cstdlib'

// mergeConfig (inside JSCPP) mutates the shared/cached cstdlib module object
// in place the first time a tracker's config is merged into a runtime, so
// `cstdlib.load` itself gets overwritten. Capture the original once, at
// module load time, or an override's call to the "original" load recurses
// into itself infinitely.
const originalCstdlibLoad = cstdlib.load

export interface HeapEvent {
  type: 'alloc' | 'free'
  bytes: number
}

export interface HeapTracker {
  events: HeapEvent[]
  /** Pass as config.includes.cstdlib when calling JSCPP.run(). */
  cstdlibOverride: { load: (rt: CRuntime) => void }
}

// Registers malloc/free on top of JSCPP's real cstdlib, simulating a heap:
// malloc hands out a fresh JS array (tagged with its byte size in a
// WeakMap), free looks up that size by array identity. JSCPP has no
// malloc/free of its own at all (verified against its source), so this is
// the only way to get real per-call allocation events out of student code
// instead of guessing from the source text.
//
// Known limitation: dereferencing the returned pointer (`*p = x`) throws
// inside JSCPP's interpreter ("is not a left value") for reasons not worth
// chasing in an unmaintained, undocumented library — so levels built on
// this must only allocate/free, never write through the pointer.
export function createHeapTracker(): HeapTracker {
  const events: HeapEvent[] = []
  const blockSizes = new WeakMap<object, number>()

  const cstdlibOverride = {
    load(rt: CRuntime) {
      originalCstdlibLoad(rt)

      const intType = rt.intTypeLiteral
      const intPtr = rt.normalPointerType(intType)
      const sizeT = rt.primitiveType('unsigned int')

      const mallocFn = (rt2: CRuntime, _this: unknown, size: { v: number }) => {
        const bytes = size.v
        const count = Math.max(1, Math.ceil(bytes / 4))
        const arr = []
        for (let i = 0; i < count; i++) arr.push(rt2.val(intType, 0))
        blockSizes.set(arr, bytes)
        events.push({ type: 'alloc', bytes })
        return rt2.val(rt2.arrayPointerType(intType, count), rt2.makeArrayPointerValue(arr, 0))
      }
      rt.regFunc(mallocFn, 'global', 'malloc', [sizeT], intPtr)

      const freeFn = (rt2: CRuntime, _this: unknown, ptr: { v?: { target?: object } }) => {
        const arr = ptr?.v?.target
        const bytes = arr ? blockSizes.get(arr) : undefined
        if (bytes != null) {
          blockSizes.delete(arr as object)
          events.push({ type: 'free', bytes })
        }
        return rt2.val(rt2.voidTypeLiteral, 0)
      }
      rt.regFunc(freeFn, 'global', 'free', [intPtr], rt.voidTypeLiteral)
    },
  }

  return { events, cstdlibOverride }
}
