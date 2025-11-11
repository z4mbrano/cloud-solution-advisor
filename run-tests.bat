@echo off
echo 🤖 Executando Testes do Cloud Solution Advisor Bot...
echo.

cd bot
echo 📁 Diretório: %CD%
echo.

echo 🧪 Executando teste final do sistema...
python test_final.py
echo.

echo 🧪 Executando teste de fluxo de conversa...
python test_conversation_flow.py
echo.

echo 🧪 Executando teste do Google AI...
python test_google_ai.py
echo.

echo ✅ Todos os testes concluídos!