/**
 * Fee Payment Receipt Email Template
 */

export function feePaymentTemplate(data: {
    studentName: string;
    month: string;
    year: number;
    amount: number;
    paidAmount: number;
    remainingAmount: number;
    status: string;
}): { subject: string; html: string } {
    return {
        subject: `Fee Payment Receipt - ${data.month} ${data.year}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
          .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #A50044; }
          .logo { color: #A50044; font-size: 24px; font-weight: bold; }
          .success-badge { background: #d4edda; color: #155724; padding: 10px 20px; border-radius: 5px; text-align: center; margin: 20px 0; font-weight: bold; }
          .receipt { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #dee2e6; }
          .receipt-row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; }
          .amount { color: #004D98; font-weight: bold; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚽ Pato Hornets FC</div>
          </div>
          
          <div class="success-badge">
            ✅ Payment Received
          </div>
          
          <h2 style="color: #A50044;">Payment Receipt</h2>
          
          <p>Dear Parent/Guardian,</p>
          <p>Thank you for your payment. Here are the details:</p>
          
          <div class="receipt">
            <div class="receipt-row">
              <span>Student:</span>
              <span>${data.studentName}</span>
            </div>
            <div class="receipt-row">
              <span>Period:</span>
              <span>${data.month} ${data.year}</span>
            </div>
            <div class="receipt-row">
              <span>Total Fee:</span>
              <span class="amount">$${data.amount.toFixed(2)}</span>
            </div>
            <div class="receipt-row">
              <span>Amount Paid:</span>
              <span class="amount">$${data.paidAmount.toFixed(2)}</span>
            </div>
            ${data.remainingAmount > 0 ? `
            <div class="receipt-row">
              <span>Balance Remaining:</span>
              <span class="amount">$${data.remainingAmount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="receipt-row">
              <span>Status:</span>
              <span style="color: ${data.status === 'PAID' ? '#155724' : '#856404'}">${data.status}</span>
            </div>
          </div>
          
          ${data.remainingAmount > 0 ? `
          <p style="background: #fff3cd; padding: 10px; border-radius: 5px;">
            <strong>Note:</strong> You have a balance of $${data.remainingAmount.toFixed(2)} remaining. Please settle this amount at your earliest convenience.
          </p>
          ` : `
          <p style="background: #d4edda; padding: 10px; border-radius: 5px; color: #155724;">
            <strong>✓</strong> Your account is fully paid for this period. Thank you!
          </p>
          `}
          
          <div class="footer">
            <p>Pato Hornets Football Club<br>
            This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
}
