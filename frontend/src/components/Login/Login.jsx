import { useState } from 'react'
import styles from './Login.module.css'

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = () => {
    // Simulação de login - substituir por lógica real
    setIsLoggedIn(true)
    setUser({ name: 'Usuário', email: 'usuario@oracle.com' })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <div className={styles.loginContainer}>
      {!isLoggedIn ? (
        <button className={styles.loginButton} onClick={handleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Login</span>
        </button>
      ) : (
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className={styles.userName}>{user?.name}</div>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

export default Login
