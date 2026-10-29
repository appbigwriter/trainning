# LaserGRBL — revisão de entrega

Data: 29/10/2026. Escopo: cartão no catálogo, 36 páginas do curso, cinco downloads e integração no empacotamento Nginx. Curso escrito, 30 aulas em dez módulos, três projetos. Nenhum ensaio com laser foi executado; parâmetros físicos dependem da máquina e do material.

## Evidências técnicas

- `python scripts/build_lasergrbl_course.py`: 36 páginas e cinco materiais gerados.
- `python scripts/check_site.py`: 249 páginas HTML e recursos internos conferidos.
- Build Docker `fbr-training:lasergrbl` concluído, com arquivos do novo curso na imagem.
- `check_lasergrbl.cjs` na imagem recém-construída: todas as páginas em 1440 e 390 px, 30 exercícios, avaliação de dez questões, persistência, progresso, exportação JSON, cinco downloads e isolamento entre cursos. Sem erros de JavaScript/HTTP ou transbordamento horizontal da página. A tabela tem rolagem própria no celular.
- `check_habblaud.cjs` na mesma imagem: 24 páginas, exercícios, avaliação, exportação e regressão dos cinco cursos de projetos passaram.
- Inspeção visual: página inicial em desktop e aula 13 em celular, capturadas pelo teste. Fontes, controles, trilha e tabela legíveis. Capturas ficam fora do repositório.
- Prévia local: `http://127.0.0.1:18768/lasergrbl/`. Produção não foi publicada ou verificada.

## Checklist sitebasics

| Página ou escopo | Requisito | Estado | Evidência ou ação necessária |
|---|---|---|---|
| Novas 36 páginas | Título único | OK | Verificação estática identifica títulos distintos. |
| Novas 36 páginas | Meta description | OK | Descrições próprias no HTML; verificadas pelo script. |
| Catálogo e curso | Links internos | OK | Destinos locais conferidos; navegação e downloads testados na imagem. |
| Curso | Breadcrumbs | OK | Portal / curso / página, presentes no template e na inspeção visual. |
| Curso | Alt text | Não se aplica | Páginas não incluem imagens informativas embutidas; artes são downloads com rótulos e SVG com título/descrição. |
| Curso | CTA acima da dobra | OK | Botão para a primeira aula no início da página; inspeção de desktop e celular. |
| Curso | CTA fixo no celular | Não se aplica | Ambiente de aprendizagem, sem captação ou compra; navegação e ações locais são acessíveis no fluxo. |
| Curso | Confirmação de conversão | Não se aplica | Não há formulário de captação ou transação; avaliação e exportação mostram seus estados na própria página. |
| Curso | Prazo de resposta | Não se aplica | Não há atendimento ou formulário no novo curso. |
| Curso | Cinco perguntas frequentes | OK | Sete perguntas específicas, com limites de arquivos, prática e armazenamento. |
| Curso | Cases com resultado | Não se aplica | Três projetos didáticos, identificados como exemplos; nenhum resultado de cliente é alegado. |
| Curso | Avaliações reais | Não se aplica | Nenhum depoimento é usado como prova de qualidade. |
| Curso | Responsividade | OK | 36 páginas em duas larguras; inspeção de capturas, sem overflow da página. |
| Curso | Privacidade operacional | OK | Rodapé explica armazenamento no navegador e exportação; teste usa contexto isolado. |
| Site inteiro | Política de privacidade | Pendente | O portal não possui página institucional ligada no rodapé; depende de identificação e validação do responsável. Escopo não ampliado para redigir documentos jurídicos. |
| Site inteiro | Termos de uso | Pendente | Documento institucional e dados do responsável não foram fornecidos. |
| Site inteiro | Sobre nós | Pendente | Identidade FBR visível; descrição institucional validada e página própria não disponíveis. |
| Site inteiro | Contato funcional | Pendente | Canal de atendimento não fornecido; não foi inventado. |
| Site inteiro | Google Analytics | Pendente | Identificador, consentimento e acesso à coleta não fornecidos; nenhum rastreador foi acrescentado. |
| Site inteiro | Imagem de compartilhamento / Open Graph | Pendente | Portal não tem configuração de compartilhamento validada; depende do endereço canônico de publicação e imagem escolhida. |
| Site inteiro | Favicon personalizado | Pendente | Não há ícone institucional fornecido/configurado no template existente. |
| Site inteiro | robots.txt | Pendente | Arquivo não existe no portal; intenção de indexação do responsável ainda não registrada. |
| Site inteiro | 404 personalizada | Pendente | Nginx responde 404 para caminho ausente, mas usa página padrão; falta apresentação com retorno ao portal. |
| Site inteiro | Mapa e como chegar | Não se aplica | Portal de cursos online, sem atendimento presencial anunciado. |
| Site inteiro | Schema local | Não se aplica | Nenhum negócio local ou endereço é apresentado neste escopo. |
| Site inteiro | Foto real do time | Pendente | Material e autorização não fornecidos. Nenhuma foto fictícia foi utilizada. |
| Produção | Acesso e comportamento publicado | Não verificado | Prévia e imagem local verificadas; nenhuma publicação foi solicitada/executada. |

Correções entregues: novo curso, cartão, rotas, materiais, fontes por aula, orientação de formatos, metadados próprios, navegação, exercícios e integração Docker/CI. As pendências institucionais acima são do portal compartilhado e não impedem estudar o curso na prévia local.
