import { RegisterForm } from '@/components/ui/RegisterForm'
import { SplineSceneBasic } from '@/components/ui/SplineSceneBasic'

export function RegisterPage() {
  return (
    <div className="w-full min-h-screen bg-[#1a1a1a]">
      <div className="w-full min-h-screen flex flex-col md:flex-row">
        {/* Coluna da esquerda - Robô (60%) - INVERTIDO */}
        <div className="hidden md:flex md:w-[60%] bg-black order-2 md:order-1">
          <SplineSceneBasic />
        </div>

        {/* Coluna da direita - Formulário (40%) - INVERTIDO */}
        <div className="w-full md:w-[40%] bg-[#2a2a2a] p-8 flex flex-col justify-center order-1 md:order-2">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
