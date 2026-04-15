# 🌌 VLTTECH - Astrophotography App

O sistema de Automação de Astrofotografia do observatório VLTTECH construído em base React + FastAPI.

## Infraestrutura (DevOps)
Para executar a aplicação e montar suas pastas no Linux Debian, garanta que o Docker e o `docker-compose` estão instalados.

1. Navegue até a raiz do projeto (mesmo local deste README file e do `docker-compose.yml`).
2. Digite:
```bash
docker-compose up -d --build
```
3. O sistema fará a build automática da aplicação Node (Frontend) e Python (Backend).
4. **Como acessar de outro PC:** Como o Docker mapeia a porta `80` para `0.0.0.0`, basta ir no seu PC Windows/Mac ou Tablet, abrir o navegador e digitar o **IP Real da máquina Debian** na rede (Sem precisar de porta). Exemplo: `http://192.168.1.50`

### Acesso ao Samba (Sessões Salvas)
- As fotos capturadas serão expostas na pasta `/var/opt/vlttech/sessions`.
- Você poderá acessá-las nativamente por qualquer PC da mesma rede mapeando o IP do servidor: `\\SEU_IP_DEBIAN\AstroPhotos`.

Dúvidas e suporte interno: Consulter `agents.md` e o Walkthrough gerado na IDE Gemini para a arquitetura.
