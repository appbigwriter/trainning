"""Gera aulas e materiais públicos: python scripts/build_lasergrbl_course.py."""
from pathlib import Path
import csv
import struct
import zlib
from build_project_courses import generate, write
from lasergrbl_course import LASERGRBL

ROOT = Path(__file__).resolve().parents[1]

def build():
    pages = generate(LASERGRBL)
    out = ROOT / 'lasergrbl'
    write(out/'assets/extra.css', '''.table-scroll{overflow-x:auto;max-width:100%;border:1px solid #d6dfdb;border-radius:8px}table{border-collapse:collapse;width:100%;min-width:660px;font-size:15px}th,td{text-align:left;padding:14px;border-bottom:1px solid #d6dfdb;vertical-align:top}th{background:var(--tint)}pre{white-space:pre-wrap;overflow-wrap:anywhere}code{font-family:Consolas,monospace}.tools a{overflow-wrap:anywhere}#programas,#arquivos{scroll-margin-top:24px}@media print{.table-scroll{overflow:visible}table{min-width:0;font-size:10pt}}\n''')
    write(out/'downloads/placa-100x60.svg', '''<svg xmlns="http://www.w3.org/2000/svg" width="100mm" height="60mm" viewBox="0 0 100 60"><title>Placa de referência 100 por 60 milímetros, somente contornos</title><desc>Arte de estudo sem texto. Acrescente seu texto no editor. Não contém parâmetros de máquina.</desc><g fill="none" stroke="#000" stroke-width="0.2"><path d="M1 1H99V59H1Z"/><path d="M5 5H95V55H5Z"/></g></svg>\n''')
    write(out/'downloads/etiqueta-60x30.svg', '''<svg xmlns="http://www.w3.org/2000/svg" width="60mm" height="30mm" viewBox="0 0 60 30"><title>Etiqueta de estudo 60 por 30 milímetros</title><desc>Um contorno externo e um furo circular de diâmetro nominal 4 mm. Sem compensação de kerf ou parâmetros de máquina. A ordem dos elementos não garante a ordem de execução.</desc><g fill="none" stroke="#000" stroke-width="0.2"><path d="M6 15a2 2 0 1 0 4 0a2 2 0 1 0-4 0Z"/><path d="M0 0H60V30H0Z"/></g></svg>\n''')
    # PNG RGB authored with the standard library: no remote imagery or dependencies.
    width, height = 1000, 160
    raw = b''.join(b'\0'+b''.join(bytes((v, v, v)) for x in range(width) for v in [round(x/(width-1)*255)]) for _ in range(height))
    def chunk(kind, payload):
        return struct.pack('!I', len(payload))+kind+payload+struct.pack('!I', zlib.crc32(kind+payload) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR', struct.pack('!IIBBBBB',width,height,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b'')
    (out/'downloads/escala-tons.png').write_bytes(png)
    fields = ['id','data','operador','maquina','fonte','potencia_optica_nominal','firmware','escala_S','material','lote','espessura_mm','foco_procedimento','velocidade','unidade_velocidade','S_solicitado','modo','linhas_por_mm','passadas','air_assist','exaustao','resultado','dimensao_medida','foto','aceite','motivo_rejeicao']
    with (out/'downloads/ficha-testes.csv').open('w',encoding='utf-8-sig',newline='') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerow(fields)
        writer.writerow(['ENSAIO-001']+['']*(len(fields)-1))
    write(out/'downloads/roteiro-operacao.txt', '''LASERGRBL — roteiro para adaptar ao manual da sua máquina\nEdição 29/10/2026. Material didático, sem parâmetros universais.\n\nANTES\n[ ] Operador treinado e manual disponível.\n[ ] Equipamento, fonte, firmware e escala S identificados.\n[ ] Material, revestimento e espessura aprovados para o equipamento.\n[ ] Gabinete, intertravamentos, exaustão e proteção ocular verificados.\n[ ] Base, fixação e foco conforme o fabricante.\n[ ] Origem, dimensão, unidade e trajetória revisadas.\n[ ] Ensaio do envelope com emissão desabilitada e procedimento apropriado.\n[ ] Parâmetros testados, supervisão presencial e emergência conhecidos.\n\nDURANTE\n[ ] Acompanhar continuamente movimento, material, fumaça e ruídos.\n[ ] Interromper conforme o manual diante de anormalidade; investigar antes de retomar.\n[ ] Não mover o material durante pausa nem usar pausa como proteção física.\n\nDEPOIS\n[ ] Confirmar fim da execução e emissão desligada.\n[ ] Cumprir o tempo de extração e a sequência de acesso do fabricante.\n[ ] Inspecionar qualidade e dimensão; registrar rejeições.\n[ ] Guardar arquivos, parâmetros, versão e evidências.\n[ ] Fazer limpeza e manutenção apenas pelo procedimento de isolamento do fabricante.\n\nEste roteiro não substitui o treinamento, a avaliação do ambiente ou o manual.\n''')
    print(f'LaserGRBL: {pages} páginas e 5 arquivos de laboratório gerados.')

if __name__ == '__main__':
    build()
