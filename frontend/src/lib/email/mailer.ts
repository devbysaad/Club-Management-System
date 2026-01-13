/**
 * Core Email Mailer Utility
 * Uses Nodemailer for email sending with automatic logging to EmailLog table
 */

import nodemailer from "nodemailer";
import prisma from "../prisma";

// Email configuration from environment variables
const emailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(emailConfig);

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    type: "announcement" | "news" | "attendance" | "fee" | "admission" | "order";
}

export interface EmailResult {
    success: boolean;
    error?: string;
    messageId?: string;
}

/**
 * Send email with automatic logging to database
 * Non-blocking - logs success/failure but doesn't throw
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    // Send to each recipient individually and log each attempt
    const results: EmailResult[] = [];

    for (const recipient of recipients) {
        // Validate email
        if (!recipient || !isValidEmail(recipient)) {
            await logEmail({
                type: options.type,
                recipient: recipient || "invalid",
                subject: options.subject,
                body: options.html,
                status: "FAILED",
                error: "Invalid email address",
            });
            results.push({ success: false, error: "Invalid email address" });
            continue;
        }

        try {
            // Send email
            const info = await transporter.sendMail({
                from: process.env.SMTP_FROM || `Pato Hornets <${process.env.SMTP_USER}>`,
                to: recipient,
                subject: options.subject,
                html: options.html,
            });

            // Log success
            await logEmail({
                type: options.type,
                recipient,
                subject: options.subject,
                body: options.html,
                status: "SENT",
                sentAt: new Date(),
            });

            results.push({ success: true, messageId: info.messageId });
        } catch (error: any) {
            console.error(`[EMAIL_ERROR] Failed to send to ${recipient}:`, error);

            // Log failure
            await logEmail({
                type: options.type,
                recipient,
                subject: options.subject,
                body: options.html,
                status: "FAILED",
                error: error.message || "Unknown error",
            });

            results.push({ success: false, error: error.message });
        }
    }

    // Return success if at least one email sent
    const hasSuccess = results.some((r) => r.success);
    const errors = results.filter((r) => !r.success).map((r) => r.error);

    return {
        success: hasSuccess,
        error: errors.length > 0 ? errors.join("; ") : undefined,
    };
}

/**
 * Log email attempt to database
 */
async function logEmail(data: {
    type: string;
    recipient: string;
    subject: string;
    body: string;
    status: "PENDING" | "SENT" | "FAILED";
    error?: string;
    sentAt?: Date;
}) {
    try {
        await prisma.emailLog.create({
            data: {
                type: data.type,
                recipient: data.recipient,
                subject: data.subject,
                body: data.body,
                status: data.status,
                error: data.error,
                sentAt: data.sentAt,
            },
        });
    } catch (error) {
        // Don't let logging errors break the flow
        console.error("[EMAIL_LOG_ERROR]", error);
    }
}

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Retry failed email by ID
 */
export async function retryEmail(emailLogId: string): Promise<EmailResult> {
    try {
        const emailLog = await prisma.emailLog.findUnique({
            where: { id: emailLogId },
        });

        if (!emailLog) {
            return { success: false, error: "Email log not found" };
        }

        if (emailLog.status === "SENT") {
            return { success: false, error: "Email already sent" };
        }

        // Increment retry count
        await prisma.emailLog.update({
            where: { id: emailLogId },
            data: { retryCount: emailLog.retryCount + 1 },
        });

        // Retry sending
        return await sendEmail({
            to: emailLog.recipient,
            subject: emailLog.subject,
            html: emailLog.body,
            type: emailLog.type as any,
        });
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
