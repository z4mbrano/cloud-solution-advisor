import streamlit as st
import streamlit.components.v1 as components
import google.generativeai as genai
import os
from pathlib import Path
import html

# --- TÍTULO DA APLICAÇÃO ---
# Configurar caminhos de assets
assets_path = os.path.join(os.path.dirname(__file__), "assets")
img_path = os.path.join(assets_path, "img")
logo_path = os.path.join(img_path, "logo_oracle_aside.png")
favicon_path = os.path.join(assets_path, "favicon-oracle.ico")

st.set_page_config(
    page_title="Oracle Cloud Solution Advisor",
    page_icon=favicon_path,
    layout="wide"
)

# --- SIDEBAR (HISTÓRICO) ---
with st.sidebar:
    # Carrega a logo usando st.image
    st.image(logo_path, use_container_width=True)
    
    # Conteúdo do histórico
    st.markdown("""
        <div class="history-sidebar">
            <div class="sidebar-header">
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
stream    """, unsafe_allow_html=True)

# --- Carrega CSS local ---
try:
    css_path = Path(__file__).parent / "style.css"
    if css_path.exists():
        with open(css_path, 'r', encoding='utf-8') as f:
            css = f.read()
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
except Exception:
    pass

# --- 1. CONFIGURAÇÃO ---
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', st.secrets["GOOGLE_API_KEY"])
    genai.configure(api_key=GOOGLE_API_KEY)
except (ValueError, KeyError) as e:
    st.error("Chave de API do Google não configurada. Por favor, configure a variável de ambiente GOOGLE_API_KEY.")
    st.stop()

# --- Estado do Chat ---
if 'chat_active' not in st.session_state:
    st.session_state.chat_active = False
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'current_input' not in st.session_state:
    st.session_state.current_input = ""

# --- CONTEÚDO PRINCIPAL ---
st.markdown("""
    <div class="chat-container">
        <div class="chat-main">
            <h1>☁️ Oracle Cloud Solution Advisor</h1>
            <div class="subheader">Análise de Necessidades com IA</div>
        </div>
    </div>
""", unsafe_allow_html=True)

# --- INTERFACE DO USUÁRIO ---
# Container para as mensagens do chat
with st.container():
    # Exibir histórico de mensagens
    for idx, msg in enumerate(st.session_state.messages):
        if msg['sender'] == 'user':
            st.markdown(f"""
                <div class="message user-message">
                    <div class="message-content">{html.escape(msg['text'])}</div>
                </div>
            """, unsafe_allow_html=True)
        else:  # bot
            # Formatar a resposta do bot
            def format_ai_text(txt):
                import re
                esc = html.escape(txt)
                lines = esc.splitlines()
                out_parts = []
                in_code = False
                code_acc = []

                # First pass: handle ``` code fences and keep other lines
                for line in lines:
                    if line.strip().startswith('```'):
                        if not in_code:
                            in_code = True
                            code_acc = []
                        else:
                            # close code block
                            out_parts.append('<pre><code>{}</code></pre>'.format("\n".join(code_acc)))
                            in_code = False
                        continue
                    if in_code:
                        code_acc.append(line)
                    else:
                        out_parts.append(line)

                # If code block wasn't closed, flush it
                if in_code and code_acc:
                    out_parts.append('<pre><code>{}</code></pre>'.format("\n".join(code_acc)))

                # Second pass: convert lists and paragraphs
                html_chunks = []
                ul_open = False
                ol_open = False
                for part in out_parts:
                    if part.startswith('<pre>'):
                        # close lists if open
                        if ul_open:
                            html_chunks.append('</ul>')
                            ul_open = False
                        if ol_open:
                            html_chunks.append('</ol>')
                            ol_open = False
                        html_chunks.append(part)
                        continue

                    # unordered list
                    m = re.match(r'^\s*[-\*]\s+(.*)', part)
                    # ordered list
                    m2 = re.match(r'^\s*(\d+)\.\s+(.*)', part)

                    if m:
                        if not ul_open:
                            html_chunks.append('<ul>')
                            ul_open = True
                        html_chunks.append(f"<li>{m.group(1)}</li>")
                    elif m2:
                        if not ol_open:
                            html_chunks.append('<ol>')
                            ol_open = True
                        html_chunks.append(f"<li>{m2.group(2)}</li>")
                    elif part.strip() == '':
                        # blank line -> paragraph break
                        if ul_open:
                            html_chunks.append('</ul>')
                            ul_open = False
                        if ol_open:
                            html_chunks.append('</ol>')
                            ol_open = False
                        html_chunks.append('<br/>')
                    else:
                        html_chunks.append(f"<p>{part}</p>")

                if ul_open:
                    html_chunks.append('</ul>')
                if ol_open:
                    html_chunks.append('</ol>')

                return '\n'.join(html_chunks)
            
            formatted_html = format_ai_text(msg['text'])
            
            template = f'''
            <div class="response-area message bot-message" style="background-color: #40414F; color: #ECECEC; font-family: Inter, Roboto, Arial; border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 1rem 0; position: relative;">
                <button class="copy-button copy-btn-{idx}" aria-label="Copiar resposta" title="Copiar resposta" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #8E8E8E; cursor: pointer; padding: 5px;">
                    <svg class="copy-icon-{idx}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width: 20px; height: 20px;">
                        <rect x="9" y="9" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"></rect>
                        <rect x="6" y="6" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"></rect>
                    </svg>
                </button>
                <div class="copy-feedback copy-feedback-{idx}" role="status" aria-live="polite" style="display: none; position: absolute; top: 10px; right: 45px; background: #343541; color: #ECECEC; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Copiado!</div>
                <div class="response-content response-content-{idx}" style="color: #ECECEC; white-space: pre-wrap; word-break: break-word;">{formatted_html}</div>
            </div>
            <script>
            (function(){{
                var btn = document.querySelector('.copy-btn-{idx}');
                var icon = document.querySelector('.copy-icon-{idx}');
                var content = document.querySelector('.response-content-{idx}');
                var feedback = document.querySelector('.copy-feedback-{idx}');
                if(btn && icon && content && feedback){{
                    var originalIcon = icon.outerHTML;
                    btn.addEventListener('click', function(){{
                        var txt = content.innerText || content.textContent || '';
                        navigator.clipboard.writeText(txt).then(function(){{
                            feedback.style.display = 'block';
                            icon.outerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                            setTimeout(function(){{
                                feedback.style.display = 'none';
                                var el = btn.querySelector('svg');
                                if(el) el.outerHTML = originalIcon;
                            }}, 1600);
                        }}).catch(function(){{
                            alert('Falha ao copiar');
                        }});
                    }});
                }}
            }})();
            </script>
            '''
            components.html(template, height=400, scrolling=True)

# Área de input fixa na parte inferior
input_area_class = "input-area fixed-bottom" if st.session_state.chat_active else "input-area"

# Usar form do Streamlit para capturar o input
with st.form(key="chat_form", clear_on_submit=True):
    col1, col2 = st.columns([9, 1])
    
    with col1:
        prompt_do_usuario = st.text_area(
            "Prompt",
            key="prompt_input",
            label_visibility="collapsed",
            placeholder="Descreva o desafio do seu cliente...",
            height=100
        )
    
    with col2:
        st.write("")  # Espaçamento
        submit_button = st.form_submit_button("▶", use_container_width=True)

# Processar o envio
if submit_button and prompt_do_usuario and prompt_do_usuario.strip():
    if not prompt_do_usuario or not prompt_do_usuario.strip():
        st.warning("Por favor, insira a descrição do problema do cliente.")
    else:
        # Ativar o modo chat e adicionar mensagem do usuário
        st.session_state.chat_active = True
        st.session_state.messages.append({
            'id': len(st.session_state.messages),
            'text': prompt_do_usuario,
            'sender': 'user'
        })
        
        with st.spinner("A IA está analisando a necessidade e montando a solução..."):
            model_name = 'gemini-2.5-flash'
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
            prompt_final = f"{instrucoes_para_ia}\n\nA necessidade do cliente é a seguinte:\n'{prompt_do_usuario}'"
            
            try:
                response = model.generate_content(prompt_final)
                
                # Adicionar resposta do bot ao histórico
                if hasattr(response, 'text') and response.text:
                    st.session_state.messages.append({
                        'id': len(st.session_state.messages),
                        'text': response.text.strip(),
                        'sender': 'bot'
                    })
                
                # Rerun para atualizar a interface
                st.rerun()

            except Exception as e:
                st.error(f"Ocorreu um erro ao contatar a API de IA: {e}")