/**
 * Admission Status Email Template
 */

export function admissionTemplate(data: {
    studentName: string;
    status: string;
    reason?: string;
}): { subject: string; html: string } {
    const statusColors = {
        APPROVED: { bg: '#d4edda', text: '#155724', icon: '✅' },
        REJECTED: { bg: '#f8d7da', text: '#721c24', icon: '❌' },
        UNDER_REVIEW: { bg: '#fff3cd', text: '#856404', icon: '🔍' },
        PENDING: { bg: '#d1ecf1', text: '#0c5460', icon: '⏳' },
    };

    const statusConfig = statusColors[status as keyof typeof statusColors] || statusColors.PENDING;

    return {
        subject: `Admission Status Update: ${data.studentName} - ${status.replace('_', ' ')}`,
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
          .status-badge { padding: 15px 20px; border-radius: 5px; text-align: center; margin: 20px 0; font-weight: bold; font-size: 18px; }
          .content { padding: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚽ Pato Hornets FC</div>
          </div>
          
          <div class="status-badge" style="background: ${statusConfig.bg}; color: ${statusConfig.text}">
            ${statusConfig.icon} ${status.replace('_', ' ')}
          </div>
          
          <h2 style="color: #A50044;">Admission Status Update</h2>
          
          <div class="content">
            <p>Dear Parent/Guardian,</p>
            
            <p>We are writing to inform you about the admission status for <strong>${data.studentName}</strong>.</p>
            
            ${status === 'APPROVED' ? `
              <p style="background: #d4edda; padding: 15px; border-radius: 5px; color: #155724;">
                <strong>Congratulations!</strong> We are pleased to inform you that the admission application has been approved. 
                Welcome to the Pato Hornets family!
              </p>
              <p>Next steps:</p>
              <ul>
                <li>Complete the enrollment process</li>
                <li>Submit required documents</li>
                <li>Pay the registration fee</li>
              </ul>
            ` : ''}
            
            ${status === 'REJECTED' ? `
              <p style="background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24;">
                We regret to inform you that we are unable to approve the admission at this time.
              </p>
              ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
              <p>You may reapply in the next admission cycle.</p>
            ` : ''}
            
            ${status === 'UNDER_REVIEW' ? `
              <p style="background: #fff3cd; padding: 15px; border-radius: 5px; color: #856404;">
                Your application is currently under review. We will notify you once a decision has been made.
              </p>
            ` : ''}
            
            ${status === 'PENDING' ? `
              <p style="background: #d1ecf1; padding: 15px; border-radius: 5px; color: #0c5460;">
                Your application has been received and is pending review.
              </p>
            ` : ''}
          </div>
          
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
