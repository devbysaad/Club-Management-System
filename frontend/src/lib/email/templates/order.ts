/**
 * Order Status Email Template
 */

export function orderTemplate(data: {
    orderId: string;
    customerName: string;
    status: string;
    jerseyName: string;
    jerseyNumber: number;
}): { subject: string; html: string } {
    const statusColors = {
        PENDING: { bg: '#d1ecf1', text: '#0c5460', icon: '⏳' },
        PROCESSING: { bg: '#fff3cd', text: '#856404', icon: '🔄' },
        COMPLETED: { bg: '#d4edda', text: '#155724', icon: '✅' },
        CANCELLED: { bg: '#f8d7da', text: '#721c24', icon: '❌' },
    };

    const statusConfig = statusColors[status as keyof typeof statusColors] || statusColors.PENDING;

    return {
        subject: `Order Update: #${data.orderId.slice(0, 8)} - ${status}`,
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
          .status-badge { padding: 15px 20px; border-radius: 5px; text-align: center; margin: 20px 0; font-weight: bold; }
          .order-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .order-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #dee2e6; }
          .order-row:last-child { border-bottom: none; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚽ Pato Hornets FC</div>
          </div>
          
          <div class="status-badge" style="background: ${statusConfig.bg}; color: ${statusConfig.text}">
            ${statusConfig.icon} Order ${status}
          </div>
          
          <h2 style="color: #A50044;">Order Status Update</h2>
          
          <p>Hello ${data.customerName},</p>
          
          ${status === 'PROCESSING' ? `
            <p>Great news! Your jersey order is now being processed.</p>
          ` : ''}
          
          ${status === 'COMPLETED' ? `
            <p style="background: #d4edda; padding: 15px; border-radius: 5px; color: #155724;">
              <strong>✓ Your order is ready!</strong> You can now collect your custom jersey from the club office.
            </p>
          ` : ''}
          
          ${status === 'CANCELLED' ? `
            <p style="background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24;">
              Your order has been cancelled. If you have any questions, please contact us.
            </p>
          ` : ''}
          
          <div class="order-details">
            <h3 style="margin-top: 0;">Order Details</h3>
            <div class="order-row">
              <span>Order ID:</span>
              <span><strong>#${data.orderId.slice(0, 8)}</strong></span>
            </div>
            <div class="order-row">
              <span>Jersey Name:</span>
              <span><strong>${data.jerseyName}</strong></span>
            </div>
            <div class="order-row">
              <span>Jersey Number:</span>
              <span><strong>${data.jerseyNumber}</strong></span>
            </div>
            <div class="order-row">
              <span>Status:</span>
              <span style="color: ${statusConfig.text}"><strong>${status}</strong></span>
            </div>
          </div>
          
          ${status === 'PENDING' ? `
            <p>We'll notify you once your order starts processing.</p>
          ` : ''}
          
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
