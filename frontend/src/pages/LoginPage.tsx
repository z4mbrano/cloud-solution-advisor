import { AuthForm } from '@/components/ui/AuthForm'
import { SplineSceneBasic } from '@/components/ui/SplineSceneBasic'

export function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-[#1a1a1a]">
      <div className="w-full min-h-screen flex flex-col md:flex-row">
        {/* Coluna da esquerda - Formulário (40%) */}
        <div className="w-full md:w-[40%] bg-[#2a2a2a] p-8 flex flex-col justify-center order-1">
          <AuthForm />
        </div>

        {/* Coluna da direita - Robô (60%) */}
        <div className="hidden md:flex md:w-[60%] bg-black order-2">
          <SplineSceneBasic />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
