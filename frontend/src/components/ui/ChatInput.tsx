import React, { useState, useRef } from 'react'
import { Share2, Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Ajusta a altura do textarea dinamicamente
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Reseta a altura para recalcular o scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue)
      setInputValue("")
      // Reseta a altura do textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sem Shift envia a mensagem
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    // Wrapper que centraliza o input e limita sua largura
    <div className="w-full max-w-3xl mx-auto">
      {/* Container principal do input */}
      <div 
        className="
          flex items-end p-2 
          bg-[#3a3a40] 
          rounded-xl 
          shadow-lg
          border border-gray-700/50
        "
        style={{ minHeight: '56px' }} // Altura mínima
      >
        {/* Botão de Compartilhar (Esquerda) */}
        <button
          className="p-2 rounded-full text-gray-300 hover:bg-zinc-700 transition"
          title="Compartilhar"
          type="button"
        >
          <Share2 size={20} />
        </button>

        {/* Textarea (Centro) */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          placeholder="Descreva o desafio do seu cliente..."
          className="
            flex-1 mx-2 mb-1
            bg-transparent 
            text-gray-100 
            placeholder-gray-400 
            border-none outline-none 
            resize-none 
            overflow-y-auto
            text-base
            leading-6
            disabled:opacity-50
          "
          style={{ maxHeight: '200px' }} // Limite de altura
        />

        {/* Botão de Enviar (Direita) */}
        <button
          onClick={handleSend}
          className="
            flex items-center justify-center 
            bg-red-600 hover:bg-red-700 
            text-white 
            rounded-full 
            transition
            flex-shrink-0
            w-10 h-10
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Enviar"
          type="button"
          disabled={!inputValue.trim() || disabled}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
