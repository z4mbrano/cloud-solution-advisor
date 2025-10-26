# Instalação das Dependências do Frontend React

## Passos para configurar o projeto

1. **Navegue até a pasta frontend:**
```powershell
cd frontend
```

2. **Instale as dependências:**
```powershell
npm install
```

3. **Instale as dependências adicionais (framer-motion e lucide-react):**
```powershell
npm install framer-motion lucide-react
```

4. **Execute o projeto em modo desenvolvimento:**
```powershell
npm run dev
```

## Estrutura do Projeto Atualizada

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── ai-chat-input.tsx    # Input customizado com animações
│   │   ├── Layout/
│   │   │   ├── Layout.jsx           # Layout principal com sidebar retrátil
│   │   │   └── Layout.module.css
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx          # Sidebar com histórico
│   │   │   └── Sidebar.module.css
│   │   ├── Chat/
│   │   │   ├── Chat.jsx             # Área de mensagens (apenas scroll)
│   │   │   └── Chat.module.css
│   │   └── Login/
│   │       ├── Login.jsx
│   │       └── Login.module.css
│   ├── services/
│   │   └── api.js                   # Serviço de API
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Novos Recursos Implementados

### 1. Layout de 3 Partes
- ✅ Sidebar retrátil (260px quando aberta)
- ✅ Área de mensagens com scroll isolado
- ✅ Input fixo no rodapé

### 2. Sidebar Retrátil
- ✅ Botão de toggle posicionado na borda
- ✅ Transição suave (0.3s)
- ✅ Ícones Chevron (Left/Right)

### 3. Componente AI Chat Input
- ✅ Tema cinza-escuro (#3a3a40)
- ✅ Botão vermelho de enviar (#f80000)
- ✅ Ícone Share2 à esquerda
- ✅ Animação de expansão (68px → 128px)
- ✅ Controles extras (Think, Deep Search)
- ✅ Alinhamento vertical perfeito

### 4. Correção de Scroll
- ✅ Apenas a lista de mensagens tem scroll
- ✅ Input fixo no rodapé
- ✅ Sidebar fixa
- ✅ Sem scroll na página principal

## Comandos Úteis

```powershell
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

## Notas Importantes

- O componente `ai-chat-input.tsx` usa TypeScript
- As dependências `framer-motion` e `lucide-react` são necessárias
- O layout é totalmente responsivo
- A sidebar se comporta diferente em mobile (overlay)

## Troubleshooting

Se houver erros de importação:
1. Certifique-se de que todas as dependências foram instaladas
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do Vite: `rm -rf node_modules/.vite`
