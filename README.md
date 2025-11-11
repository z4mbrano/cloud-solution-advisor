# Oracle Cloud Solution Advisor

Sistema de chat inteligente com bots especializados em soluções Oracle Cloud Infrastructure, construído com React + Flask + Google AI.

## 🏗️ Arquitetura do Projeto

```
cloud-solution-advisor/
├── frontend/           # React + Vite frontend
├── backend/            # Flask API backend
├── bot/               # Testes e análises dos bots
├── config.py          # Configurações centralizadas
├── start-frontend.bat # Script para iniciar frontend
├── start-backend.bat  # Script para iniciar backend
└── run-tests.bat     # Script para executar testes
```

## 🤖 Bots Disponíveis

### QueryBot (Especialista em Soluções)
- **ID**: `querrybot`
- **Especialização**: Recomendação de serviços Oracle Cloud
- **Formato**: Nome do Serviço, Categoria, Justificativa, Argumentos de Venda
- **Uso**: Identificar e recomendar soluções específicas

### QueryArc (Arquiteto de Soluções)
- **ID**: `querryarc`
- **Especialização**: Arquiteturas de referência Oracle
- **Formato**: Nome da Arquitetura, Link da Solução, Justificativa, Caso de Sucesso
- **Uso**: Design de soluções complexas e arquiteturas completas

## 🚀 Quick Start

### Inicialização Automática
```bash
# 1. Backend
.\start-backend.bat

# 2. Frontend (em outro terminal)
.\start-frontend.bat

# 3. Testes (opcional)
.\run-tests.bat
```

### URLs de Acesso
- **Frontend**: http://localhost:5173/
- **Backend API**: http://127.0.0.1:5000
- **API Test**: http://127.0.0.1:5000/api/test

## ⚙️ Configuração Manual

### 1. Configurar Google AI API Key

Edite o arquivo `config.py` e configure sua API key:
```python
GOOGLE_API_KEY = "sua_chave_do_google_ai_aqui"
```

### 2. Backend Manual
```bash
cd backend
pip install -r requirements.txt
python api.py
```

### 3. Frontend Manual
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testes e Validação

### Executar Todos os Testes
```bash
.\run-tests.bat
```

### Testes Individuais
```bash
cd bot
python test_final.py              # Teste rápido do sistema
python test_conversation_flow.py  # Teste completo com contexto
python test_google_ai.py          # Verificação da API Google AI
```
npm run dev
```

A aplicação estará disponível em: `http://localhost:3001`

## 🏗️ Arquitetura

### Backend
- **Flask** API REST
- **Google Gemini AI** para processamento de linguagem natural
- Suporte a múltiplos bots com personalidades distintas
- Histórico de conversas por chat

### Frontend
- **React + Vite** 
- **Tailwind CSS v4** para estilização
- **Spline 3D** para visualização de robô
- Gerenciamento de estado para múltiplos chats
- Persistência local e sincronização com backend

## 📁 Estrutura do Projeto

```
├── bot/                   # API Backend e Bots de IA
│   ├── api.py            # Servidor Flask principal
│   ├── requirements.txt  # Dependências Python
│   └── test_*.py         # Scripts de teste e debug
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── Sidebar/   # Navegação e seleção de bots
│   │   │   ├── Chat/      # Interface de chat
│   │   │   └── ui/        # Componentes de interface
│   │   └── services/      # Integração com API
│   └── public/            # Assets estáticos
├── config.py             # Configurações centralizadas
├── start-backend.bat     # Script executar backend
├── start-frontend.bat    # Script executar frontend
└── run-tests.bat         # Script executar testes
```

## 🔧 Funcionalidades

- ✅ Chat com múltiplos bots especializados
- ✅ Histórico persistente de conversas
- ✅ Interface responsiva com design Oracle
- ✅ Autenticação visual (login/registro)
- ✅ Visualização 3D interativa
- ✅ Integração completa frontend/backend

## 🛠️ Desenvolvimento

### Adicionar Novo Bot

1. **Backend**: Adicionar configuração em `bot_configs` no `api.py`
2. **Frontend**: Adicionar bot no array `bots` do `Sidebar.jsx`
3. Definir personalidade e formato de resposta específicos

### Customizar Respostas

As instruções dos bots estão em `api.py` na seção `bot_configs`. Cada bot tem:
- `name`: Nome de exibição
- `instructions`: Prompt detalhado com regras de comportamento