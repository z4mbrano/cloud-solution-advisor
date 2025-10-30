import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// ESTA É A LINHA MAIS IMPORTANTE
// Ela carrega o Tailwind CSS
import './index.css' 
// Certifique-se de que o './App.css' (se existir) seja removido
// ou que o 'index.css' tenha prioridade.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
