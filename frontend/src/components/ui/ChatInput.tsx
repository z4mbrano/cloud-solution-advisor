import React, { useState, useRef } from 'react'
import { Share2, Send } from 'lucide-react'
import styles from './ChatInput.module.css'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue)
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.inputContainer}>
      <button
        className={styles.shareButton}
        title="Compartilhar"
        type="button"
      >
        <Share2 size={20} />
      </button>

      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        placeholder="Descreva o desafio do seu cliente..."
        className={styles.textarea}
      />

      <button
        onClick={handleSend}
        className={styles.sendButton}
        title="Enviar"
        type="button"
        disabled={!inputValue.trim() || disabled}
      >
        <Send size={18} />
      </button>
    </div>
  )
}

export default ChatInput
