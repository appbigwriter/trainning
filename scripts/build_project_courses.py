"""Gera os cinco cursos de projetos: python scripts/build_project_courses.py."""
from pathlib import Path
from html import escape as e
import json
from project_courses import COURSES

ROOT = Path(__file__).resolve().parents[1]
TOOLS = [('caderno', 'Caderno e exportação'), ('checklist', 'Checklist do projeto'),
         ('avaliacao', 'Avaliação final'), ('glossario', 'Glossário'), ('fontes', 'Fontes e limites')]

def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')

def page(course, title, description, body, nested=False):
    prefix = '../' if nested else ''
    root = '../../' if nested else '../'
    return f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} — {e(course['name'])} | FBR Training</title><meta name="description" content="{e(description, quote=True)}">
<meta name="theme-color" content="{course['color']}"><link rel="stylesheet" href="{root}assets/project-course.css">
<link rel="stylesheet" href="{prefix}assets/theme.css"><script src="{root}assets/project-course.js" defer></script></head>
<body data-course="{course['slug']}"><a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header><a class="brand" href="{prefix}index.html">{e(course['name'])}</a><a href="{root}index.html">Todos os cursos</a></header>
<nav class="course-nav" aria-label="Navegação do curso"><a href="{prefix}index.html#aulas">Aulas</a>{''.join(f'<a href="{prefix}reference/{slug}.html">{label}</a>' for slug, label in TOOLS[:3])}</nav>
<main id="conteudo"><nav class="breadcrumb" aria-label="Caminho"><a href="{root}index.html">FBR Training</a> / <a href="{prefix}index.html">{e(course['name'])}</a> / {e(title)}</nav>
{body}</main><footer><p>FBR Training · Material escrito e atividades práticas · Base documental: 26/10/2026.</p>
<p>Progresso e respostas ficam neste navegador. Não há envio aos projetos, login ou sincronização. Use o caderno para exportar uma cópia.</p>
<a href="{prefix}reference/fontes.html">Fontes e limites</a> · <a href="{prefix}reference/glossario.html">Glossário</a><p class="save-status" role="status" aria-live="polite"></p></footer></body></html>'''

def quiz(course, i, lesson, suffix=''):
    _, _, _, _, question, correct, wrong1, wrong2, feedback = lesson
    position = (i // 3) % 3 if suffix else i % 3
    choices = [wrong1, wrong2]
    choices.insert(position, correct)
    key = f'{suffix}quiz-{i+1:02}'
    return f'''<fieldset class="quiz" data-quiz="{key}" data-answer="{position}" data-feedback="{e(feedback, quote=True)}"><legend>{e(question)}</legend>
{''.join(f'<label class="option"><input type="radio" name="{key}" value="{j}" data-save="{key}"> {e(choice)}</label>' for j, choice in enumerate(choices))}
<button type="button" data-check>Conferir resposta</button><p class="feedback" role="status" aria-live="polite"></p></fieldset>'''

def generate(course):
    out = ROOT / course['slug']
    lessons = course['lessons']
    manifest = [dict(number=i+1, title=row[0], file=f'{i+1:04}.html', module=course['modules'][i//3]) for i, row in enumerate(lessons)]
    write(out/'assets/lessons.json', json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    write(out/'assets/theme.css', f":root{{--accent:{course['color']};--tint:{course['tint']}}}\n")
    body = f'''<section class="hero"><div><p class="eyebrow">Projetos FBR · 4 módulos · 12 aulas</p><h1>{e(course['name'])}</h1><p class="lead">{e(course['summary'])}</p><a class="button" href="lessons/0001.html">Começar a primeira aula →</a></div>
<aside><p class="eyebrow">Seu projeto final</p><h2>Aprenda criando</h2><p>{e(course['outcome'])}</p><p id="progress-text" role="status">0 de 12 aulas concluídas</p><progress id="course-progress" max="12" value="0">0 de 12</progress><a href="lessons/0001.html" id="resume">Continuar estudo →</a></aside></section>
<section class="note"><h2>Como estudar</h2><p>Leia a explicação, resolva a prática, registre sua entrega e responda à pergunta de revisão. Marque uma aula como concluída depois de produzir sua resposta. A avaliação final revisa decisões; não emite certificado.</p><p>{e(course['status'])}</p><p>Exemplos são fictícios e as atividades são simulações. Este curso não inclui videoaulas nem opera os sistemas dos projetos.</p></section>
<section id="aulas"><h2>Trilha de aprendizado</h2><div class="modules">'''
    for m, module in enumerate(course['modules']):
        body += f'<section class="module"><p class="eyebrow">Módulo {m+1:02}</p><h3>{e(module)}</h3>'
        for item in manifest[m*3:m*3+3]:
            body += f'<a class="lesson-row" href="lessons/{item["file"]}"><span>{item["number"]:02}</span><strong>{e(item["title"])}</strong><span data-mark="{item["number"]:02}" aria-label="Não concluída">○</span></a>'
        body += '</section>'
    body += '</div></section><section><h2>Materiais de apoio</h2><div class="tools">'+''.join(f'<a href="reference/{slug}.html">{label} →</a>' for slug, label in TOOLS)+'</div></section>'
    body += '<section><h2>Perguntas sobre o curso</h2>'
    for q, a in [('Preciso conectar contas reais?', 'Não. As práticas produzem planos e artefatos fictícios. Conexões e ações reais seguem os processos dos projetos.'), ('Onde as respostas são salvas?', 'No armazenamento local deste navegador e neste endereço. Use a exportação do caderno para guardar uma cópia.'), ('Há videoaulas?', 'Esta edição oferece aulas escritas, exemplos, exercícios e materiais de consulta.'), ('Como concluir uma aula?', 'Faça a prática, registre sua resposta e use a caixa de conclusão. Você controla seu progresso.'), ('O curso comprova que o projeto está em produção?', 'Não. As fontes distinguem visão, implementação local e dependências externas. Confira o status vigente antes de operar.')]:
        body += f'<details><summary>{q}</summary><p>{a}</p></details>'
    body += '</section>'
    write(out/'index.html', page(course, 'Visão geral do curso', course['summary'], body))
    for i, lesson in enumerate(lessons):
        title, explanation, example, practice, *_ = lesson
        number = f'{i+1:02}'
        body = f'<p class="eyebrow">Módulo {i//3+1} · Aula {number} de 12</p><h1>{e(title)}</h1><p class="lead">{e(course["modules"][i//3])}</p>'
        body += '<section><h2>Entenda e aplique</h2>'+''.join(f'<p>{e(p)}</p>' for p in explanation.split('|'))+'</section>'
        body += f'<section class="case"><h2>Exemplo fictício</h2><p>{e(example)}</p></section><section class="practice"><h2>Sua prática</h2><p>{e(practice)}</p><label for="notes">Sua entrega e dúvidas</label><textarea id="notes" data-save="lesson-{number}-notes" placeholder="Registre o artefato, sua decisão e o que ainda precisa verificar."></textarea><p class="small">Salvo neste navegador quando o armazenamento estiver disponível. Exporte uma cópia pelo caderno.</p></section>'
        body += quiz(course, i, lesson)
        body += f'<label class="completion"><input type="checkbox" data-save="done-{number}"> Produzi minha resposta e concluí esta aula.</label><nav class="pagination" aria-label="Sequência de aulas">'
        body += f'<a href="{i:04}.html">← Aula anterior</a>' if i else '<a href="../index.html">← Visão geral</a>'
        body += f'<a href="{i+2:04}.html">Próxima aula →</a>' if i < 11 else '<a href="../reference/avaliacao.html">Avaliação final →</a>'
        body += '</nav>'
        write(out/f'lessons/{i+1:04}.html', page(course, f'Aula {number}: {title}', f'{title}. {practice}', body, True))
    def ref(slug, title, desc, content):
        write(out/f'reference/{slug}.html', page(course, title, desc, f'<p class="eyebrow">Material de apoio</p><h1>{title}</h1><p class="lead">{desc}</p>'+content, True))
    body = '<p>Reúna as decisões das práticas em um projeto revisável. Respostas das aulas aparecem abaixo para consulta e edição. A exportação inclui notas, escolhas, checklist e progresso deste curso.</p>'
    body += '<label for="final">Síntese do projeto final</label><textarea id="final" data-save="final-project"></textarea><button id="export" type="button">Exportar caderno em JSON</button> <button id="print" type="button">Imprimir / salvar PDF</button><p id="export-status" role="status"></p>'
    for i, lesson in enumerate(lessons):
        body += f'<section><h2>{i+1:02}. {e(lesson[0])}</h2><p>{e(lesson[3])}</p><label for="note-{i}">Sua entrega</label><textarea id="note-{i}" data-save="lesson-{i+1:02}-notes"></textarea></section>'
    ref('caderno', 'Caderno do projeto', course['outcome'], body)
    checks = ['O objetivo e o público estão definidos.', 'As responsabilidades e os limites estão explícitos.', 'As fontes e versões usadas estão registradas.', 'As práticas dos quatro módulos têm entregas.', 'As hipóteses estão separadas de fatos verificados.', 'As dependências externas estão identificadas.', 'Há critérios para revisar e bloquear uma ação.', 'O plano registra evidências e próximo responsável.', 'A avaliação foi revisada com justificativas.', 'Uma cópia do caderno foi exportada.']
    body = ''.join(f'<label class="completion"><input type="checkbox" data-save="check-{i}"> {e(item)}</label>' for i, item in enumerate(checks))
    body += '<section class="note"><h2>Critério de entrega</h2><p>Apresente objetivo, artefatos, evidências, pendências e próximo passo. Concluir esta checklist não executa publicação, provisionamento ou conexão de contas.</p><a href="caderno.html">Consolidar e exportar o projeto →</a></section>'
    ref('checklist', 'Checklist do projeto', 'Confira se o pacote permite revisão e continuidade.', body)
    body = '<p>Responda a quatro questões, uma por módulo. A nota e o feedback ajudam a revisar decisões. Você pode alterar respostas e conferir novamente.</p>'
    for i in (2,5,8,11):
        body += quiz(course, i, lessons[i], 'final-')
    body += '<button id="grade" type="button">Conferir avaliação</button><p id="grade-status" role="status" aria-live="polite"></p><p><a href="checklist.html">Revisar checklist →</a></p>'
    ref('avaliacao', 'Avaliação final', 'Quatro decisões para revisar o que aprendeu.', body)
    ref('glossario', 'Glossário', 'Vocabulário de consulta usado neste curso.', ''.join(f'<details><summary>{e(term)}</summary><p>{e(definition)}</p></details>' for term, definition in course['terms'].items()))
    body = '<section><h2>Base documental</h2><p>Conteúdo sintetizado dos arquivos locais abaixo, consultados em 26/10/2026. Os nomes são referências de autoria; os documentos internos não são copiados para o site público. Para rever os originais, use o repositório do projeto com acesso autorizado.</p><ul>'+''.join(f'<li><code>{e(source)}</code></li>' for source in course['sources'])+'</ul></section>'
    body += f'<section class="note"><h2>Estado e limites</h2><p>{e(course["status"])}</p><p>O estado dos projetos pode mudar após esta edição. Este material não verifica serviços remotos, não fornece credenciais e não representa aceite de produção. Em caso de divergência, consulte o status e o contrato atuais do projeto.</p></section><section><h2>O que foi criado para ensinar</h2><p>Sequência de aulas, exemplos fictícios, exercícios, perguntas e checklist são sínteses didáticas originais. Nenhum exemplo é apresentado como resultado de cliente ou medição real.</p></section>'
    ref('fontes', 'Fontes e limites', 'Conheça a origem, a data e o alcance deste material.', body)
    return len(lessons)+6

if __name__ == '__main__':
    total = sum(generate(c) for c in COURSES)
    print(f'Gerados {len(COURSES)} cursos e {total} páginas HTML.')
