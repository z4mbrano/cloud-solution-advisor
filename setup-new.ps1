#!/usr/bin/env pwsh

Write-Host "🚀 Oracle Cloud Solution Advisor - Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Verificar se Python está instalado
Write-Host "📋 Verificando dependências..." -ForegroundColor Yellow

try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado. Instale Python 3.8+ antes de continuar." -ForegroundColor Red
    exit 1
}

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js 18+ antes de continuar." -ForegroundColor Red
    exit 1
}

# Configurar arquivo .env se não existir
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  IMPORTANTE: Configure sua GOOGLE_API_KEY no arquivo .env" -ForegroundColor Red
    Write-Host "   Obtenha sua chave em: https://makersuite.google.com/app/apikey" -ForegroundColor Blue
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

# Instalar dependências Python
Write-Host "📦 Instalando dependências Python..." -ForegroundColor Yellow
try {
    pip install -r requirements-api.txt
    Write-Host "✅ Dependências Python instaladas" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao instalar dependências Python" -ForegroundColor Red
    exit 1
}

# Instalar dependências do Frontend
Write-Host "📦 Instalando dependências do Frontend..." -ForegroundColor Yellow
Set-Location "frontend"
try {
    npm install
    Write-Host "✅ Dependências do Frontend instaladas" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao instalar dependências do Frontend" -ForegroundColor Red
    Set-Location ".."
    exit 1
}
Set-Location ".."

Write-Host ""
Write-Host "🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para executar o projeto:" -ForegroundColor Cyan
Write-Host "1. Configure sua GOOGLE_API_KEY no arquivo .env" -ForegroundColor White
Write-Host "2. Execute o backend: python api.py" -ForegroundColor White
Write-Host "3. Em outro terminal, execute o frontend:" -ForegroundColor White
Write-Host "   cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""