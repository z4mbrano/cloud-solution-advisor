# Oracle Cloud Solution Advisor

## Estrutura do Projeto

```
cloud-solution-advisor/
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Sidebar/
│   │   │   ├── Chat/
│   │   │   └── Login/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── oracle_advisor/        # Aplicação Streamlit (legado)
│   └── advisor.py
├── api.py                 # API Flask
└── requirements-api.txt
```

## Instalação e Execução

### 1. Backend (API Flask)

```powershell
# Instalar dependências Python
pip install -r requirements-api.txt

# Configurar variável de ambiente
$env:GOOGLE_API_KEY="sua-chave-aqui"

# Executar API
python api.py
```

A API estará disponível em `http://localhost:5000`

### 2. Frontend (React)

```powershell
# Navegar para a pasta frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### 3. Streamlit (Legado)

```powershell
# Executar aplicação Streamlit
streamlit run oracle_advisor/advisor.py
```

## Endpoints da API

- `POST /api/chat` - Enviar mensagem e receber resposta da IA
- `GET /api/history` - Obter histórico de conversas
- `POST /api/clear` - Limpar histórico

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- CSS Modules
- Axios

### Backend
- Flask
- Google Generative AI (Gemini)
- Flask-CORS

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```
VITE_API_URL=http://localhost:5000
```

Configure a variável de ambiente do Python:

```powershell
$env:GOOGLE_API_KEY="sua-chave-google-ai"
```

## Features

- ✅ Interface inspirada no ChatGPT
- ✅ Design dark com identidade Oracle
- ✅ Sidebar com histórico de conversas
- ✅ Área de chat com formatação de mensagens
- ✅ Input expansível tipo ChatGPT
- ✅ Integração com Google Gemini AI
- ✅ Sistema de login (simulado)
- ✅ Responsivo para mobile
- ✅ Animações suaves
- ✅ Copy-to-clipboard nas respostas

## Próximos Passos

1. Implementar autenticação real
2. Adicionar persistência de dados (banco de dados)
3. Melhorar formatação de código nas respostas
4. Adicionar suporte a markdown completo
5. Implementar upload de arquivos
6. Adicionar testes automatizados
