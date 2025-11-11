# 🤖 Bot - Oracle Cloud Solution Advisor

Esta pasta contém toda a lógica do bot, incluindo a API backend e os testes.

## 📁 Estrutura

```
bot/
├── api.py                    # API principal do Flask com os bots QueryBot e QueryArc
├── api_simple.py            # Versão simplificada da API para testes
├── requirements.txt         # Dependências Python
├── test_*.py               # Arquivos de teste do sistema
└── README.md               # Este arquivo
```

## 🚀 Como Executar

### Método Rápido (Scripts)
```bash
# Da pasta raiz do projeto
.\start-backend.bat
```

### Método Manual
```bash
cd bot
python -m pip install -r requirements.txt
python api.py
```

## 🤖 Bots Disponíveis

### QueryBot (Oracle QueryBot)
- **Função**: Especialista em soluções Oracle Cloud
- **Formato**: Recomendações de serviços específicos
- **Modo 1**: Problemas novos → Formato estruturado (Nome do Serviço, Categoria, etc.)
- **Modo 2**: Follow-ups → Respostas conversacionais

### QueryArc (Oracle QueryArc)
- **Função**: Arquiteto de soluções Oracle Cloud
- **Formato**: Arquiteturas de referência completas
- **Modo 1**: Problemas complexos → Arquiteturas com links e casos de sucesso
- **Modo 2**: Detalhes → Explicações técnicas específicas

## 🔧 Configuração

### Variáveis de Ambiente
```python
GOOGLE_API_KEY = "sua_chave_aqui"
GOOGLE_AI_MODEL = "gemini-2.0-flash-exp"
DEBUG_MODE = True
BACKEND_PORT = 5000
```

### Endpoints da API

- `POST /api/chat` - Chat principal
- `GET /api/test` - Teste de conectividade  
- `GET /api/history/<chat_id>` - Histórico de conversa
- `GET /api/bots` - Informações dos bots

## 🧪 Testes Disponíveis

- `test_final.py` - Teste completo do sistema
- `test_conversation_flow.py` - Teste de fluxo de conversa
- `test_google_ai.py` - Teste direto da API do Google AI
- `test_debug_querybot.py` - Debug específico do QueryBot
- `test_api.py` - Teste básico da API
- `test_models.py` - Teste de modelos disponíveis

### Executar Testes
```bash
# Da pasta raiz
.\run-tests.bat

# Ou manualmente
cd bot
python test_final.py
```

## 🔗 Integração

A API roda em `http://127.0.0.1:5000` e aceita requisições CORS do frontend React.

**Exemplo de requisição:**
```json
{
  "message": "Preciso de um banco de dados",
  "bot_type": "querrybot",
  "chat_id": "session123"
}
```

## 🐛 Debug

Para debug detalhado, execute:
```bash
python test_debug_querybot.py
```

Isso mostrará logs detalhados da comunicação com a API do Google AI.