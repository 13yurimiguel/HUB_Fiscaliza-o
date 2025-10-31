import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";

export type ReportSection = {
  title: string;
  content: string;
};

export async function exportReportToPdf(
  reportTitle: string,
  sections: ReportSection[]
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  let cursorY = height - 50;

  page.drawText(reportTitle, {
    x: 50,
    y: cursorY,
    size: 24,
    font,
    color: rgb(0.15, 0.25, 0.45),
  });
  cursorY -= 40;

  sections.forEach((section) => {
    page.drawText(section.title, {
      x: 50,
      y: cursorY,
      size: 18,
      font,
      color: rgb(0.1, 0.3, 0.6),
    });
    cursorY -= 24;

    const text = section.content.replace(/\n/g, " ");
    page.drawText(text, {
      x: 50,
      y: cursorY,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
      maxWidth: width - 100,
      lineHeight: 16,
    });
    cursorY -= 80;
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export async function exportReportToDocx(
  reportTitle: string,
  sections: ReportSection[]
): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: reportTitle, heading: HeadingLevel.HEADING_1 }),
          ...sections.flatMap((section) => [
            new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_2 }),
            new Paragraph(section.content),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
