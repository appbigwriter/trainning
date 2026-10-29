# Revisão do curso Habblaud — 28/10/2026

## Entrega e cobertura

Curso autoral no formato do portal: 18 aulas em seis módulos, 18 perguntas de revisão,
seis questões na avaliação, dez itens de checklist, glossário com 14 termos, fontes
oficiais e caderno exportável. Paleta ciano escura `#0e6478`, distinta das oito
paletas anteriores, com fundo `#edfafd` (contraste aproximado 6,7:1 com branco).

Fontes públicas estão ligadas em `habblaud/reference/fontes.html`. Os exemplos
são fictícios. A consulta documental não representa homologação de uma instalação
real do Habblaud no computador do estudante.

## Verificação técnica

- `python scripts/check_site.py`: 213 páginas HTML e recursos internos verificados.
- `docker build -t fbr-training:habblaud-check .`: imagem criada com o curso incluído.
- `nginx -t` no container: configuração válida.
- `node scripts/check_habblaud.cjs`: aprovado contra o container Nginx local.
  Foram percorridas as 18 aulas, com respostas erradas/corretas, conclusão,
  recarga, caderno, checklist e download real do JSON. Validou 18/18, retorno
  a 17/18 e retomada na aula 18. A avaliação foi conferida sem respostas,
  com seis acertos e após alteração para cinco acertos.
- O teste também verificou isolamento e progresso dos cinco cursos anteriores
  que compartilham o JavaScript, e visitou todas as 24 páginas do Habblaud
  em 1440 e 390 pixels, sem overflow horizontal, erros de JavaScript ou HTTP.
- Capturas da visão geral em desktop e da aula de instalação no celular
  foram inspecionadas visualmente: texto, controles e roteiros legíveis.
- Healthcheck local 200; `/habblaud` redireciona a `/habblaud/`;
  URL inexistente, `.git/config` e script Python retornam 404.
- Não houve deploy nem teste do domínio publicado nesta entrega.

Para repetir o teste, disponibilize Playwright e Chromium e use o endereço
`http://127.0.0.1:18767` ou defina `TRAINING_URL`. Se necessário, `TRAINING_BROWSER`
seleciona o executável do navegador e `TRAINING_SCREENSHOTS` recebe capturas.
O teste cria seu próprio contexto temporário de navegador; não altera o progresso
de usuários existentes.

## Checklist Sitebasics

A revisão está concluída; pendências compartilhadas do portal foram registradas,
sem transformar a inclusão de um curso em reformulação institucional.

| Página ou escopo | Requisito | Estado | Evidência ou próxima ação |
| --- | --- | --- | --- |
| 24 páginas do curso e cartão do catálogo | Título e descrição específicos, links internos e breadcrumbs | OK | Gerador e verificador estático; navegação HTTP e no navegador. |
| Visão geral | CTA principal e cinco perguntas frequentes | OK | Link de início e seis perguntas específicas do curso; capturas desktop/celular. |
| Aulas, avaliação e caderno | Confirmação após ação | OK | Feedback da resposta, nota, conclusão, status de exportação e JSON baixado. |
| 24 páginas | Responsividade e recursos compartilhados | OK | Duas larguras, sem overflow ou falhas de recursos; inspeção de capturas. |
| Curso | Fontes, data, exemplos e limites | OK | Página de fontes públicas; edição de 28/10/2026; exemplos identificados como fictícios. |
| Curso | Alt text | Não se aplica | Não há imagens de conteúdo nem botões em imagem. |
| Visão geral no celular | CTA fixo | Pendente | Mantido o padrão atual do portal; o início está na seção principal e a navegação é sticky, mas não há CTA fixo de início. |
| Site inteiro | 404 personalizada e robots.txt | Pendente | Nginx responde 404 corretamente; a página é padrão e não há robots.txt próprio. |
| Site inteiro | Privacidade, termos, Sobre e contato | Pendente | Não existem páginas institucionais no portal; precisam de informações e textos do responsável. A política do Habblaud World é fonte externa, não política do FBR Training. |
| Site inteiro | Google Analytics | Pendente | Nenhum identificador fornecido; nenhuma integração adicionada. |
| Site inteiro | Imagem de compartilhamento e favicon | Pendente | Não há ativos e metadados próprios no padrão atual; criar em uma revisão compartilhada. |
| Site inteiro | Cases reais, avaliações e foto do time | Pendente | Nenhuma evidência ou imagem autorizada disponível; não foram inventadas. |
| Curso | Formulário comercial, prazo e página de obrigado | Não se aplica | Ensino estático sem captação ou envio de formulário; exportação possui confirmação própria. |
| Curso | Mapa, como chegar e schema local | Não se aplica | Curso online sem visitação ou atendimento presencial neste escopo. |
| Ambiente publicado | Deploy, coleta e acesso externo | Não verificado | Validação feita na imagem Nginx local; requer publicação para conferir o domínio. |

## Alterações compartilhadas

O gerador aceita a quantidade de aulas definida no conteúdo e mantém os cinco
cursos anteriores em 12 aulas. O runtime usa `data-total` e `data-edition` quando
presentes, com os valores anteriores como padrão. Nenhuma chave de armazenamento
existente foi alterada. O novo curso usa `fbr-training:habblaud:v1`.

Catálogo, regras de inclusão Git/Docker, Dockerfile e smoke test do workflow
foram atualizados para levar as novas páginas ao próximo deploy.
