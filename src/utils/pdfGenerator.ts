import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Customer {
  name: string;
  email?: string;
  phone?: string;
  monthlyAmount: number;
  paidAmount?: number;
}

interface VerificationResults {
  correct: Customer[];
  incorrect: Customer[];
  missing: Customer[];
}

interface PDFMetadata {
  title: string;
  date: Date;
  fileName: string;
  nameColumn: string;
  amountColumn: string;
}

/**
 * Format currency in German format
 */
function formatCurrency(amount: number): string {
  if (amount == null || isNaN(amount)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' €';
}

/**
 * Format date in German format
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Calculate total amount from correct payments
 */
function calculateTotalAmount(customers: Customer[]): number {
  return customers.reduce((sum, customer) => {
    return sum + (customer.paidAmount || customer.monthlyAmount || 0);
  }, 0);
}

/**
 * Generate PDF for payment verification results
 */
export function generatePaymentVerificationPDF(
  results: VerificationResults,
  metadata: PDFMetadata
): void {
  const doc = new jsPDF();

  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Monatsabrechnung', 105, yPosition, { align: 'center' });

  yPosition += 10;

  // Metadata
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Bezeichnung: ${metadata.title}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Datum: ${formatDate(metadata.date)}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Datei: ${metadata.fileName}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Namens-Spalte: ${metadata.nameColumn}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Betrags-Spalte: ${metadata.amountColumn}`, 20, yPosition);

  yPosition += 10;

  // Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ZUSAMMENFASSUNG', 20, yPosition);
  yPosition += 8;

  const totalAmount = calculateTotalAmount(results.correct);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 128, 0); // Green
  doc.text(`✓ Korrekte Zahlungen: ${results.correct.length} (${formatCurrency(totalAmount)})`, 20, yPosition);
  yPosition += 6;

  doc.setTextColor(255, 165, 0); // Orange
  doc.text(`⚠ Fehlerhafte Zahlungen: ${results.incorrect.length}`, 20, yPosition);
  yPosition += 6;

  doc.setTextColor(255, 0, 0); // Red
  doc.text(`✗ Nicht bezahlt: ${results.missing.length}`, 20, yPosition);
  yPosition += 10;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Correct Payments Table
  if (results.correct.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('KORREKTE ZAHLUNGEN', 20, yPosition);
    yPosition += 5;

    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Email', 'Telefon', 'Betrag']],
      body: results.correct.map(c => [
        c.name,
        c.email || '-',
        c.phone || '-',
        formatCurrency(c.paidAmount || c.monthlyAmount),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] }, // Green
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Incorrect Payments Table
  if (results.incorrect.length > 0) {
    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FEHLERHAFTE ZAHLUNGEN', 20, yPosition);
    yPosition += 5;

    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Email', 'Telefon', 'Soll-Betrag', 'Ist-Betrag']],
      body: results.incorrect.map(c => [
        c.name,
        c.email || '-',
        c.phone || '-',
        formatCurrency(c.monthlyAmount),
        formatCurrency(c.paidAmount || 0),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [251, 146, 60] }, // Orange
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Missing Payments Table
  if (results.missing.length > 0) {
    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FEHLENDE ZAHLUNGEN', 20, yPosition);
    yPosition += 5;

    autoTable(doc, {
      startY: yPosition,
      head: [['Name', 'Email', 'Telefon', 'Erwarteter Betrag']],
      body: results.missing.map(c => [
        c.name,
        c.email || '-',
        c.phone || '-',
        formatCurrency(c.monthlyAmount),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] }, // Red
      margin: { left: 20, right: 20 },
    });
  }

  // Generate filename
  const fileName = `Monatsabrechnung_${metadata.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;

  // Save PDF
  doc.save(fileName);
}
