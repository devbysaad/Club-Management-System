/**
 * News Email Template
 */

export function newsTemplate(data: {
    title: string;
    content: string;
    imageUrl?: string;
}): { subject: string; html: string } {
    return {
        subject: `📰 ${data.title} - Pato Hornets FC`,
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
          .badge { background: #004D98; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .content { padding: 20px 0; }
          .featured-image { width: 100%; border-radius: 10px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚽ Pato Hornets FC</div>
          </div>
          
          <div class="badge">📰 Latest News</div>
          
          <h2 style="color: #A50044;">${data.title}</h2>
          
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="News Image" class="featured-image">` : ''}
          
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
