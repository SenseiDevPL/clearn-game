interface LevelBase {
  id: number
  title: string
  concept: string
  instructions: string
  starterCode: string
  hints: string[]
  solution: string
  /** Shown before the task: plain-language explanation + a worked example. */
  lesson: {
    paragraphs: string[]
    example: string
    exampleOutput: string
  }
  /** Just the lines the player has to add, and where to put them. */
  solutionWhere: string
  solutionSnippet: string
}

export interface OutputLevel extends LevelBase {
  kind: 'output'
  expectedOutput: string
}

export interface MemoryLevel extends LevelBase {
  kind: 'memory'
  /** Simulated heap size, in bytes, before a "Segmentation fault" crash. */
  memoryLimitBytes: number
  /** Fraction of memoryLimitBytes at which the UI starts warning. */
  warningThresholdFraction: number
}

export type Level = OutputLevel | MemoryLevel
