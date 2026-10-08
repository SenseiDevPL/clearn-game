// Real C, compiled and run entirely in the browser: xcc's C compiler, built to
// WebAssembly (public/wcc/usr/bin/cc, MIT, github.com/tyfkda/xcc), turns the
// student's code into a.wasm, which then runs on the same WASI shim. Nothing
// is sent to a server. The caller terminates this worker after a timeout, so
// an endless loop can't freeze the page.
import { WASI, File, OpenFile, ConsoleStdout, PreopenDirectory, Directory, type Inode } from '@bjorn3/browser_wasi_shim'

export interface XccRequest {
  code: string
}

export interface XccResponse {
  /** 'compile' = the compiler rejected the code; 'run' = it compiled and ran. */
  stage: 'compile' | 'run' | 'internal'
  output: string
  exitCode: number | null
  /** WebAssembly trap message when the program crashed (e.g. divide by zero). */
  crash: string | null
}

const base = import.meta.env.BASE_URL
let usr: Directory | null = null
let cc: WebAssembly.Module | null = null

async function loadToolchain() {
  const paths: string[] = await (await fetch(`${base}wcc/manifest.json`)).json()
  const root = new Map<string, Inode>()
  await Promise.all(
    paths.map(async (path) => {
      const data = new Uint8Array(await (await fetch(`${base}wcc/${path}`)).arrayBuffer())
      const parts = path.split('/')
      let dir = root
      for (const p of parts.slice(0, -1)) {
        if (!dir.has(p)) dir.set(p, new Directory(new Map()))
        dir = (dir.get(p) as Directory).contents
      }
      dir.set(parts[parts.length - 1], new File(data))
    }),
  )
  usr = root.get('usr') as Directory
  const ccFile = ((usr.contents.get('bin') as Directory).contents.get('cc') as File).data
  cc = await WebAssembly.compile(ccFile as Uint8Array<ArrayBuffer>)
}

async function runWasi(module: WebAssembly.Module, args: string[], tmp: Directory) {
  let out = ''
  const decoder = new TextDecoder()
  const collect = (bytes: Uint8Array) => {
    out += decoder.decode(bytes, { stream: true })
  }
  const fds = [
    new OpenFile(new File([])),
    new ConsoleStdout(collect),
    new ConsoleStdout(collect),
    new PreopenDirectory('/', new Map<string, Inode>([['usr', usr!], ['tmp', tmp]])),
  ]
  const wasi = new WASI(args, [], fds)
  const instance = await WebAssembly.instantiate(module, { wasi_snapshot_preview1: wasi.wasiImport })
  try {
    return { exitCode: wasi.start(instance as { exports: { memory: WebAssembly.Memory; _start: () => unknown } }), out, crash: null }
  } catch (e) {
    return { exitCode: null, out, crash: e instanceof Error ? e.message : String(e) }
  }
}

self.onmessage = async (e: MessageEvent<XccRequest>) => {
  let response: XccResponse
  try {
    if (!usr || !cc) await loadToolchain()
    const tmp = new Directory(new Map([['main.c', new File(new TextEncoder().encode(e.data.code))]]))
    const compiled = await runWasi(cc!, ['cc', '-o', '/tmp/a.wasm', '/tmp/main.c'], tmp)
    const binary = tmp.contents.get('a.wasm') as File | undefined
    if (compiled.exitCode !== 0 || !binary) {
      response = { stage: 'compile', output: compiled.out, exitCode: compiled.exitCode, crash: compiled.crash }
    } else {
      const program = await runWasi(await WebAssembly.compile(binary.data as Uint8Array<ArrayBuffer>), ['program'], tmp)
      response = { stage: 'run', output: program.out, exitCode: program.exitCode, crash: program.crash }
    }
  } catch (err) {
    response = { stage: 'internal', output: '', exitCode: null, crash: err instanceof Error ? err.message : String(err) }
  }
  ;(self as unknown as Worker).postMessage(response)
}
