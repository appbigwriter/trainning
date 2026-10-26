# Revisão dos cursos de projetos — 26/10/2026

Cobertura: catálogo e cinco novos cursos (`dim`, `authority-engine`, `audience-builder`, `agency-flux`, `social-engine`), com 90 páginas novas e recursos compartilhados. Cursos anteriores foram preservados, inclusive alterações locais já existentes do Google Flow. Revisão local; nenhum deploy foi executado.

## Validação funcional

- `python scripts/check_site.py`: 189 páginas HTML e seus links internos verificados, incluindo contagem de aulas/materiais, títulos únicos, descrições, manifests e cores diferentes.
- HTTP local: os 100 arquivos dos novos cursos responderam com status 200.
- `node --check assets/project-course.js`: sintaxe aprovada.
- Navegador: primeira aula do DIM, feedback correto, marcação de conclusão, persistência da anotação no caderno e avaliação final com quatro respostas corretas verificadas. A anotação de teste foi apagada.
- Armazenamento separado por curso em `fbr-training:<slug>:v1`; exportação JSON e impressão implementadas. Download e impressão não foram confirmados manualmente.
- Layout responsivo implementado em CSS. Conferência visual em viewport móvel ainda não executada.
- Dockerfile, allowlists e verificação HTTP do CI incluem os novos cursos. Build local de contêiner não executado: daemon Docker indisponível.

## Checklist sitebasics

| Página ou escopo | Requisito | Estado | Evidência ou ação necessária |
| --- | --- | --- | --- |
| Novos cursos | Títulos e meta descriptions | OK | Específicos por aula e material; validados pelo checker. |
| Novos cursos e catálogo | Links internos | OK | Checker e respostas HTTP locais; navegação real no DIM. |
| Novos cursos | Breadcrumbs | OK | Catálogo → curso → aula/material presentes em cada página. |
| Novos cursos | CTA acima da dobra | OK | Início do curso tem acesso direto à primeira aula e continuação do estudo; implementação local. |
| Novos cursos | CTA fixo no celular | Não se aplica | Páginas de estudo sem formulário de aquisição; navegação do curso permanece sticky. |
| Novos cursos | Cinco perguntas frequentes | OK | Cinco respostas específicas ao funcionamento do treinamento em cada início de curso. |
| Novos cursos | Alt text | Não se aplica | Nenhuma imagem informativa adicionada. |
| Novos cursos | Página de obrigado e prazo de resposta | Não se aplica | Não há conversão, inscrição, formulário enviado ou atendimento adicionado. |
| Site inteiro | 404 personalizada | Pendente | Nginx existente retorna 404; uma página personalizada continua ausente, fora da criação dos cursos. |
| Site inteiro | robots.txt | Pendente | Arquivo não existe; política de indexação deve ser definida em trabalho próprio do portal. |
| Site inteiro | Privacidade e termos de uso | Pendente | Páginas institucionais ausentes; exigem dados e validação do responsável. O funcionamento do armazenamento local está explicado nos cursos. |
| Site inteiro | Sobre nós e contato | Pendente | Dados institucionais e canal de contato não foram fornecidos; nenhuma informação foi inventada. |
| Site inteiro | Google Analytics | Pendente | Sem identificador fornecido; nenhuma coleta de analytics adicionada. |
| Novos cursos | Imagem de compartilhamento | Pendente | Não há imagem oficial nem URL publicada validada para os novos cursos. |
| Site inteiro | Favicon | Pendente | Não havia ícone personalizado referenciado; identidade institucional pode ser tratada à parte. |
| Novos cursos | Cases e avaliações reais | Não se aplica | Cursos explicativos; exemplos identificados como fictícios, sem alegações de resultados ou depoimentos. |
| Site inteiro | Mapa e schema local | Não se aplica | Escopo é portal de aprendizado online; nenhum atendimento presencial informado ou implementado. |
| Site inteiro | Foto real do time | Pendente | Foto autêntica e autorização não fornecidas; não foi inventada equipe. |
| Produção | URLs, 404 e contêiner publicados | Não verificado | Sem deploy nesta rodada e daemon local indisponível; CI configurado para conferir o contêiner. |

Correções feitas no escopo: cinco trilhas, paletas, catálogo, navegação, metadados, acessibilidade básica dos controles, exercícios, feedback, progresso, caderno e integração ao empacotamento. As pendências institucionais acima são registradas para o portal e não impedem leitura e estudo local dos novos cursos.
