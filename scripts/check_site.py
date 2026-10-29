from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
from project_courses import COURSES

ROOT = Path(__file__).resolve().parents[1]
class Check(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ("href", "src") or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            target = (ROOT / unquote(url.path.lstrip("/"))) if url.path.startswith("/") else (self.file.parent / unquote(url.path))
            assert target.exists(), f"Missing link: {self.file.relative_to(ROOT)} -> {value}"
            assert target.resolve().is_relative_to(ROOT), f"Link leaves site: {value}"

parser = Check()
files = [ROOT / "index.html"] + [page for course in ("amazon", "redes-sociais", "google-flow") for page in (ROOT / course).rglob("*.html")]
files += [page for course in COURSES for page in (ROOT / course['slug']).rglob('*.html')]
for file in files:
    parser.file = file
    parser.feed(file.read_text(encoding="utf-8"))
assert len(list((ROOT / "amazon/lessons").glob("*.html"))) == 30
for page in ("index.html", "associates.html", "custom.html", "ads.html"):
    assert (ROOT / "amazon" / page).exists()
assert len(list((ROOT / "redes-sociais/lessons").glob("*.html"))) == 18
assert len(list((ROOT / "redes-sociais/reference").glob("*.html"))) == 8
assert len(list((ROOT / "google-flow/lessons").glob("*.html"))) == 18
assert len(list((ROOT / "google-flow/reference").glob("*.html"))) == 8
colors = set()
for course in COURSES:
    folder = ROOT / course['slug']
    expected = len(course['lessons'])
    assert expected == len(course['modules']) * 3
    assert len(list((folder / 'lessons').glob('*.html'))) == expected
    assert len(list((folder / 'reference').glob('*.html'))) == 5
    lessons = json.loads((folder / 'assets/lessons.json').read_text(encoding='utf-8'))
    assert len(lessons) == expected
    assert course['color'] not in colors | {'#0d6357', '#1758ad', '#b84408'}
    colors.add(course['color'])
    titles = set()
    for file in folder.rglob('*.html'):
        content = file.read_text(encoding='utf-8')
        title = content.split('<title>', 1)[1].split('</title>', 1)[0]
        assert title not in titles, f'Duplicate title: {file}'
        titles.add(title)
        assert '<meta name="description" content="' in content
        assert f'data-course="{course["slug"]}"' in content
        assert 'F:\\Projetos' not in content
    for item in lessons:
        assert (folder / 'lessons' / item['file']).exists()
    assert f'COPY {course["slug"]}/' in (ROOT / 'Dockerfile').read_text(encoding='utf-8')
print(f"Verified {len(files)} HTML pages and internal resources.")
