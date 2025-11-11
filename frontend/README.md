# Frontend - Cloud Solution Advisor

Este diretório contém o frontend da aplicação Cloud Solution Advisor construído com React + Vite.

## 📁 Estrutura

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Chat/           # Componente de chat
│   │   ├── Layout/         # Layout principal
│   │   ├── Login/          # Componentes de login
│   │   ├── Sidebar/        # Barra lateral
│   │   └── ui/             # Componentes de interface
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços (API calls)
│   └── lib/                # Utilitários
├── public/                 # Arquivos estáticos
├── package.json           # Dependências e scripts
└── vite.config.js         # Configuração do Vite
```

## 🚀 Como Executar

### Opção 1: Script Automático
```bash
# Na raiz do projeto
.\start-frontend.bat
```

### Opção 2: Manual
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuração

O frontend roda por padrão em:
- **URL**: http://localhost:5173/
- **Modo**: Desenvolvimento com hot-reload

### Conexão com Backend
O frontend se conecta automaticamente com o backend em `http://127.0.0.1:5000`

## 🎨 Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática

### Styling
- **Tailwind CSS** - Framework CSS
- **PostCSS** - Processamento CSS
- **CSS Modules** - Estilos encapsulados

### Componentes
- **Radix UI** - Componentes acessíveis
- **React Router** - Roteamento
- **Framer Motion** - Animações
- **Lucide React** - Ícones

### Funcionalidades Especiais
- **React Markdown** - Renderização de markdown
- **Spline** - Gráficos 3D interativos
- **Axios** - Cliente HTTP

## 🔨 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

## 🎯 Funcionalidades

### Chat Interface
- Interface de chat responsiva
- Suporte a markdown com links clicáveis
- Histórico de conversa
- Loading states

### Seleção de Bots
- QueryBot (Soluções Oracle)
- QueryArc (Arquiteturas)
- Troca dinâmica entre bots

### Design System
- Design moderno e responsivo
- Dark theme
- Animações suaves
- Componentes reutilizáveis

## 🛠️ Desenvolvimento

### Estrutura de Componentes
- Componentes funcionais com hooks
- CSS Modules para estilos
- TypeScript para tipagem
- Props interfaces bem definidas

### Estado da Aplicação
- Estado local com useState
- Gerenciamento de chat history
- Loading states centralizados

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)