# FBR Training

Portal de cursos estáticos para `trainning.fbr.news`.

- `/`: catálogo dos cursos.
- `/amazon/`: curso Amazon — EUA e Canadá, 30 aulas e quatro trilhas.
- `/amazon/associates.html`, `/amazon/custom.html`, `/amazon/ads.html`: trilhas específicas.
- `/redes-sociais/`: Como crescer suas redes sociais — 18 aulas, 6 módulos e 8 materiais de apoio, em tons de azul.

## Deploy

Use o **Dockerfile na raiz**, com Build Path `/` e porta interna **80** no Easypanel. Consulte [DEPLOY.md](DEPLOY.md) para DNS, domínio, HTTPS e atualização.

## Desenvolvimento local

```sh
python -m http.server 8767 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8767/` e `http://127.0.0.1:8767/amazon/`.
O novo curso está em `http://127.0.0.1:8767/redes-sociais/`.

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
