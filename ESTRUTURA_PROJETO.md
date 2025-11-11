# Estrutura do Projeto Cloud Solution Advisor

## 📁 Organização Atual

```
cloud-solution-advisor/
├── 🔧 config.py                 # Configuração centralizada
├── 📄 README.md                 # Documentação principal
├── ⚙️ package.json             # Dependências do projeto
│
├── 🤖 bot/                      # Bot, API e Treinamento
│   ├── 🚀 api.py                # API Flask principal
│   ├── 📋 requirements.txt      # Dependências Python
│   ├── 📖 README.md             # Documentação do bot
│   ├── 🧪 test_*.py            # Testes do bot e API
│   └── 📚 README_BACKEND.md     # Documentação técnica
│
├── 🎨 frontend/                 # Interface do usuário
│   ├── 📋 package.json          # Dependências do frontend
│   ├── 📖 README.md             # Documentação do frontend
│   ├── 🏠 index.html            # Página principal
│   ├── ⚙️ vite.config.js       # Configuração do Vite
│   ├── 🎯 tsconfig.json        # Configuração TypeScript
│   ├── 📁 src/                  # Código fonte React
│   │   ├── 🎨 App.jsx          # Componente principal
│   │   ├── 🧩 components/       # Componentes React
│   │   ├── 📄 pages/           # Páginas da aplicação
│   │   └── 🔧 services/        # Serviços e API calls
│   └── 📁 public/              # Arquivos estáticos
│
└── 🔨 Scripts/
    ├── 🚀 start-backend.bat     # Iniciar API (pasta bot)
    ├── 🎨 start-frontend.bat    # Iniciar frontend
    ├── 🧪 run-tests.bat        # Executar testes
    ├── ⚙️ setup.ps1            # Configuração inicial
    └── 🆕 setup-new.ps1        # Configuração nova
```

## 🎯 Principais Mudanças

### ✅ Antes
- Arquivos espalhados em `backend/` e `bot/`
- API em local separado do bot
- Estrutura confusa com duplicação

### ✅ Depois
- **bot/**: Consolidou toda lógica de IA, API e treinamento
- **frontend/**: Interface React/TypeScript organizada
- **Raiz**: Configuração e scripts centralizados

## 🚀 Como Usar

### Iniciar Backend (Bot + API)
```bash
.\start-backend.bat
```
- Instala dependências automaticamente
- Inicia servidor Flask na porta 5000
- Configuração Google AI inclusa

### Iniciar Frontend
```bash
.\start-frontend.bat
```
- Inicia servidor Vite de desenvolvimento
- Interface React com TypeScript
- Hot reload habilitado

### Executar Testes
```bash
.\run-tests.bat
```
- Testa API e funcionalidades do bot
- Validação completa do sistema

## 📋 Dependências

### Bot/API (Python)
- Flask 3.0.0
- flask-cors 4.0.0
- google-generativeai 0.3.2

### Frontend (Node.js)
- React + TypeScript
- Vite (build tool)
- CSS Modules

## ✅ Status
- ✅ Estrutura reorganizada
- ✅ Scripts atualizados
- ✅ Documentação completa
- ✅ Testes funcionando
- ✅ Backend e Frontend operacionais