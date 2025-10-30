// src/components/layouts/AuthLayout.tsx
import React from 'react';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    // 'min-h-screen' é crucial
    <div className="flex min-h-screen w-full bg-[#212121] text-white">
      
      {/* ===== LADO ESQUERDO (VISUAL) ===== */}
      {/* CORREÇÃO: 
        - 'hidden lg:flex' para responsividade
        - 'lg:w-1/2' para largura
        - 'min-h-screen' para dar altura ao pai do Spline
      */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-8 bg-black/[0.96] overflow-hidden min-h-screen">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#f80000" // Corrigido para vermelho Oracle
        />
        
        {/* Wrapper de conteúdo */}
        <div className="flex flex-col items-center z-10">
          <div className="p-8 relative z-10 flex flex-col justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Oracle Cloud Solution Advisor
            </h1>
            <p className="mt-4 text-neutral-300 max-w-lg">
              Sua solução de IA para desenhar arquiteturas de nuvem complexas.
            </p>
          </div>
          
          {/* CORREÇÃO: 
            - Altura e largura explícitas (w-[450px] h-[400px]) 
            - Isso corrige o erro 'Attachment has zero size' do WebGL.
          */}
          <div className="relative w-[450px] h-[400px]">
            <SplineScene
              scene={SPLINE_SCENE_URL}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* ===== LADO DIREITO (FORMULÁRIO) ===== */}
      <div className="flex-1 flex items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo que aparece no mobile (lg:hidden) */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src="/oracle_logo.png" alt="Oracle Logo" className="h-8" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout
