# Oracle Cloud Solution Advisor

Sistema de chat com bots especializados em soluções Oracle Cloud Infrastructure.

## 🤖 Bots Disponíveis

### QuerryBot
- **Especialização**: Vendas e soluções comerciais
- **Foco**: Identificar necessidades do cliente e apresentar soluções de negócio
- **Formato de resposta**: Nome do Serviço, Categoria, Justificativa Técnica, Argumentos de Venda

### QuerryArc  
- **Especialização**: Arquitetura e implementação técnica
- **Foco**: Design técnico, implementação e melhores práticas
- **Formato de resposta**: Nome do Serviço, Categoria, Justificativa Técnica, Aspectos de Implementação

## 🚀 Como Executar

### 1. Configurar a API Key

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env e adicionar sua Google AI API Key
GOOGLE_API_KEY=sua_chave_aqui
```

### 2. Backend (API)

```bash
# Instalar dependências Python
pip install -r requirements-api.txt

# Executar API
python api.py
```

A API estará disponível em: `http://localhost:5000`

### 3. Frontend

```bash
# Navegar para pasta frontend
cd frontend

# Instalar dependências
npm install

# Executar aplicação
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
├── api.py                 # Backend Flask
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── Sidebar/   # Navegação e seleção de bots
│   │   │   ├── Chat/      # Interface de chat
│   │   │   └── ui/        # Componentes de interface
│   │   └── services/      # Integração com API
│   └── public/            # Assets estáticos
└── requirements-api.txt   # Dependências Python
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