// components/ui/ai-chat-input.tsx
"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Share2, Send } from "lucide-react"; 
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDER = "Descreva o desafio do seu cliente...";

interface AIChatInputProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const AIChatInput = ({ onSendMessage, isLoading = false }: AIChatInputProps) => {
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = () => setIsActive(true);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerVariants = {
    collapsed: {
      height: 68,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 128,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  return (
    <motion.div
      ref={wrapperRef}
      className="w-full"
      variants={containerVariants}
      animate={isActive || inputValue ? "expanded" : "collapsed"}
      initial="collapsed"
      style={{
        overflow: "hidden",
        borderRadius: 32,
        background: "#3a3a40",
        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.1)",
      }}
      onClick={handleActivate}
    >
      <div className="flex flex-col items-stretch w-full h-full">
        {/* Input Row */}
        <div className="flex items-center gap-2 p-3 rounded-full bg-[#3a3a40] text-gray-200 w-full">
          
          {/* Botão de Compartilhar */}
          <button
            className="p-3 rounded-full hover:bg-zinc-700 transition flex items-center justify-center"
            title="Compartilhar"
            type="button"
            tabIndex={-1}
          >
            <Share2 size={20} />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-gray-100 placeholder-gray-400"
              style={{ position: "relative", zIndex: 1 }}
              onFocus={handleActivate}
              placeholder={PLACEHOLDER}
              disabled={isLoading}
            />
          </div>

          <button
            className="p-3 rounded-full hover:bg-zinc-700 transition flex items-center justify-center"
            title="Entrada por voz"
            type="button"
            tabIndex={-1}
          >
            <Mic size={20} />
          </button>
          
          {/* Botão de Enviar VERMELHO */}
          <button
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full font-medium justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Enviar"
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Expanded Controls */}
        <motion.div
          className="w-full flex justify-start px-4 items-center text-sm"
          variants={{
            hidden: { opacity: 0, y: 20, pointerEvents: "none" as const },
            visible: { opacity: 1, y: 0, pointerEvents: "auto" as const, transition: { duration: 0.35, delay: 0.08 } },
          }}
          initial="hidden"
          animate={isActive || inputValue ? "visible" : "hidden"}
          style={{ marginTop: 8 }}
        >
          <div className="flex gap-3 items-center">
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all font-medium group ${
                thinkActive
                  ? "bg-blue-600/10 outline outline-blue-600/60 text-blue-300"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
              title="Think"
              type="button"
              onClick={(e) => { e.stopPropagation(); setThinkActive((a) => !a); }}
            >
              <Lightbulb size={18} />
              Think
            </button>
            <motion.button
              className={`flex items-center px-4 gap-1 py-2 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${
                deepSearchActive
                  ? "bg-blue-600/10 outline outline-blue-600/60 text-blue-300"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
              title="Deep Search"
              type="button"
              onClick={(e) => { e.stopPropagation(); setDeepSearchActive((a) => !a); }}
              initial={false}
              animate={{ width: deepSearchActive ? 125 : 36, paddingLeft: deepSearchActive ? 8 : 9 }}
            >
              <div className="flex-1"><Globe size={18} /></div>
              <motion.span
                className="pb-[2px]"
                initial={false}
                animate={{ opacity: deepSearchActive ? 1 : 0 }}
              >
                Deep Search
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { AIChatInput };
