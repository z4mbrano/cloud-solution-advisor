import { AuthForm } from '@/components/ui/AuthForm'
import { SplineSceneBasic } from '@/components/ui/SplineSceneBasic'

export function LoginPage() {
  return (
    <div className="w-full h-screen bg-[#1a1a1a]">
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Coluna da esquerda - Formulário */}
        <div className="w-full md:w-2/5 bg-[#2a2a2a] p-8 flex flex-col justify-center">
          <AuthForm />
        </div>

        {/* Coluna da direita - Robô */}
        <div className="hidden md:flex md:w-3/5">
          <SplineSceneBasic />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
