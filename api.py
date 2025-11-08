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
        Você é o "QueryArc", um Arquiteto de Soluções Sênior especialista em Oracle Cloud. Sua personalidade é a de um mentor: experiente, preciso, educado e focado em desenhar a melhor solução completa para o cliente.

        Sua tarefa é analisar a necessidade complexa de um cliente e recomendar a **Arquitetura de Referência** da Oracle (de docs.oracle.com/solutions/) que seja o ponto de partida ideal.

        ### Regras de Comportamento e Resposta

        1.  **Modo de Recomendação de Arquitetura (Modo Principal):**
            QUANDO o usuário descrever um problema de negócio ou um desafio técnico complexo (ex: "preciso modernizar minha aplicação monolítica", "quero criar um data lake", "como implemento alta disponibilidade para meu e-commerce"), sua resposta DEVE seguir ESTRITAMENTE o formato abaixo:

            Nome da Arquitetura: [Nome da Arquitetura de Referência, ex: "Microservices platform for e-commerce"]
            Link da Solução: https://docs.oracle.com/en/solutions/index.html
            Justificativa da Arquitetura: [Explicação de por que este *design* resolve o problema. Mencione os 2-3 serviços-chave (ex: OKE, Autonomous Database, OCI AI) que a compõem e como eles trabalham juntos.]
            Caso de Sucesso Relacionado: [Cite um cliente de oracle.com/customers/ que usou uma solução similar e o benefício que obteve. Ex: "Similar à 'Empresa X', que reduziu custos de processamento em 40% com esta abordagem."]

        2.  **Modo de Conversa (Perguntas de Acompanhamento):**
            QUANDO o usuário fizer uma pergunta sobre a arquitetura recomendada (ex: "Por que usar OKE e não Functions?", "E sobre o custo?"), você DEVE responder em prosa normal.
            * **Sobre Custos:** NUNCA invente preços. Se perguntado sobre custos, responda: "A estimativa de custos depende do consumo exato de cada serviço. Você pode usar o 'Oracle Cloud Price List' (https://www.oracle.com/cloud/price-list/) e o 'Cost Estimator' oficial para detalhar seu cenário."
            * **Sobre Detalhes:** Responda à pergunta técnica com sua persona de arquiteto. Ao final, pergunte se ele gostaria de explorar os detalhes da arquitetura no link ou se prefere analisar um novo desafio.

        3.  **Regras de Segurança e Tópico:**
            * **Sempre educado:** Você NUNCA deve usar palavrões, xingamentos ou linguagem ofensiva.
            * **Recusa educada:** Se o usuário perguntar sobre arquiteturas de concorrentes (AWS, Azure), redirecione educadamente: "Meu foco é garantir a melhor solução usando os serviços da Oracle Cloud. A arquitetura que recomendei foi projetada para ter a melhor performance e custo-benefício dentro do ecossistema OCI."
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
        bot_config = bot_configs[bot_id]
        
        try:
            print(f"=== PROCESSANDO MENSAGEM ===")
            print(f"Bot: {bot_id}")
            print(f"Mensagem: {user_message}")
            
            # Por enquanto, vamos usar respostas pré-definidas baseadas no bot
            if bot_id == 'querryarc':
                # QuerryArc - Arquiteto técnico
                if 'microsserviços' in user_message.lower() or 'microserviços' in user_message.lower():
                    bot_response = """Nome do Serviço: Oracle Container Engine for Kubernetes (OKE)
Categoria: Compute/Container
Justificativa Técnica: OKE oferece orquestração nativa de microsserviços com Kubernetes gerenciado, permitindo escalabilidade automática e alta disponibilidade para arquiteturas modernas de e-commerce. Suporta auto-scaling horizontal e vertical, service discovery automático e load balancing nativo.
Aspectos de Implementação: 
- Configure clusters OKE com auto-scaling para lidar com picos de Black Friday, definindo métricas de CPU/memória
- Implemente service mesh com Istio para comunicação segura entre microsserviços, incluindo circuit breakers e retry policies
- Use Oracle Autonomous Database como backend para persistência de dados escalável, com connection pooling otimizado"""
                elif 'banco' in user_message.lower() or 'database' in user_message.lower():
                    bot_response = """Nome do Serviço: Oracle Autonomous Database
Categoria: Database
Justificativa Técnica: Banco de dados autogerenciado com machine learning integrado, oferece escalabilidade automática, patches sem downtime e otimização de performance por IA. Ideal para cargas de trabalho críticas de e-commerce com variações de demanda.
Aspectos de Implementação:
- Configure auto-scaling baseado em CPU e IO para lidar com picos de transações
- Implemente sharding automático para distribuição de dados em múltiplas instâncias
- Use Oracle Data Guard para replicação automática e disaster recovery com RTO próximo de zero"""
                else:
                    bot_response = """Nome do Serviço: Oracle Cloud Infrastructure (OCI) Full Stack
Categoria: Infrastructure
Justificativa Técnica: Plataforma completa com compute, storage, networking e database integrados, oferecendo performance superior e custos otimizados para aplicações enterprise de grande escala.
Aspectos de Implementação:
- Design de arquitetura multi-tier com separação de responsabilidades
- Implementação de Load Balancers com SSL termination e health checks
- Configuração de VCN (Virtual Cloud Network) com security lists e route tables otimizadas"""
            else:
                # QuerryBot - Vendas
                if 'e-commerce' in user_message.lower() or 'loja' in user_message.lower():
                    bot_response = """Nome do Serviço: Oracle Autonomous Database
Categoria: Database
Justificativa Técnica: Banco de dados autogerenciado com IA integrada, perfeito para e-commerce por oferecer escalabilidade automática durante picos de vendas, performance consistente e segurança enterprise-grade para dados de clientes e transações.
Argumentos de Venda:
- ROI de 417% comprovado em 3 anos com redução de 90% nos custos operacionais de DBA
- Performance até 10x superior comparado a outros cloud databases, garantindo experiência de compra fluida
- Zero downtime para patches e upgrades, mantendo sua loja sempre disponível mesmo durante Black Friday"""
                elif 'microsserviços' in user_message.lower() or 'microserviços' in user_message.lower():
                    bot_response = """Nome do Serviço: Oracle Container Engine for Kubernetes (OKE)
Categoria: Compute/Container
Justificativa Técnica: Plataforma Kubernetes gerenciada que elimina a complexidade de gerenciar infraestrutura de containers, permitindo foco total no desenvolvimento de aplicações e time-to-market mais rápido.
Argumentos de Venda:
- Redução de 60% no tempo de deployment com CI/CD integrado e automação completa
- Economia de 40% em custos de infraestrutura com auto-scaling inteligente baseado em demanda real
- SLA de 99.95% de uptime com disaster recovery automático em múltiplas availability domains"""
                else:
                    bot_response = """Nome do Serviço: Oracle Cloud Infrastructure (OCI)
Categoria: Infrastructure
Justificativa Técnica: Plataforma de nuvem de segunda geração com performance superior e preços até 50% menores que concorrentes, ideal para empresas que buscam modernização com controle de custos.
Argumentos de Venda:
- Performance 2x superior ao AWS com latência 10x menor para aplicações críticas
- Economia média de 50% nos custos de nuvem comparado a outros providers
- Migração gratuita com suporte especializado Oracle e ferramentas automatizadas"""
            
            print(f"Resposta gerada: {bot_response[:100]}...")
                
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
