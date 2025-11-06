import { useState, useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Chat from '../Chat/Chat'
import ChatInput from '../ui/ChatInput'
import { chatAPI } from '../../services/api'
import styles from './Layout.module.css'

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [activeBot, setActiveBot] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Configurações dos bots
  const botConfigs = {
    querrybot: {
      name: 'QuerryBot',
      personality: 'Especialista em vendas da Oracle Cloud Infrastructure. Focado em identificar necessidades do cliente e apresentar soluções comerciais.',
      greeting: 'Olá! Sou o QuerryBot, especialista em soluções comerciais da Oracle Cloud. Como posso ajudá-lo a encontrar a melhor solução para seu negócio?'
    },
    querryarc: {
      name: 'QuerryArc',
      personality: 'Arquiteto de soluções Oracle Cloud Infrastructure. Especialista em design técnico, implementação e melhores práticas.',
      greeting: 'Sou o QuerryArc, arquiteto de soluções Oracle Cloud. Estou aqui para ajudá-lo com questões técnicas, arquitetura e implementação. Como posso assistir?'
    }
  }

  const handleSendMessage = async (message) => {
    if (message.trim() && !isLoading && activeBot) {
      const userMessage = message.trim()
      
      // Adicionar mensagem do usuário
      const newUserMessage = {
        id: Date.now(),
        text: userMessage,
        sender: 'user',
        timestamp: new Date(),
        chatId: activeChat,
        botId: activeBot
      }
      
      setMessages(prev => [...prev, newUserMessage])
      setIsLoading(true)

      try {
        // Contexto do bot
        const botConfig = botConfigs[activeBot]
        const contextualMessage = `${botConfig.personality}\n\nUsuário: ${userMessage}`
        
        // Chamar API com contexto do bot
        const response = await chatAPI.sendMessage(contextualMessage)
        
        // Adicionar resposta da IA
        const botMessage = {
          id: Date.now() + 1,
          text: response.message,
          sender: 'bot',
          timestamp: new Date(),
          chatId: activeChat,
          botId: activeBot,
          botName: botConfig.name
        }
        
        setMessages(prev => [...prev, botMessage])

        // Salvar conversa no localStorage
        updateChatHistory(activeChat, [...messages, newUserMessage, botMessage])
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
          chatId: activeChat,
          botId: activeBot
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Atualizar histórico de chat no localStorage
  const updateChatHistory = (chatId, messages) => {
    try {
      const stored = localStorage.getItem('chat_history')
      const history = stored ? JSON.parse(stored) : []
      
      const chatIndex = history.findIndex(chat => chat.id === chatId)
      if (chatIndex >= 0) {
        history[chatIndex].messages = messages
        localStorage.setItem('chat_history', JSON.stringify(history))
      }
    } catch (error) {
      console.error('Erro ao salvar histórico:', error)
    }
  }

  // Carregar mensagens quando mudar o chat ativo
  const loadChatMessages = (chatId) => {
    try {
      const stored = localStorage.getItem('chat_history')
      const history = stored ? JSON.parse(stored) : []
      
      const chat = history.find(c => c.id === chatId)
      if (chat && chat.messages) {
        setMessages(chat.messages)
      } else {
        // Novo chat - mostrar saudação do bot
        if (activeBot && botConfigs[activeBot]) {
          const greeting = {
            id: Date.now(),
            text: botConfigs[activeBot].greeting,
            sender: 'bot',
            timestamp: new Date(),
            chatId: chatId,
            botId: activeBot,
            botName: botConfigs[activeBot].name
          }
          setMessages([greeting])
        } else {
          setMessages([])
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      setMessages([])
    }
  }

  // Carregar mensagens quando o chat ativo mudar
  useEffect(() => {
    if (activeChat) {
      loadChatMessages(activeChat)
    }
  }, [activeChat, activeBot])

  return (
    <div className={styles.layout}>
      <Sidebar 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        activeBot={activeBot}
        setActiveBot={setActiveBot}
      />

      <main className={styles.mainContent}>
        <Chat 
          messages={messages}
          isLoading={isLoading}
        />

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading || !activeBot}
              activeBot={activeBot}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout
