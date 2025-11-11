@echo off
echo 🚀 Iniciando Cloud Solution Advisor Backend...
echo.

cd bot
echo 📁 Diretório: %CD%
echo.

echo ⚙️  Verificando dependências...
python -m pip install -r requirements.txt
echo.

echo 🔥 Iniciando servidor Flask...
python api.py