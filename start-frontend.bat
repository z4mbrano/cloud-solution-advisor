@echo off
echo 🚀 Iniciando Cloud Solution Advisor Frontend...
echo.

cd frontend
echo 📁 Diretório: %CD%
echo.

echo ⚙️  Verificando dependências...
npm install
echo.

echo 🔥 Iniciando servidor de desenvolvimento...
npm run dev