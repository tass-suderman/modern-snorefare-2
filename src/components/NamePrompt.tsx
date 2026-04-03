import { useState } from 'react'

interface NamePromptProps {
  onSubmit: (name: string) => void
}

export default function NamePrompt({ onSubmit }: NamePromptProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onSubmit(trimmed)
    }
  }

  return (
    <div className="name-prompt-overlay">
      <div className="name-prompt-dialog">
        <h2 className="name-prompt-title">ENTER YOUR NAME</h2>
        <form onSubmit={handleSubmit} className="name-prompt-form">
          <input
            className="name-prompt-input"
            type="text"
            placeholder="CALLSIGN"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <button
            className="name-prompt-button"
            type="submit"
            disabled={!value.trim()}
          >
            CONFIRM
          </button>
        </form>
      </div>
    </div>
  )
}
