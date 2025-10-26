from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Configurar Google AI
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        print("AVISO: GOOGLE_API_KEY não configurada")
    else:
        genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    print(f"Erro ao configurar API: {e}")

# Armazenar histórico em memória (em produção, use banco de dados)
chat_history = []

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Mensagem vazia'}), 400
        
        # Adicionar mensagem do usuário ao histórico
        chat_history.append({
            'id': len(chat_history),
            'text': user_message,
            'sender': 'user'
        })
        
        # Gerar resposta com IA
        model_name = 'gemini-2.0-flash-exp'
        model = genai.GenerativeModel(model_name)
        
        instrucoes_para_ia = """
        Você é um especialista em soluções Oracle Cloud altamente qualificado. Sua tarefa é analisar a necessidade de um cliente e recomendar UM serviço principal da Oracle que seja o coração da solução.
        Mesmo que o cliente mencione uma nuvem concorrente (como AWS, Azure, GCP), sua recomendação deve ser focada 100% em soluções Oracle Cloud, destacando os diferenciais e vantagens competitivas da Oracle.

        Sua resposta DEVE SEGUIR ESTRITAMENTE O SEGUINTE FORMATO, sem adicionar nenhuma outra palavra ou formatação:

        Nome do Serviço: [Nome do serviço Oracle]
        Categoria: [Ex: Database, Compute, Storage, AI/ML]
        Justificativa Técnica: [Explicação curta e direta de por que este serviço é ideal, focando nos pontos-chave da necessidade do cliente]
        Argumentos de Venda: [OBRIGATÓRIO: Forneça de 2 a 3 pontos principais, em formato de lista, que um vendedor usaria para destacar o valor e os benefícios de negócio desta solução.]
        """
        
        prompt_final = f"{instrucoes_para_ia}\n\nA necessidade do cliente é a seguinte:\n'{user_message}'"
        
        response = model.generate_content(prompt_final)
        bot_response = response.text.strip()
        
        # Adicionar resposta ao histórico
        chat_history.append({
            'id': len(chat_history),
            'text': bot_response,
            'sender': 'bot'
        })
        
        return jsonify({
            'message': bot_response,
            'history': chat_history
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(chat_history)

@app.route('/api/clear', methods=['POST'])
def clear_history():
    chat_history.clear()
    return jsonify({'message': 'Histórico limpo'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
