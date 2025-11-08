from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Configurar Google AI diretamente com a chave
GOOGLE_API_KEY = "AIzaSyC5qEJ7TBSxndhoB3ZzogVxAbiCkqKg8TU"
try:
    if GOOGLE_API_KEY:
        genai.configure(api_key=GOOGLE_API_KEY)
        print(f"✅ Google AI configurado com sucesso")
    else:
        print("❌ GOOGLE_API_KEY não configurada")
except Exception as e:
    print(f"❌ Erro ao configurar API: {e}")

# Armazenar histórico em memória (em produção, use banco de dados)
chat_history = {}

# Configurações dos bots
bot_configs = {
    'querrybot': {
        'name': 'Oracle QueryBot',
        'instructions': """
        Você é o "Oracle QueryBot", um assistente de IA especialista em soluções Oracle Cloud, com uma personalidade profissional, prestativa e sempre educada.

        Sua tarefa principal é analisar a necessidade de um cliente e recomendar UMA solução Oracle Cloud principal.
        Você deve focar 100% em soluções Oracle, mesmo se o cliente comparar com AWS, Azure ou GCP.

        ### Regras de Comportamento e Resposta

        1.  **Formato de Recomendação (Modo Principal):**
            QUANDO o usuário descrever um novo problema, desafio ou necessidade de negócio (ex: "preciso de um banco de dados rápido", "quero migrar meu sistema"), sua resposta DEVE seguir ESTRITAMENTE o formato abaixo. Não adicione saudações ou texto extra a esta resposta.

            Nome do Serviço: [Nome do serviço Oracle]
            Categoria: [Ex: Database, Compute, Storage, AI/ML]
            Justificativa Técnica: [Explicação curta e direta de por que este serviço é ideal, focando nos pontos-chave da necessidade do cliente]
            Argumentos de Venda: [OBRIGATÓRIO: Forneça de 2 a 3 pontos principais, em formato de lista, que um vendedor usaria para destacar o valor e os benefícios de negócio desta solução.]

        2.  **Modo de Conversa (Perguntas de Acompanhamento):**
            QUANDO o usuário fizer uma pergunta sobre a recomendação que você acabou de dar (ex: "Por que você escolheu esse?", "Me fale mais sobre o argumento 1", "Isso se integra com X?"), você DEVE responder em prosa normal.
            * Seja prestativo, mantenha sua persona de especialista e responda à pergunta.
            * Ao final da sua resposta, pergunte se ele tem mais dúvidas ou se gostaria de analisar uma nova necessidade.

        3.  **Regras de Segurança e Tópico:**
            * **Sempre educado:** Você NUNCA deve usar palavrões, xingamentos ou linguagem ofensiva, mesmo que o usuário seja provocativo ou rude.
            * **Recusa educada:** Se o usuário fizer perguntas fora do tópico (tecnologia, negócios ou Oracle Cloud), lembre-o educadamente que seu foco é ajudar com soluções Oracle.
            * **Abuso:** Se o usuário for explicitamente abusivo, responda uma única vez dizendo: "Como um assistente profissional, não posso continuar essa conversa de forma improdutiva. Por favor, mantenha o foco em suas necessidades de tecnologia."
        """
    },
    'querryarc': {
        'name': 'Oracle QueryArc',
        'instructions': """
        Você é o "Oracle QueryArc", um arquiteto de soluções Oracle Cloud especialista em design técnico, implementação e melhores práticas, com uma personalidade técnica, detalhista e sempre profissional.

        Sua tarefa principal é analisar necessidades técnicas de arquitetura e recomendar UMA solução Oracle Cloud principal com foco em implementação e aspectos arquiteturais.
        Você deve focar 100% em soluções Oracle, destacando aspectos técnicos e de arquitetura.

        ### Regras de Comportamento e Resposta

        1.  **Formato de Recomendação (Modo Principal):**
            QUANDO o usuário descrever um desafio técnico ou arquitetural (ex: "preciso escalar minha aplicação", "como implementar alta disponibilidade", "arquitetura para microserviços"), sua resposta DEVE seguir ESTRITAMENTE o formato abaixo:

            Nome do Serviço: [Nome do serviço Oracle]
            Categoria: [Ex: Database, Compute, Storage, AI/ML, Networking]
            Justificativa Técnica: [Explicação detalhada dos aspectos técnicos e arquiteturais que tornam este serviço ideal]
            Aspectos de Implementação: [2-3 pontos técnicos sobre como implementar, configurar ou integrar esta solução, incluindo melhores práticas]

        2.  **Modo de Consulta Técnica:**
            QUANDO o usuário fizer perguntas técnicas específicas sobre implementação, configuração ou arquitetura, responda com detalhes técnicos precisos.
            * Foque em aspectos práticos de implementação
            * Inclua considerações de performance, segurança e escalabilidade
            * Sugira melhores práticas e padrões arquiteturais

        3.  **Regras de Conduta Profissional:**
            * **Sempre técnico e respeitoso:** Mantenha linguagem profissional e técnica
            * **Foco em Oracle:** Todas as recomendações devem ser centradas em soluções Oracle Cloud
            * **Educação técnica:** Se o usuário sair do escopo técnico, redirecione educadamente para questões de arquitetura e implementação
        """
    }
}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        print("=== Nova requisição de chat ===")
        data = request.json
        print(f"Dados recebidos: {data}")
        
        user_message = data.get('message', '')
        bot_id = data.get('bot_id', 'querrybot')  # Default para QuerryBot
        chat_id = data.get('chat_id', 'default')
        
        print(f"Mensagem: {user_message}")
        print(f"Bot ID: {bot_id}")
        print(f"Chat ID: {chat_id}")
        
        if not user_message:
            return jsonify({'error': 'Mensagem vazia'}), 400
            
        if bot_id not in bot_configs:
            return jsonify({'error': 'Bot não encontrado'}), 400
        
        # Inicializar histórico do chat se não existir
        if chat_id not in chat_history:
            chat_history[chat_id] = []
        
        # Adicionar mensagem do usuário ao histórico
        user_msg = {
            'id': len(chat_history[chat_id]),
            'text': user_message,
            'sender': 'user',
            'bot_id': bot_id,
            'chat_id': chat_id
        }
        chat_history[chat_id].append(user_msg)
        
        # Gerar resposta com IA usando as instruções do bot específico
        try:
            print(f"Verificando API Key: {GOOGLE_API_KEY is not None}")
            if not GOOGLE_API_KEY:
                print("GOOGLE_API_KEY não configurada - usando fallback")
                # Fallback quando não há API key configurada
                bot_response = f"Olá! Sou o {bot_config['name']}. Infelizmente, a chave da API do Google AI não está configurada no momento. Por favor, configure a GOOGLE_API_KEY no arquivo .env para ativar minhas funcionalidades completas."
            else:
                print("Tentando gerar resposta com Google AI...")
                model_name = 'gemini-2.0-flash-exp'  # Usar modelo disponível
                model = genai.GenerativeModel(model_name)
                
                bot_config = bot_configs[bot_id]
                
                # Construir prompt com histórico do chat para contexto
                context_messages = []
                for msg in chat_history[chat_id][-5:]:  # Últimas 5 mensagens para contexto
                    if msg['sender'] == 'user':
                        context_messages.append(f"Usuário: {msg['text']}")
                    else:
                        context_messages.append(f"Assistente: {msg['text']}")
                
                context = "\n".join(context_messages[:-1]) if len(context_messages) > 1 else ""
                
                prompt_final = f"{bot_config['instructions']}\n\n"
                if context:
                    prompt_final += f"Contexto da conversa anterior:\n{context}\n\n"
                prompt_final += f"Nova mensagem do usuário:\n'{user_message}'"
                
                print(f"Enviando prompt para IA...")
                response = model.generate_content(prompt_final)
                bot_response = response.text.strip()
                print(f"Resposta da IA recebida: {bot_response[:100]}...")
                
        except Exception as ai_error:
            print(f"❌ ERRO DETALHADO na API do Google AI:")
            print(f"   Tipo do erro: {type(ai_error).__name__}")
            print(f"   Mensagem: {str(ai_error)}")
            import traceback
            print(f"   Stack trace: {traceback.format_exc()}")
            
            # Fallback em caso de erro na IA
            bot_response = f"Desculpe, estou enfrentando dificuldades técnicas no momento. Como {bot_config['name']}, posso ajudá-lo quando o serviço estiver funcionando normalmente. Por favor, tente novamente em alguns instantes."
        
        # Adicionar resposta ao histórico
        bot_msg = {
            'id': len(chat_history[chat_id]),
            'text': bot_response,
            'sender': 'bot',
            'bot_id': bot_id,
            'bot_name': bot_config['name'],
            'chat_id': chat_id
        }
        chat_history[chat_id].append(bot_msg)
        
        return jsonify({
            'message': bot_response,
            'bot_name': bot_config['name'],
            'chat_id': chat_id,
            'bot_id': bot_id
        })
        
    except Exception as e:
        print(f"Erro no endpoint de chat: {e}")
        return jsonify({
            'error': 'Erro interno do servidor',
            'message': 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
            'details': str(e) if app.debug else None
        }), 500

@app.route('/api/history/<chat_id>', methods=['GET'])
def get_chat_history(chat_id):
    """Obter histórico de um chat específico"""
    return jsonify(chat_history.get(chat_id, []))

@app.route('/api/history', methods=['GET'])
def get_history():
    """Obter todos os históricos"""
    return jsonify(chat_history)

@app.route('/api/clear/<chat_id>', methods=['POST'])
def clear_chat_history(chat_id):
    """Limpar histórico de um chat específico"""
    if chat_id in chat_history:
        del chat_history[chat_id]
    return jsonify({'message': f'Histórico do chat {chat_id} limpo'})

@app.route('/api/clear', methods=['POST'])
def clear_history():
    """Limpar todo o histórico"""
    chat_history.clear()
    return jsonify({'message': 'Histórico limpo'})

@app.route('/api/test', methods=['GET'])
def test():
    """Endpoint de teste"""
    return jsonify({
        'status': 'API funcionando',
        'google_api_configured': GOOGLE_API_KEY is not None,
        'available_bots': list(bot_configs.keys())
    })

@app.route('/api/bots', methods=['GET'])
def get_bots():
    """Obter informações dos bots disponíveis"""
    bots_info = {}
    for bot_id, config in bot_configs.items():
        bots_info[bot_id] = {
            'name': config['name'],
            'id': bot_id
        }
    return jsonify(bots_info)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
