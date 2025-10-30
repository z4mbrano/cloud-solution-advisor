import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

// Base wrapper para inputs
const InputShell: React.FC<{ rightIcon?: React.ReactNode; children: React.ReactNode }> = ({ rightIcon, children }) => (
  <div className="relative flex items-center rounded-md bg-[#1a1a1a] border border-transparent focus-within:border-[#ff0000] transition-all duration-300">
    <div className="flex-1">{children}</div>
    {rightIcon && <span className="pr-4 text-[#999999] flex items-center cursor-pointer" aria-hidden>{rightIcon}</span>}
  </div>
)

// Componente Input simples (sem ícone à esquerda)
interface PlainInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PlainInput = React.forwardRef<HTMLInputElement, PlainInputProps>(
  (props, ref) => {
    return (
      <InputShell>
        <input
          ref={ref}
          className="w-full bg-transparent text-white placeholder-[#666666] px-4 py-3.5 outline-none"
          {...props}
        />
      </InputShell>
    )
  }
)
PlainInput.displayName = 'PlainInput'

// Componente Password Input c/ toggle (sem ícone à esquerda)
interface PlainPasswordProps extends Omit<PlainInputProps, 'type'> {}

const PlainPasswordInput = React.forwardRef<HTMLInputElement, PlainPasswordProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);
    return (
      <InputShell 
        rightIcon={
          <button 
            type="button" 
            onClick={() => setShow(!show)} 
            className="focus:outline-none hover:text-white transition-colors"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
      >
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          className="w-full bg-transparent text-white placeholder-[#666666] px-4 py-3.5 outline-none"
          {...props}
        />
      </InputShell>
    );
  }
);
PlainPasswordInput.displayName = 'PlainPasswordInput';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log({ username, email, password });
    navigate('/');
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      {/* Logo Oracle */}
      <div className="flex justify-center mb-12">
        <img 
          src="/logo_oracle_aside.png" 
          alt="Oracle Logo" 
          className="h-32 w-auto object-contain"
        />
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PlainInput
          id="username"
          type="text"
          placeholder="nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <PlainInput
          id="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <PlainPasswordInput
          id="password"
          placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PlainPasswordInput
          id="confirmPassword"
          placeholder="confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#ff0000] text-white font-bold text-sm uppercase tracking-wider py-4 px-4 rounded-md mt-6
                     hover:bg-[#cc0000] focus:outline-none focus:ring-2 focus:ring-[#ff0000] focus:ring-offset-2 focus:ring-offset-[#2a2a2a]
                     transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Criar Conta
        </button>
      </form>

      {/* Link de login */}
      <p className="text-center mt-8 text-sm">
        <span className="text-[#999999]">Já tem uma conta? </span>
        <Link to="/login" className="text-[#ff0000] hover:text-[#cc0000] font-medium transition-all">
          Fazer login
        </Link>
      </p>
    </div>
  );
};
