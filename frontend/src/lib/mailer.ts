import nodemailer from 'nodemailer';

// SMTP Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ [MAILER] SMTP server is ready to send emails');
        return true;
    } catch (error: any) {
        console.error('❌ [MAILER] SMTP configuration error:', error.message);
        return false;
    }
}

// Send email function
export async function sendEmail({
    to,
    subject,
    html,
    from = process.env.SMTP_FROM || 'Pato Hornets Academy <noreply@patohornetsfootball.com>',
    cc,
    bcc,
}: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
}) {
    const recipients = Array.isArray(to) ? to.join(', ') : to;

    console.log(`📧 [MAILER] Preparing to send email`);
    console.log(`📧 [MAILER] To: ${recipients}`);
    console.log(`📧 [MAILER] Subject: ${subject}`);

    try {
        const info = await transporter.sendMail({
            from,
            to: recipients,
            cc,
            bcc,
            subject,
            html,
        });

        console.log(`✅ [MAILER] Email sent successfully`);
        console.log(`✅ [MAILER] Message ID: ${info.messageId}`);

        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`❌ [MAILER] Failed to send email:`, error);
        console.error(`❌ [MAILER] Error details:`, {
            code: error.code,
            message: error.message,
            command: error.command,
        });

        return { success: false, error: error.message };
    }
}

// Bulk email function (with rate limiting)
export async function sendBulkEmails(
    emails: Array<{ to: string; subject: string; html: string }>,
    delayMs: number = 100 // Delay between emails to avoid rate limiting
) {
    console.log(`📧 [MAILER] Sending ${emails.length} bulk emails`);

    const results = [];

    for (const email of emails) {
        const result = await sendEmail(email);
        results.push(result);

        // Add delay between emails
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    console.log(`✅ [MAILER] Bulk send complete: ${successCount} sent, ${failureCount} failed`);

    return { results, successCount, failureCount };
}

export default transporter;
