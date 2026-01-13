/**
 * Announcement Email Template
 */

export function announcementTemplate(data: {
    title: string;
    content: string;
    priority: number;
}): { subject: string; html: string } {
    const priorityLabel =
        data.priority >= 8 ? "🔴 URGENT" :
            data.priority >= 5 ? "⚠️ IMPORTANT" :
                "📢 Announcement";

    return {
        subject: `${priorityLabel}: ${data.title}`,
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
          .priority { padding: 10px 20px; border-radius: 5px; font-weight: bold; text-align: center; margin: 20px 0; }
          .urgent { background: #fee; color: #c00; }
          .important { background: #fff3cd; color: #856404; }
          .normal { background: #e8f5e9; color: #2e7d32; }
          .content { padding: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚽ Pato Hornets FC</div>
          </div>
          
          <div class="priority ${data.priority >= 8 ? 'urgent' : data.priority >= 5 ? 'important' : 'normal'}">
            ${priorityLabel}
          </div>
          
          <h2 style="color: #A50044;">${data.title}</h2>
          
          <div class="content">
            ${data.content.replace(/\n/g, '<br>')}
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
