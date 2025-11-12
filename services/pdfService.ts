
import { ColoringPage } from '../App';

// Tell TypeScript that jspdf is available on the window object from the CDN
declare const jspdf: any;

export const createColoringBookPdf = (
  cover: ColoringPage, 
  pages: ColoringPage[], 
  childName: string,
  theme: string
): void => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter' // 8.5 x 11 inches
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 0.75;
  const maxImgWidth = pageWidth - margin * 2;
  const maxImgHeight = pageHeight - margin * 2;

  // --- Cover Page ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(36);
  doc.text(`${childName}'s`, pageWidth / 2, 1.5, { align: 'center' });
  doc.text(`Coloring Adventure!`, pageWidth / 2, 2.2, { align: 'center' });
  
  const coverImg = `data:image/png;base64,${cover.image}`;
  // Aspect ratio is 4:3 from imagen
  const imgWidth = maxImgWidth;
  const imgHeight = imgWidth * 0.75;
  const imgX = (pageWidth - imgWidth) / 2;
  const imgY = 3;
  doc.addImage(coverImg, 'PNG', imgX, imgY, imgWidth, imgHeight);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(18);
  doc.text(`Theme: ${theme}`, pageWidth / 2, imgY + imgHeight + 0.5, { align: 'center' });


  // --- Coloring Pages ---
  pages.forEach((page, index) => {
    doc.addPage();
    const pageImg = `data:image/png;base64,${page.image}`;
    
    // For pages, let's try to fit the image as large as possible
    const pageImgWidth = maxImgWidth;
    const pageImgHeight = pageImgWidth * 0.75;
    const pageImgX = (pageWidth - pageImgWidth) / 2;
    const pageImgY = (pageHeight - pageImgHeight) / 2;

    doc.addImage(pageImg, 'PNG', pageImgX, pageImgY, pageImgWidth, pageImgHeight);
    
    // Add a page number
    doc.setFontSize(12);
    doc.text(`${index + 1}`, pageWidth / 2, pageHeight - 0.5, { align: 'center' });
  });

  doc.save(`${childName}_${theme.replace(/\s+/g, '_')}_Coloring_Book.pdf`);
};
