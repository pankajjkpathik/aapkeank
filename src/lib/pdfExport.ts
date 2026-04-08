import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const A4_W = 210;
const A4_H = 297;
const MARGIN = 12;
const CONTENT_W = A4_W - MARGIN * 2;
const HEADER_H = 8;
const FOOTER_H = 8;
const USABLE_H = A4_H - MARGIN * 2 - HEADER_H - FOOTER_H;

function drawHeader(pdf: jsPDF, clientName: string, dob: string) {
  const y = MARGIN;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(clientName, MARGIN, y + 4);
  pdf.text(`Dob: ${dob}`, A4_W - MARGIN, y + 4, { align: "right" });
  pdf.setDrawColor(200, 160, 60);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y + 6, A4_W - MARGIN, y + 6);
}

function drawFooter(pdf: jsPDF, pageNum: number) {
  const y = A4_H - MARGIN - 2;
  pdf.setDrawColor(200, 160, 60);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y - 4, A4_W - MARGIN, y - 4);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(140, 110, 30);
  pdf.text("Ank Darppan", MARGIN, y);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Aapke Ank", A4_W / 2, y, { align: "center" });
  pdf.text(`Page ${pageNum}`, A4_W - MARGIN, y, { align: "right" });
}

export async function exportReportPDF(
  reportElement: HTMLElement,
  clientName: string,
  dob: string,
  onProgress?: (pct: number) => void
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Find all sections marked with data-pdf-section
  const sections = Array.from(
    reportElement.querySelectorAll("[data-pdf-section]")
  ) as HTMLElement[];

  if (sections.length === 0) return;

  let pageNum = 1;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const isCover = section.getAttribute("data-pdf-section") === "cover";

    if (i > 0) {
      pdf.addPage();
      pageNum++;
    }

    // Temporarily force white background and dark text for capture
    const origBg = section.style.background;
    const origColor = section.style.color;
    section.style.background = "white";
    section.style.color = "#1a1a1a";
    section.classList.add("pdf-capture-mode");

    const canvas = await html2canvas(section, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: section.scrollWidth,
      height: section.scrollHeight,
    });

    // Restore styles
    section.style.background = origBg;
    section.style.color = origColor;
    section.classList.remove("pdf-capture-mode");

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgW = canvas.width;
    const imgH = canvas.height;
    const scale = CONTENT_W / imgW;
    const renderedH = imgH * scale;

    if (isCover) {
      // Cover page: full page, no header/footer, centered
      const coverScale = Math.min(CONTENT_W / imgW, (A4_H - MARGIN * 2) / imgH);
      const coverW = imgW * coverScale;
      const coverH = imgH * coverScale;
      const cx = (A4_W - coverW) / 2;
      const cy = (A4_H - coverH) / 2;
      pdf.addImage(imgData, "JPEG", cx, cy, coverW, coverH);
    } else {
      // Regular page with header + footer
      drawHeader(pdf, clientName, dob);
      drawFooter(pdf, pageNum);

      const contentY = MARGIN + HEADER_H;

      if (renderedH <= USABLE_H) {
        // Fits on one page
        pdf.addImage(imgData, "JPEG", MARGIN, contentY, CONTENT_W, renderedH);
      } else {
        // Multi-page section: tile across pages
        const srcPageH = USABLE_H / scale; // height in source pixels per page
        let srcY = 0;
        let firstSlice = true;

        while (srcY < imgH) {
          if (!firstSlice) {
            pdf.addPage();
            pageNum++;
            drawHeader(pdf, clientName, dob);
            drawFooter(pdf, pageNum);
          }

          const sliceH = Math.min(srcPageH, imgH - srcY);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = imgW;
          sliceCanvas.height = sliceH;
          const ctx = sliceCanvas.getContext("2d")!;
          ctx.drawImage(canvas, 0, srcY, imgW, sliceH, 0, 0, imgW, sliceH);

          const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
          const sliceRenderedH = sliceH * scale;
          pdf.addImage(sliceData, "JPEG", MARGIN, contentY, CONTENT_W, sliceRenderedH);

          srcY += sliceH;
          firstSlice = false;
        }
      }
    }

    onProgress?.(Math.round(((i + 1) / sections.length) * 100));
  }

  pdf.save(`${clientName.replace(/\s+/g, "_")}_Numerology_Report.pdf`);
}
