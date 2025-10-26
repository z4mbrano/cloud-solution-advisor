import { useState } from 'react'
import { Cloud } from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar'
import ChatInput from '../ui/ChatInput'
import { chatAPI } from '../../services/api'

// Componente de Lista de Mensagens
const MessageList = ({ messages, isLoading }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`
            max-w-[70%] rounded-lg p-4
            ${msg.sender === 'user' 
              ? 'bg-[#f80000] text-white' 
              : 'bg-[#2d2d30] text-gray-100'
            }
            ${msg.isError ? 'border border-red-500' : ''}
          `}
        >
          <p className="whitespace-pre-wrap">{msg.text}</p>
        </div>
      </div>
    ))}
    {isLoading && (
      <div className="flex justify-start">
        <div className="bg-[#2d2d30] text-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
            <span>Analisando...</span>
          </div>
        </div>
      </div>
    )}
  </div>
)

// Tela vazia inicial
const EmptyChatDisplay = () => (
  <div className="m-auto flex flex-col items-center justify-center text-center">
    <div className="flex items-center text-3xl font-semibold text-white">
      <span className="p-2 bg-blue-600 rounded-full mr-3">
        <Cloud size={32} />
      </span>
      Oracle Cloud Solution Advisor
    </div>
    <p className="text-xl text-gray-400 mt-2">Análise de Necessidades com IA</p>
  </div>
)

// Layout Principal Corrigido
function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleSendMessage = async (message) => {
    if (message.trim() && !isLoading) {
      const userMessage = message.trim()
      
      // Adicionar mensagem do usuário
      const newUserMessage = {
        id: Date.now(),
        text: userMessage,
        sender: 'user',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newUserMessage])
      setIsLoading(true)

      try {
        // Chamar API
        const response = await chatAPI.sendMessage(userMessage)
        
        // Adicionar resposta da IA
        const botMessage = {
          id: Date.now() + 1,
          text: response.message,
          sender: 'bot',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#212121] text-white overflow-hidden">
      
      <Sidebar 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      {/* Área de Conteúdo Principal (CORREÇÃO: bg-[#212121] adicionado, h-screen removido) */}
      <main className="flex-1 flex flex-col bg-[#212121]">
        
        {/* Área de Mensagens: 
          - 'flex-1' faz ela crescer
          - 'overflow-y-auto' permite scroll interno
          - 'flex' e 'flex-col' são para o EmptyChatDisplay centralizar
        */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {messages.length > 0 ? (
            <MessageList messages={messages} isLoading={isLoading} />
          ) : (
            <EmptyChatDisplay />
          )}
        </div>

        {/* Área do Input (Fixa no rodapé):
          - 'p-4' dá o espaçamento
          - 'w-full' garante que ocupe a largura da <main>
        */}
        <div className="w-full p-4 pt-2">
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </main>
    </div>
  )
}

export default Layout
