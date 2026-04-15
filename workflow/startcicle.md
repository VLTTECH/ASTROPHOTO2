# 🔄 VLTTECH - WORKFLOW OPERACIONAL (STARTCICLE)

Este documento define o ciclo de vida de desenvolvimento (SDLC) para qualquer aplicação solicitada à equipe de elite. O fluxo é sequencial e cada etapa possui dependências obrigatórias.

---

## FASE 1: CONCEPÇÃO E REQUISITOS (PRODUCT OWNER)
**Gatilho:** usuário digita '/startcicle <ideia>' e envia a solicitação inicial.
- **Ação:** O PO analisa a ideia bruta e cria o "Backlog do Projeto".
- **Entregáveis:** - Lista de User Stories com Critérios de Aceitação.
    - Definição de MVP (Minimum Viable Product).
- **Critério de Saída:** O usuário aprova os requisitos detalhados.

## FASE 2: ARQUITETURA E CONTRATOS (ARQUITETO)
**Dependência:** Requisitos aprovados pelo PO.
- **Ação:** O Arquiteto desenha a topologia de microsserviços e o modelo de dados.
- **Entregáveis:** - Estrutura de pastas do projeto.
    - Esquema do banco de dados (ERD).
    - Definição das rotas de API (Documentação OpenAPI/Swagger teórica).
- **Critério de Saída:** Estrutura técnica validada para escalabilidade e extensibilidade.

## FASE 3: IMPLEMENTAÇÃO TÉCNICA (DEVELOPER FULLSTACK)
**Dependência:** Desenho arquitetural e contratos de API.
- **Ação:** Codificação do Backend (FastAPI) e Frontend (React).
- **Entregáveis:** - Código fonte completo seguindo Clean Code e PEP8.
    - Interface moderna com Glassmorphism e animações Framer Motion.
    - Documentação interna (Docstrings e README.md por módulo).
- **Critério de Saída:** Código funcional, tipado e com UI moderna conforme o Knowledge Base.

## FASE 4: INFRAESTRUTURA E ORQUESTRAÇÃO (DEVOPS)
**Dependência:** Código fonte disponível.
- **Ação:** Containerização da aplicação e configuração de ambiente.
- **Entregáveis:** - Dockerfiles otimizados e `docker-compose.yml`.
    - Configuração de redes internas e volumes persistentes.
    - Setup de Logs centralizados em JSON.
- **Critério de Saída:** Aplicação rodando localmente/servidor via `docker-compose up`.

## FASE 5: AUDITORIA E VALIDAÇÃO (QA & SECURITY)
**Dependência:** Ambiente Docker ativo.
- **Ação:** Testes de segurança, performance e lógica.
- **Entregáveis:** - Relatório de vulnerabilidades (OWASP).
    - Validação de UX (Animações, Responsividade e Erros).
    - Check de logs e tratamento de exceções.
- **Critério de Saída:** Aprovação final "Green Light" para entrega ao usuário.

---

# 🚀 INSTRUÇÕES DE EXECUÇÃO (PARA OS AGENTES)

1. **Passagem de Bastão:** Cada agente deve finalizar sua resposta indicando qual é o próximo agente na sequência e o que ele deve receber.
2. **Referência Cruzada:** Os agentes devem citar o arquivo `agents.md` para validar suas funções e o `VLTTECH_Knowledge_Base.md` para garantir os padrões técnicos.
3. **Documentação Paralela:** Manuais de implementação e manutenção devem ser criados *durante* a fase de desenvolvimento, não após o término.