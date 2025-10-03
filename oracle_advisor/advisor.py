import streamlit as st
import google.generativeai as genai
import os
from pathlib import Path

# --- TÍTULO DA APLICAÇÃO ---
st.set_page_config(page_title="Oracle Cloud Solution Advisor", page_icon="☁️", layout="wide")

# --- SIDEBAR (HISTÓRICO) ---
with st.sidebar:
    st.markdown("""
        <div class="history-sidebar">
            <div class="sidebar-header">
                                <img src="assets/img/logo_oracle_aside.png" alt="Oracle Logo" class="oracle-logo">
                <h2>Histórico de Análises</h2>
            </div>
            <ul class="history-list">
                <li class="active" title="Análise de Banco de Dados para Sistema de E-commerce com Alta Demanda">Análise de Banco de Dados para Sistema de E-commerce com Alta Demanda</li>
                <li title="Solução de Storage para Arquivamento de Dados Históricos">Solução de Storage para Arquivamento de Dados Históricos</li>
                <li title="Compute Cloud para Processamento de Machine Learning">Compute Cloud para Processamento de Machine Learning</li>
                <li title="Migração de Ambiente On-Premise para OCI">Migração de Ambiente On-Premise para OCI</li>
                <li title="Análise de Custos para Ambiente de Desenvolvimento">Análise de Custos para Ambiente de Desenvolvimento</li>
                <li title="Configuração de Alta Disponibilidade para Aplicação Crítica">Configuração de Alta Disponibilidade para Aplicação Crítica</li>
                <li title="Otimização de Performance para Banco de Dados">Otimização de Performance para Banco de Dados</li>
                <li title="Arquitetura de Microsserviços na OCI">Arquitetura de Microsserviços na OCI</li>
            </ul>
        </div>
    """, unsafe_allow_html=True)

# --- CONTEÚDO PRINCIPAL ---
st.markdown("""
    <div class="chat-container">
        <div class="chat-main">
            <h1>☁️ Oracle Cloud Solution Advisor</h1>
            <div class="subheader">Análise de Necessidades com IA</div>
        </div>
    </div>
""", unsafe_allow_html=True)

# --- Carrega CSS local (opcional) ---
try:
    css_path = Path(__file__).parent / "style.css"
    if css_path.exists():
        with open(css_path, 'r', encoding='utf-8') as f:
            css = f.read()
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
    else:
        # If not present, continue without failing.
        pass
except Exception:
    # Be resilient: don't crash the app if styling fails to load.
    pass


# --- 1. CONFIGURAÇÃO ---
# Mudar API KEY para uma variavel!
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', st.secrets["GOOGLE_API_KEY"])
    genai.configure(api_key=GOOGLE_API_KEY)
except (ValueError, KeyError) as e:
    st.error("Chave de API do Google não configurada. Por favor, configure a variável de ambiente GOOGLE_API_KEY.")
    st.stop()

# --- INTERFACE DO USUÁRIO ---
st.subheader("Descreva o desafio do seu cliente:")
prompt_do_usuario = st.text_area(
    "Insira aqui a descrição do problema, requisitos técnicos e objetivos de negócio.",
    height=150,
    placeholder="Ex: O cliente precisa de um banco de dados autogerenciado para o novo sistema de marketing..."
)

# Botão para iniciar a análise
if st.button("Analisar Solução", type="primary"):
    if not prompt_do_usuario:
        st.warning("Por favor, insira a descrição do problema do cliente.")
    else:
        # --- LÓGICA DA IA (só roda quando o botão é clicado) ---
        with st.spinner("A IA está analisando a necessidade e montando a solução..."):
            # Configuração do modelo generativo
            model_name = 'gemini-2.5-flash'
            model = genai.GenerativeModel(model_name)

            # O prompt de instruções continua o mesmo
            instrucoes_para_ia = """
            Você é um especialista em soluções Oracle Cloud altamente qualificado. Sua tarefa é analisar a necessidade de um cliente e recomendar UM serviço principal da Oracle que seja o coração da solução.
            Mesmo que o cliente mencione uma nuvem concorrente (como AWS, Azure, GCP), sua recomendação deve ser focada 100% em soluções Oracle Cloud, destacando os diferenciais e vantagens competitivas da Oracle.

            Sua resposta DEVE SEGUIR ESTRITAMENTE O SEGUINTE FORMATO, sem adicionar nenhuma outra palavra ou formatação:

            Nome do Serviço: [Nome do serviço Oracle]
            Categoria: [Ex: Database, Compute, Storage, AI/ML]
            Justificativa Técnica: [Explicação curta e direta de por que este serviço é ideal, focando nos pontos-chave da necessidade do cliente]
            Argumentos de Venda: [OBRIGATÓRIO: Forneça 2 pontos principais, em formato de lista, que um vendedor usaria para destacar o valor e os benefícios de negócio desta solução.]
            """
            prompt_final = f"{instrucoes_para_ia}\n\nA necessidade do cliente é a seguinte:\n'{prompt_do_usuario}'"
            
            try:
                response = model.generate_content(prompt_final)
                
                # --- EXIBIÇÃO DO RESULTADO ---
                st.divider()
                st.subheader("✅ Solução Recomendada")

                # DEBUG: Exibe a resposta bruta para ajudar no desenvolvimento
                st.write("🕵️‍♂️ Resposta Bruta da IA (para debug):")
                st.text(response.text)

                # --- PARSER INTELIGENTE PARA MÚLTIPLAS LINHAS ---
                solucao = {}
                current_key = None
                linhas_resposta = response.text.strip().split('\n')

                for linha in linhas_resposta:
                    # Verifica se a linha define uma nova chave
                    if ':' in linha:
                        chave, valor = linha.split(':', 1)
                        current_key = chave.strip()
                        solucao[current_key] = valor.strip()
                    # Se não for uma nova chave, é a continuação da anterior
                    elif current_key and linha.strip(): 
                        solucao[current_key] += '\n' + linha.strip()

                # --- EXIBIÇÃO FORMATADA ---
                if 'Nome do Serviço' in solucao and 'Categoria' in solucao:
                    st.subheader(f"{solucao.get('Nome do Serviço', 'N/A')} ({solucao.get('Categoria', 'N/A')})")

                if 'Justificativa Técnica' in solucao and solucao['Justificativa Técnica'].strip():
                    st.info(f"**Justificativa Técnica:** {solucao['Justificativa Técnica']}")

                if 'Argumentos de Venda' in solucao and solucao['Argumentos de Venda'].strip():
                    st.success(f"**Argumentos de Venda:**\n{solucao['Argumentos de Venda']}")

            except Exception as e:
                st.error(f"Ocorreu um erro ao contatar a API de IA: {e}")