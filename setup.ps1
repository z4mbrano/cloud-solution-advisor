# Script de Setup - Oracle Cloud Solution Advisor
# Execute este script para configurar o projeto completo

Write-Host "=== Oracle Cloud Solution Advisor - Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se Python está instalado
Write-Host "1. Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✓ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python não encontrado. Por favor, instale Python 3.8+" -ForegroundColor Red
    exit 1
}

# 2. Verificar se Node.js está instalado
Write-Host "2. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado. Por favor, instale Node.js 18+" -ForegroundColor Red
    exit 1
}

# 3. Instalar dependências Python
Write-Host "3. Instalando dependências Python..." -ForegroundColor Yellow
pip install -r requirements-api.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências Python instaladas" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar dependências Python" -ForegroundColor Red
    exit 1
}

# 4. Instalar dependências do Frontend
Write-Host "4. Instalando dependências do Frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências do Frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar dependências do Frontend" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# 5. Configurar variável de ambiente
Write-Host ""
Write-Host "=== Configuração Final ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Configure a variável de ambiente GOOGLE_API_KEY" -ForegroundColor Yellow
Write-Host "Execute o comando:" -ForegroundColor White
Write-Host '  $env:GOOGLE_API_KEY="sua-chave-aqui"' -ForegroundColor Cyan
Write-Host ""

# 6. Instruções de execução
Write-Host "=== Como Executar ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (API Flask):" -ForegroundColor Yellow
Write-Host "  python api.py" -ForegroundColor White
Write-Host "  Disponível em: http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend (React):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  Disponível em: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Streamlit (Legado):" -ForegroundColor Yellow
Write-Host "  streamlit run oracle_advisor/advisor.py" -ForegroundColor White
Write-Host ""
Write-Host "=== Setup Concluído! ===" -ForegroundColor Green
