import { useRef, useEffect } from 'react'
import styles from './Chat.module.css'

function Chat({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const formatMessage = (text) => {
    // Formatar listas
    let formatted = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>')
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    
    // Formatar negrito
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Formatar quebras de linha
    formatted = formatted.replace(/\n\n/g, '</p><p>')
    formatted = `<p>${formatted}</p>`
    
    return formatted
  }

  return (
    <div className={styles.chatScrollArea}>
      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          <h1 className={styles.title}>☁️ Oracle Cloud Solution Advisor</h1>
          <p className={styles.subtitle}>Análise de Necessidades com IA</p>
        </div>
      ) : (
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.sender === 'bot' && (
                  <button
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(message.text)}
                    aria-label="Copiar resposta"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                )}
                {message.sender === 'bot' ? (
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
                ) : (
                  <div>{message.text}</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.messageContent}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}

export default Chat
