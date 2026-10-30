from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf"
SOURCES = [
    (ROOT / "specs/prototype/website-ia.md", OUTPUT / "mag-net-website-ia.pdf"),
    (ROOT / "specs/prototype/backend-prototype-ia.md", OUTPUT / "mag-net-admin-ia.pdf"),
]
FONT_REGULAR = "MAGNetArial"
FONT_BOLD = "MAGNetArialBold"


def register_fonts():
    pdfmetrics.registerFont(TTFont(FONT_REGULAR, "/System/Library/Fonts/Supplemental/Arial.ttf"))
    pdfmetrics.registerFont(TTFont(FONT_BOLD, "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))


def escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(text: str) -> str:
    text = escape(text.strip())
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    return text


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("IATitle", parent=base["Title"], fontName=FONT_BOLD, fontSize=24, leading=29, textColor=colors.HexColor("#1D1D1D"), spaceAfter=10),
        "meta": ParagraphStyle("IAMeta", parent=base["Normal"], fontName=FONT_REGULAR, fontSize=9, leading=13, textColor=colors.HexColor("#626262"), spaceAfter=18),
        "h2": ParagraphStyle("IAH2", parent=base["Heading2"], fontName=FONT_BOLD, fontSize=15, leading=19, textColor=colors.HexColor("#1D1D1D"), spaceBefore=16, spaceAfter=8, keepWithNext=True),
        "h3": ParagraphStyle("IAH3", parent=base["Heading3"], fontName=FONT_BOLD, fontSize=11.5, leading=15, textColor=colors.HexColor("#303030"), spaceBefore=12, spaceAfter=5, keepWithNext=True),
        "body": ParagraphStyle("IABody", parent=base["Normal"], fontName=FONT_REGULAR, fontSize=9.5, leading=14, textColor=colors.HexColor("#303030"), spaceAfter=7),
        "bullet": ParagraphStyle("IABullet", parent=base["Normal"], fontName=FONT_REGULAR, fontSize=9.5, leading=14, leftIndent=12, firstLineIndent=-9, textColor=colors.HexColor("#303030"), spaceAfter=3),
        "table": ParagraphStyle("IATable", parent=base["Normal"], fontName=FONT_REGULAR, fontSize=8, leading=10, textColor=colors.HexColor("#303030")),
        "table_head": ParagraphStyle("IATableHead", parent=base["Normal"], fontName=FONT_BOLD, fontSize=8, leading=10, textColor=colors.HexColor("#1D1D1D")),
        "footer": ParagraphStyle("IAFooter", parent=base["Normal"], fontName=FONT_REGULAR, fontSize=8, textColor=colors.HexColor("#777777"), alignment=TA_LEFT),
    }


def make_table(lines, s):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return None
    cols = max(len(row) for row in rows)
    rows = [row + [""] * (cols - len(row)) for row in rows]
    table_rows = []
    for row_index, row in enumerate(rows):
        style = s["table_head"] if row_index == 0 else s["table"]
        table_rows.append([Paragraph(inline(cell), style) for cell in row])
    available = A4[0] - 36 * mm
    widths = [available / cols] * cols
    table = Table(table_rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E9E9E9")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1D1D1D")),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#C9C9C9")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def parse_markdown(source, s):
    story = []
    lines = source.read_text(encoding="utf-8").splitlines()
    index = 0
    while index < len(lines):
        line = lines[index]
        if not line.strip() or line.strip() == "---":
            index += 1
            continue
        if line.startswith("# "):
            story.append(Paragraph(inline(line[2:]), s["title"]))
        elif line.startswith("## "):
            story.append(Paragraph(inline(line[3:]), s["h2"]))
        elif line.startswith("### "):
            story.append(Paragraph(inline(line[4:]), s["h3"]))
        elif line.lstrip().startswith("- "):
            story.append(Paragraph("• " + inline(line.lstrip()[2:]), s["bullet"]))
        elif line.strip().startswith("|"):
            table_lines = []
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index])
                index += 1
            table = make_table(table_lines, s)
            if table:
                story.extend([table, Spacer(1, 7)])
            continue
        else:
            story.append(Paragraph(inline(line), s["body"]))
        index += 1
    return story


def page_decor(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#C9C9C9"))
    canvas.setLineWidth(0.4)
    canvas.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.setFont(FONT_REGULAR, 8)
    canvas.drawString(18 * mm, 9 * mm, "MAG-NETic Platform - Information Architecture")
    canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


def build(source, destination):
    s = styles()
    doc = BaseDocTemplate(
        str(destination), pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=20 * mm,
        title=source.stem,
        author="MAG-NETic Platform",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="content")
    doc.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=page_decor))
    doc.build(parse_markdown(source, s))


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    register_fonts()
    for source, destination in SOURCES:
        build(source, destination)
        print(destination)


if __name__ == "__main__":
    main()
