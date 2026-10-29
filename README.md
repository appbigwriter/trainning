# FBR Training

Portal de cursos estáticos para `trainning.fbr.news`.

- `/`: catálogo dos cursos.
- `/amazon/`: curso Amazon — EUA e Canadá, 30 aulas e quatro trilhas.
- `/amazon/associates.html`, `/amazon/custom.html`, `/amazon/ads.html`: trilhas específicas.
- `/redes-sociais/`: Como crescer suas redes sociais — 18 aulas, 6 módulos e 8 materiais de apoio, em tons de azul.
- `/google-flow/`: Como usar o Google Flow para produzir videos longos ( 1, 3 e 5 minutos) — 18 aulas, 6 módulos e 8 materiais de apoio, em tons de laranja.

## Deploy

Use o **Dockerfile na raiz**, com Build Path `/` e porta interna **80** no Easypanel. Consulte [DEPLOY.md](DEPLOY.md) para DNS, domínio, HTTPS e atualização.

## Desenvolvimento local

```sh
python -m http.server 8767 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8767/` e `http://127.0.0.1:8767/amazon/`.
O novo curso está em `http://127.0.0.1:8767/redes-sociais/`.
O curso Google Flow está em `http://127.0.0.1:8767/google-flow/`. Gere suas páginas com `python scripts/build_flow_course.py`. O gerador reutiliza os componentes CSS de redes sociais com paleta laranja; preserva o JavaScript próprio de Google Flow. Inclui progresso, exercícios, avaliação, caderno exportável e planejador de duração/créditos. As práticas produzem arquivos de 60, 180 e 300 segundos; o curso escrito não inclui videoaulas ou clipes prontos.

O conteúdo das páginas de redes sociais é gerado por `python scripts/build_social_course.py`; CSS e JavaScript ficam em `redes-sociais/assets/`. A geração preserva esses recursos. Notas pedagógicas locais seguem a skill `teach` do Matt Pocock; registros de aprendizado só devem ser criados após demonstração do estudante.

```sh
python scripts/check_site.py
```

## Novos cursos

1. Crie uma pasta na raiz, por exemplo `marketing/`, com `index.html` e recursos relativos.
2. Libere apenas os arquivos públicos desse curso em `.gitignore` e `.dockerignore`, seguindo o modelo `amazon/`.
3. Adicione `COPY marketing/ /usr/share/nginx/html/marketing/` ao Dockerfile.
4. Acrescente um cartão no `index.html` do portal e valide os links antes do push.

Não é necessário criar um novo domínio ou serviço para cada curso; cada pasta ganha uma URL própria.

## Curso Habblaud

- `/habblaud/`: **Habblaud — Seu escritório de agentes**, identidade ciano escura `#0e6478`, distinta das demais paletas.
- 18 aulas em 6 módulos, práticas, roteiros de instalação, perguntas de revisão, avaliação de 6 questões, checklist, glossário, fontes oficiais e caderno exportável.
- Conteúdo editável em `scripts/habblaud_course.py`, gerado com `python scripts/build_project_courses.py`. Documentação consultada em 28/10/2026; recursos e comandos dependem da versão e plataforma.
- Cobre Claude Code e Codex, novas sessões, subagentes, encerramento, permissões, mensagens, uso, privacidade, World, manutenção e diagnóstico. O portal não instala Habblaud nem controla agentes; as práticas são executadas no ambiente do estudante.
- Teste funcional: com Playwright disponível, execute `node scripts/check_habblaud.cjs` contra o site em `http://127.0.0.1:18767` (ou defina `TRAINING_URL`). O teste usa armazenamento temporário próprio e verifica aulas, persistência, avaliação, exportação, responsividade e isolamento entre cursos.

## Armazenamento das respostas

Respostas e progresso são armazenados no navegador. Não há banco, login nem sincronização automática. O domínio de produção usa outro armazenamento em relação ao localhost; exporte respostas pelo caderno para guardar uma cópia.

Notas de autoria, registros de aprendizado, prévias, arquivos ZIP e vídeos locais não fazem parte do site publicado. Conteúdo estático é público; este projeto não implementa restrição de acesso a aulas.

## Cursos dos projetos FBR

Foram adicionados os cinco projetos listados na solicitação (26/10/2026). Cada curso tem 12 aulas, 4 módulos, 5 materiais de apoio, progresso próprio, exercícios e exportação do caderno.

- `/dim/`: **DIM — Digital Influencer Management**, cor `#6d28a8`. Gerencie identidades, canais, conteúdo aprovado, conversas e resultados com rastreabilidade.
- `/authority-engine/`: **Authority Engine**, cor `#922343`. Transforme pesquisa de nicho em opções de autoridade comparáveis, personas e planos editoriais.
- `/audience-builder/`: **Audience Builder**, cor `#806000`. Transforme personas aprovadas em projetos editoriais, blogs, conteúdo e planos de audiência.
- `/agency-flux/`: **Agency Flux**, cor `#475569`. Conduza projetos com briefing enxuto, backlog acionável, artefatos reais e validação local.
- `/social-engine/`: **Social Engine**, cor `#a21c83`. Vá da fonte ao carrossel editável, revisão, calendário e análise por influenciador.

Gere as páginas com `python scripts/build_project_courses.py`. O conteúdo editável está em `scripts/project_courses.py`; CSS e JavaScript compartilhados estão em `assets/project-course.*`, com tema próprio em cada pasta. A geração não altera o catálogo. Os exemplos são fictícios; documentos internos, credenciais e dados operacionais não são publicados. Consulte Fontes e limites em cada curso.

## Curso LaserGRBL

- `/lasergrbl/`: **LaserGRBL — Da arte à gravação e ao corte**, 30 aulas em 10 módulos, três projetos, avaliação de 10 questões, progresso, caderno exportável e cinco arquivos de laboratório.
- Conteúdo em `scripts/lasergrbl_course.py`; gerar aulas e materiais com `python scripts/build_lasergrbl_course.py`. O gerador geral também regenera as aulas, preservando os materiais.
- Rotas de criação com Inkscape, GIMP, Canva, Illustrator, CorelDRAW, Photoshop e CAD, com limites de SVG e conversões explícitas. Não promete suporte direto a DXF/PDF nem configurações universais de queima.
- Artes SVG e PNG, ficha CSV e roteiro TXT em `lasergrbl/downloads/`. Nenhum arquivo contém G-code ou parâmetros prontos de emissão.
- Curso escrito; não inclui videoaulas, certificação de segurança ou controle de equipamento pelo portal. Prática física depende de máquina e material homologados e treinamento do fabricante. Base documental: 29/10/2026.
- Verificações: `python scripts/check_site.py` e `node scripts/check_lasergrbl.cjs` (Playwright; `TRAINING_URL` indica o servidor local).
