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

## Dados de estudo

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
