// src/components/ui/ChatInput.tsx
"use client"

import React, { useState } from 'react';
import { Share2, Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [inputValue, setInputValue] = useState("");

  // Ajusta a altura do textarea dinamicamente
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
      // Reset textarea height
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className="
          flex items-center p-2 
          bg-[#3a3a40] 
          rounded-2xl 
          shadow-lg
          border border-gray-700/50
        "
        style={{ minHeight: '56px' }}
      >
        {/* Botão de Compartilhar (Esquerda) */}
        <button
          className="p-2 rounded-full text-gray-300 hover:bg-zinc-700 transition flex items-center justify-center"
          title="Compartilhar"
          type="button"
        >
          <Share2 size={20} />
        </button>

        {/* Textarea (Centro) */}
        <textarea
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Descreva o desafio do seu cliente..."
          disabled={isLoading}
          className="
            flex-1 mx-2 p-2 
            bg-transparent 
            text-gray-100 
            placeholder-gray-400 
            border-none outline-none 
            resize-none 
            overflow-y-auto
            text-base
            disabled:opacity-50
          "
          style={{ maxHeight: '200px' }}
        />

        {/* Botão de Voz (Opcional) */}
        <button
          className="p-2 rounded-full text-gray-300 hover:bg-zinc-700 transition flex items-center justify-center"
          title="Entrada por voz"
          type="button"
        >
          <Mic size={20} />
        </button>

        {/* Botão de Enviar (Direita) */}
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          className="
            flex items-center justify-center 
            bg-red-600 hover:bg-red-700 
            text-white 
            rounded-full 
            transition
            w-10 h-10 
            ml-2
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Enviar"
          type="button"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
