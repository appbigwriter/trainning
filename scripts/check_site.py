from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

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
files = [ROOT / "index.html"] + list((ROOT / "amazon").rglob("*.html"))
for file in files:
    parser.file = file
    parser.feed(file.read_text(encoding="utf-8"))
assert len(list((ROOT / "amazon/lessons").glob("*.html"))) == 30
for page in ("index.html", "associates.html", "custom.html", "ads.html"):
    assert (ROOT / "amazon" / page).exists()
print(f"Verified {len(files)} HTML pages and internal resources.")
