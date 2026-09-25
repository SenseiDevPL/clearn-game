import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  /** Only read on mount — remount (change `key`) to load different code. */
  initialValue: string
  onChange: (value: string) => void
}

export function CodeEditor({ initialValue, onChange }: CodeEditorProps) {
  return (
    <div translate="no" className="notranslate h-full">
    <Editor
      height="100%"
      defaultLanguage="cpp"
      defaultValue={initialValue}
      onChange={(v) => onChange(v ?? '')}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        // Beginners type every character themselves: no popups, no
        // auto-inserted quotes/brackets, Enter always means a new line.
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off',
        acceptSuggestionOnCommitCharacter: false,
        tabCompletion: 'off',
        wordBasedSuggestions: 'off',
        parameterHints: { enabled: false },
        snippetSuggestions: 'none',
        inlineSuggest: { enabled: false },
        autoClosingBrackets: 'never',
        autoClosingQuotes: 'never',
        autoClosingOvertype: 'never',
        autoSurround: 'never',
        formatOnType: false,
        hover: { enabled: 'off' },
        contextmenu: false,
      }}
    />
    </div>
  )
}
