import { useEffect } from "react";

const AutoPrintReceipt = ({ data, formatCurrency, onAfterPrint }) => {
  useEffect(() => {
    if (!data) return;

    const receiptHTML = `
      <html>
        <head>
          <title>Reçu</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                width: 80mm;
                font-family: monospace;
                font-size: 11px;
                margin: 0;
                padding: 5px 5px;
              }
              h3, p {
                text-align: center;
                margin: 2px 0;
              }
              hr {
                border: none;
                border-top: 1px dashed #000;
                margin: 4px 0;
              }
              .receipt-line,
              .receipt-item {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;
              }
              .receipt-footer {
                text-align: center;
                margin-top: 8px;
              }
            }
          </style>
        </head>
        <body>
          <h3>${data.entreprise}</h3>
          <p>NIF: ${data.nif}</p>
          <p>Stat: ${data.stat}</p>
          <p>Caissier: ${data.caissier}</p>
          <p>PDV: ${data.pdv}</p>
          <p>${data.date}</p>
          <hr/>
          ${data.articles.map(item => `
            <div class="receipt-item">
              <span>${item.quantity}x ${item.designation}</span>
              <span>${formatCurrency(item.montantTTC)}</span>
            </div>
          `).join("")}
          <hr/>
          <div class="receipt-line">
            <span>Total TTC:</span>
            <span>${formatCurrency(data.totalTTC)}</span>
          </div>
          <div class="receipt-line">
            <span>Reçu:</span>
            <span>${formatCurrency(data.montantRecu)}</span>
          </div>
          <div class="receipt-line">
            <span>Monnaie:</span>
            <span>${formatCurrency(data.renduMonnaie)}</span>
          </div>
          <div class="receipt-footer">
            <p>Merci pour votre achat</p>
            <p>${data.ticketNumber}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        onAfterPrint();
      };
    }
  }, [data, formatCurrency, onAfterPrint]);

  return null;
};

export default AutoPrintReceipt;
