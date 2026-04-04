import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import type { ChatMessage } from '@/models/ChatMessage'

interface ChatWindowProps {
	messages: ChatMessage[]
	sendMessage: (message: string) => void
}

export default function ChatWindow({ messages, sendMessage }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onMessageSend = () => {
    const text = input.trim()
    if (!text) return
		sendMessage(text)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onMessageSend()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Allow printable ASCII (0x20 space through 0x7E tilde) and newlines
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
            <span className="chat-message-text">{msg.message}</span>
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
