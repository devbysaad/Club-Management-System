/**
 * Attendance Email Template
 */

export function attendanceTemplate(data: {
    studentName: string;
    date: Date;
    status: string;
}): { subject: string; html: string } {
    const formattedDate = data.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return {
        subject: `Attendance Alert: ${data.studentName} - ${data.status}`,
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
          .alert-box { background: #fee; border-left: 4px solid #c00; padding: 15px; margin: 20px 0; }
          .info-table { width: 100%; margin: 20px 0; }
          .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
          .info-table td:first-child { font-weight: bold; color: #666; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚽ Pato Hornets FC</div>
          </div>
          
          <div class="alert-box">
            <strong>⚠️ Attendance Alert</strong><br>
            Your child was marked ${data.status.toLowerCase()} today.
          </div>
          
          <h2 style="color: #A50044;">Attendance Record</h2>
          
          <table class="info-table">
            <tr>
              <td>Student:</td>
              <td>${data.studentName}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>${formattedDate}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td><strong>${data.status}</strong></td>
            </tr>
          </table>
          
          <p>If you believe this is an error, please contact the academy office immediately.</p>
          
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
