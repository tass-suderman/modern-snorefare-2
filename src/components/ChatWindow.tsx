import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'

interface ChatMessage {
  id: string
  name: string
  text: string
}

interface ChatWindowProps {
  playerName: string
}

export default function ChatWindow({ playerName }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: playerName, text },
    ])
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Allow printable ASCII (space through ~) and newlines only
    const filtered = e.target.value.replace(/[^\x20-\x7E\n]/g, '')
    setInput(filtered)
  }

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <span className="chat-message-name">{msg.name}</span>
            {': '}
            <span className="chat-message-text">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <textarea
        className="chat-input"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="SEND A MESSAGE..."
        rows={2}
      />
    </div>
  )
}
