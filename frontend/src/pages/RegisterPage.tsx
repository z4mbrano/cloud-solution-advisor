import React, { useState } from 'react'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    // Redirecionar para home após registro
    navigate('/')
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <input
            id="username"
            type="text"
            placeholder="nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#1a1a1a] text-white placeholder-[#666666] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0000] transition-all duration-300 text-sm"
            autoComplete="name"
            required
          />
        </div>
        
        <div>
          <input
            id="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#1a1a1a] text-white placeholder-[#666666] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0000] transition-all duration-300 text-sm"
            autoComplete="email"
            required
          />
        </div>
        
        <div>
          <input
            id="password"
            type="password"
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#1a1a1a] text-white placeholder-[#666666] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0000] transition-all duration-300 text-sm"
            autoComplete="new-password"
            required
          />
        </div>
        
        <div>
          <input
            id="confirm-password"
            type="password"
            placeholder="confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#1a1a1a] text-white placeholder-[#666666] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0000] transition-all duration-300 text-sm"
            autoComplete="new-password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-3.5 bg-[#ff0000] text-white font-bold text-sm uppercase tracking-wide rounded-lg hover:bg-[#e60000] hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] mt-2"
        >
          CRIAR CONTA
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-400 mt-6">
        Já tem uma conta?{' '}
        <Link 
          to="/login" 
          className="text-[#ff0000] hover:underline transition-all duration-300"
        >
          Fazer login
        </Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
