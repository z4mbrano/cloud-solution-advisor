import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Base wrapper para inputs com ícone (melhor espaçamento/focus)
const InputShell: React.FC<{ leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; children: React.ReactNode }> = ({ leftIcon, rightIcon, children }) => (
  <div
    className="relative flex items-center rounded-md bg-[#1a1a1a] focus-within:ring-2 focus-within:ring-red-500/50 transition-all"
  >
    {leftIcon && <span className="pl-4 text-gray-500 flex items-center" aria-hidden>{leftIcon}</span>}
    <div className="flex-1">{children}</div>
    {rightIcon && <span className="pr-4 text-gray-500 flex items-center cursor-pointer" aria-hidden>{rightIcon}</span>}
  </div>
)

// Componente Input simples
interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType
}

const SimpleInput = React.forwardRef<HTMLInputElement, SimpleInputProps>(
  ({ icon: Icon, ...props }, ref) => {
    return (
      <InputShell leftIcon={<Icon size={20} />}>
        <input
          ref={ref}
          className="w-full bg-transparent text-white placeholder-gray-500 px-3 py-3.5 outline-none"
          {...props}
        />
      </InputShell>
    )
  }
)
SimpleInput.displayName = 'SimpleInput'

// Componente Password Input c/ toggle
interface SimplePasswordProps extends Omit<SimpleInputProps, 'type' | 'icon'> {}

const SimplePasswordInput = React.forwardRef<HTMLInputElement, SimplePasswordProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);
    return (
      <InputShell 
        leftIcon={<Lock size={20} />}
        rightIcon={
          <button 
            type="button" 
            onClick={() => setShow(!show)} 
            className="focus:outline-none hover:text-gray-300 transition-colors"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
      >
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          className="w-full bg-transparent text-white placeholder-gray-500 px-3 py-3.5 outline-none"
          {...props}
        />
      </InputShell>
    );
  }
);
SimplePasswordInput.displayName = 'SimplePasswordInput';

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      {/* Logo CQ */}
      <div className="text-center mb-12">
        <h1 className="text-7xl font-extrabold text-red-600 tracking-wider mb-2">CQ</h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-red-600/30"></div>
          <div className="h-px w-12 bg-red-600/30"></div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <SimpleInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <SimplePasswordInput
          id="password"
          placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold text-sm uppercase tracking-wider py-4 px-4 rounded-md mt-8
                     hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#2a2a2a]
                     transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
        >
          Entrar
        </button>
      </form>

      {/* Link de registro */}
      <p className="text-center mt-8 text-sm">
        <span className="text-gray-400">Não tem uma conta? </span>
        <Link to="/register" className="text-red-500 hover:text-red-400 hover:underline font-medium transition-all">
          Criar conta
        </Link>
      </p>
    </div>
  );
};
