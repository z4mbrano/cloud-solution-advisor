import { useState, useEffect } from 'react'
import { 
  Menu, 
  Database, 
  Box, 
  Cloud, 
  Waypoints, 
  AlertTriangle, 
  DatabaseZap, 
  Gauge, 
  Network,
  LogOut,
  Bot,
  Zap
} from 'lucide-react'
import styles from './Sidebar.module.css'

// Dados dos bots
const bots = [
  { 
    id: 'querrybot', 
    icon: Bot, 
    text: 'QuerryBot',
    description: 'Chatbot especializado em vendas'
  },
  { 
    id: 'querryarc', 
    icon: Zap, 
    text: 'QuerryArc',
    description: 'Chatbot arquiteto de soluções'
  }
]

// Dados dos itens do histórico (carregados do localStorage)
function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem('chat_history')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

function Sidebar({ isCollapsed, toggleSidebar, activeChat, setActiveChat, activeBot, setActiveBot }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedBot, setSelectedBot] = useState(null)
  const [historyItems, setHistoryItems] = useState(loadHistoryFromStorage)

  // Carregar histórico do localStorage quando o componente monta
  useEffect(() => {
    const stored = loadHistoryFromStorage()
    setHistoryItems(stored)
  }, [])

  // Salvar novo chat no histórico
  const saveNewChatToHistory = (botId, chatId) => {
    const newChat = {
      id: chatId || `chat_${Date.now()}`,
      botId: botId,
      timestamp: new Date().toISOString(),
      title: `client${historyItems.length + 1}`,
      messages: []
    }
    
    const updatedHistory = [newChat, ...historyItems]
    setHistoryItems(updatedHistory)
    localStorage.setItem('chat_history', JSON.stringify(updatedHistory))
    return newChat.id
  }

  const handleBotClick = (botId) => {
    setSelectedBot(botId)
    setSelectedItem(null)
    if (setActiveBot) setActiveBot(botId)
    
    // Criar novo chat para o bot
    const chatId = saveNewChatToHistory(botId)
    if (setActiveChat) setActiveChat(chatId)
  }

  const handleHistoryItemClick = (item) => {
    setSelectedItem(item.id)
    setSelectedBot(null)
    if (setActiveChat) setActiveChat(item.id)
    if (setActiveBot) setActiveBot(item.botId)
  }

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Topo do Sidebar: Botão de Menu e Logo */}
      <div className={styles.sidebarHeader}>
        <button
          onClick={toggleSidebar}
          className={styles.menuButton}
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          <Menu size={20} />
        </button>
        {/* Logo (só aparece se expandido) */}
        <img 
          src="/logo_oracle_aside.png"
          alt="Oracle Logo" 
          className={`${styles.logo} ${isCollapsed ? styles.hidden : ''}`}
        />
      </div>

      {/* Seção de Bots */}
      <nav className={styles.botsNav}>
        <span className={`${styles.sectionTitle} ${isCollapsed ? styles.hidden : ''}`}>
          Bots
        </span>
        <ul className={styles.botsList}>
          {bots.map((bot) => {
            const Icon = bot.icon
            return (
              <li key={bot.id} className={styles.historyItemWrapper}>
                <button
                  onClick={() => handleBotClick(bot.id)}
                  title={isCollapsed ? bot.text : bot.description}
                  className={`${styles.historyItem} ${selectedBot === bot.id ? styles.active : ''}`}
                >
                  {/* Borda vermelha ativa */}
                  {selectedBot === bot.id && (
                    <div className={styles.activeBorder}></div>
                  )}
                  
                  {/* Ícone (sempre visível) */}
                  <Icon size={20} className={styles.icon} />
                  
                  {/* Texto (só aparece se expandido) */}
                  <span className={`${styles.itemText} ${isCollapsed ? styles.hidden : ''}`}>
                    {bot.text}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Lista de Histórico */}
      <nav className={styles.historyNav}>
        <span className={`${styles.sectionTitle} ${isCollapsed ? styles.hidden : ''}`}>
          Histórico
        </span>
        <ul className={styles.historyList}>
          {historyItems.map((item) => {
            // Ícone baseado no bot usado
            const botData = bots.find(b => b.id === item.botId)
            const Icon = botData ? botData.icon : Database
            
            return (
              <li key={item.id} className={styles.historyItemWrapper}>
                <button
                  onClick={() => handleHistoryItemClick(item)}
                  title={isCollapsed ? `${item.title} (${botData?.text || 'Bot'})` : undefined}
                  className={`${styles.historyItem} ${selectedItem === item.id ? styles.active : ''}`}
                >
                  {/* Borda vermelha ativa */}
                  {selectedItem === item.id && (
                    <div className={styles.activeBorder}></div>
                  )}
                  
                  {/* Ícone (sempre visível) */}
                  <Icon size={20} className={styles.icon} />
                  
                  {/* Texto (só aparece se expandido) */}
                  <span className={`${styles.itemText} ${isCollapsed ? styles.hidden : ''}`}>
                    {item.title}
                    <span className={styles.botIndicator}>
                      ({botData?.text || 'Bot'})
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* NOVO Rodapé do Sidebar: Perfil do Usuário */}
      <div className={styles.sidebarFooter}>
        <div className={styles.profileContainer}>
          
          {/* Avatar (Sempre visível, centralizado quando colapsado) */}
          <div 
            className={`${styles.avatar} ${isCollapsed ? styles.avatarCentered : ''}`}
          >
            G {/* Letra do nome do usuário */}
          </div>
          
          {/* Info do Usuário (Nome e Logout) - Só aparece expandido */}
          <div className={`${styles.userInfo} ${isCollapsed ? styles.hidden : ''}`}>
            {/* Nome do Usuário */}
            <span className={styles.userName}>
              Guilherme B. {/* Nome do usuário */}
            </span>
            
            {/* Botão Logout */}
            <button 
              title="Logout" 
              className={styles.logoutButton}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
