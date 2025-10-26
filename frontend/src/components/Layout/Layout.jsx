import { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Chat from '../Chat/Chat'
import ChatInput from '../ui/ChatInput'
import { chatAPI } from '../../services/api'
import styles from './Layout.module.css'

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
    <div className={styles.layout}>
      <Sidebar 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
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
              disabled={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout
