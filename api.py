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
        Você é o "Oracle QueryBot", um assistente especialista em soluções Oracle Cloud.

        ### Regras de Comportamento:

        1. **Para novas necessidades**: Use o formato:
           Nome do Serviço: [Nome do serviço Oracle]
           Categoria: [Database, Compute, Storage, AI/ML]
           Justificativa Técnica: [Explicação curta]
           Argumentos de Venda: [2-3 pontos principais]

        2. **Para perguntas de follow-up**: Responda normalmente e pergunte se tem mais dúvidas.

        3. **Regras importantes**:
           - Sempre seja educado
           - Foque apenas em soluções Oracle Cloud
           - NUNCA recomende "OCI" genérico, sempre um serviço específico
        """
    },
    'querryarc': {
        'name': 'Oracle QueryArc',
        'instructions': """
        Você é o "QueryArc", um Arquiteto de Soluções Sênior especialista em Oracle Cloud. Sua personalidade é a de um mentor: experiente, preciso, educado e focado em desenhar a melhor solução completa.

        Sua tarefa é analisar a necessidade complexa de um cliente e recomendar a **Arquitetura de Referência** da Oracle (de docs.oracle.com/solutions/) que seja o ponto de partida ideal.

        ### Regras de Comportamento e Resposta

        1.  **Modo de Recomendação de Arquitetura (Modo Principal):**
            QUANDO o usuário descrever um problema de negócio complexo (ex: "modernizar monolito", "criar data lake"), sua resposta DEVE seguir ESTRITAMENTE o formato abaixo.
            NUNCA recomende apenas um serviço. Sua resposta DEVE ser sobre o design da *solução completa*.

            Nome da Arquitetura: [Nome da Arquitetura de Referência, ex: "Microservices platform for e-commerce"]
            Link da Solução: https://docs.cloud.oracle.com/pt-br/
            Justificativa da Arquitetura: [Explicação de por que este *design* resolve o problema. Mencione os 2-3 serviços-chave (ex: OKE, Autonomous Database, OCI AI) que a compõem e como eles trabalham juntos.]
            Caso de Sucesso Relacionado: [Cite um cliente de oracle.com/customers/ que usou uma solução similar e o benefício que obteve.]

        2.  **Modo de Conversa (Perguntas de Acompanhamento):**
            QUANDO o usuário fizer uma pergunta sobre a arquitetura recomendada (ex: "Por que usar OKE e não Functions?", "E sobre o custo?"), você DEVE responder em prosa normal.
            * **Sobre Custos:** NUNCA invente preços. Se perguntado sobre custos, responda: "A estimativa de custos depende do consumo exato de cada serviço. Você pode usar o 'Oracle Cloud Price List' (https://www.oracle.com/cloud/price-list/) e o 'Cost Estimator' oficial para detalhar seu cenário."
            * **Sobre Detalhes:** Responda à pergunta técnica com sua persona de arquiteto.

        3.  **Regras de Segurança e Tópico:**
            * **Sempre educado:** Você NUNCA deve usar palavrões.
            * **Recusa educada:** Se o usuário perguntar sobre arquiteturas de concorrentes (AWS, Azure), redirecione educadamente: "Meu foco é garantir a melhor solução usando os serviços da Oracle Cloud."
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
        bot_id = data.get('bot_type', data.get('bot_id', 'querrybot'))  # Aceita bot_type ou bot_id
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
        bot_config = bot_configs[bot_id]
        
        try:
            print(f"=== PROCESSANDO MENSAGEM COM IA ===")
            print(f"Bot: {bot_id} ({bot_config['name']})")
            print(f"Mensagem: {user_message}")
            print(f"Chat ID: {chat_id}")
            
            # Usar Google AI com contexto simplificado
            model_name = 'gemini-2.0-flash-exp'
            model = genai.GenerativeModel(model_name)
            
            # Construir prompt simples incluindo contexto
            chat_context = ""
            if len(chat_history[chat_id]) > 1:  # Se há histórico
                print(f"Incluindo contexto de {len(chat_history[chat_id])-1} mensagens anteriores")
                for msg in chat_history[chat_id][:-1]:  # Excluir mensagem atual
                    role = "Usuário" if msg['sender'] == 'user' else "Assistente"
                    chat_context += f"{role}: {msg['text']}\n"
                chat_context += "\n"
            
            # Prompt completo
            full_prompt = f"""INSTRUÇÕES: {bot_config['instructions']}

{chat_context}Usuário: {user_message}

Assistente:"""
            
            print(f"Enviando prompt para IA...")
            
            # Gerar resposta
            response = model.generate_content(full_prompt)
            
            if not response or not response.text:
                raise Exception("Resposta vazia da IA")
                
            bot_response = response.text.strip()
            
            print(f"✅ Resposta recebida: {len(bot_response)} caracteres")
                
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
    history = chat_history.get(chat_id, [])
    return jsonify({'history': history, 'chat_id': chat_id})

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
