import { useState } from 'react'
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
  LogOut
} from 'lucide-react'
import styles from './Sidebar.module.css'

// Dados dos itens do menu
const menuItems = [
  { id: 1, icon: Database, text: 'Análise de Banco de Dados para Sistema de E-commerce com Alta Demanda' },
  { id: 2, icon: Box, text: 'Solução de Storage para Arquivamento de Dados Históricos' },
  { id: 3, icon: Cloud, text: 'Compute Cloud para Processamento de Machine Learning' },
  { id: 4, icon: Waypoints, text: 'Migração de Ambiente On-Premise para OCI' },
  { id: 5, icon: AlertTriangle, text: 'Análise de Custos para Ambiente de Desenvolvimento' },
  { id: 6, icon: DatabaseZap, text: 'Configuração de Alta Disponibilidade para Aplicação Crítica' },
  { id: 7, icon: Gauge, text: 'Otimização de Performance para Banco de Dados' },
  { id: 8, icon: Network, text: 'Arquitetura de Microsserviços na OCI' }
]

function Sidebar({ isCollapsed, toggleSidebar, activeChat, setActiveChat }) {
  const [selectedItem, setSelectedItem] = useState(1)

  const handleItemClick = (id) => {
    setSelectedItem(id)
    if (setActiveChat) setActiveChat(id)
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

      {/* Lista de Histórico */}
      <nav className={styles.historyNav}>
        <span className={`${styles.historyTitle} ${isCollapsed ? styles.hidden : ''}`}>
          Histórico de Análises
        </span>
        <ul className={styles.historyList}>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id} className={styles.historyItemWrapper}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.text : undefined}
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
                    {item.text}
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
