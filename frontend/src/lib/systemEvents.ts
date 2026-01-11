import prisma from '@/lib/prisma';
import { sendEmail, sendBulkEmails } from '@/lib/mailer';
import * as templates from '@/lib/emailTemplates';

// ==============================================
// SYSTEM EVENT TYPES
// ==============================================
type SystemEvent =
    | { type: 'ADMISSION_SUBMITTED'; payload: { admissionId: string } }
    | { type: 'ADMISSION_STATUS_UPDATED'; payload: { admissionId: string; status: string } }
    | { type: 'ANNOUNCEMENT_CREATED'; payload: { announcementId: string } }
    | { type: 'EVENT_CREATED'; payload: { eventId: string } }
    | { type: 'ORDER_PLACED'; payload: { orderId: string } }
    | { type: 'STUDENT_ATTENDANCE_MARKED'; payload: { studentId: string; date: Date; status: string } }
    | { type: 'TEACHER_ATTENDANCE_MARKED'; payload: { teacherId: string; date: Date; status: string } }
    | { type: 'MONTHLY_FEE_REMINDER'; payload: { month: number; year: number } }
    | { type: 'FEE_PAID'; payload: { feeId: string } };

// ==============================================
// MAIN EVENT DISPATCHER
// ==============================================
export async function emitSystemEvent(event: SystemEvent) {
    console.log(`🔔 [EVENT] ${event.type}`, event);

    try {
        switch (event.type) {
            case 'ADMISSION_SUBMITTED':
                return await handleAdmissionSubmitted(event.payload);
            case 'ADMISSION_STATUS_UPDATED':
                return await handleAdmissionStatusUpdated(event.payload);
            case 'ANNOUNCEMENT_CREATED':
                return await handleAnnouncementCreated(event.payload);
            case 'EVENT_CREATED':
                return await handleEventCreated(event.payload);
            case 'ORDER_PLACED':
                return await handleOrderPlaced(event.payload);
            case 'STUDENT_ATTENDANCE_MARKED':
                return await handleStudentAttendanceMarked(event.payload);
            case 'TEACHER_ATTENDANCE_MARKED':
                return await handleTeacherAttendanceMarked(event.payload);
            case 'MONTHLY_FEE_REMINDER':
                return await handleMonthlyFeeReminder(event.payload);
            case 'FEE_PAID':
                return await handleFeePaid(event.payload);
            default:
                console.warn(`⚠️ [EVENT] Unknown event type`);
        }
    } catch (error: any) {
        console.error(`❌ [EVENT] Handler failed for ${event.type}:`, error.message);
        throw error;
    }
}

// ==============================================
// EVENT HANDLERS
// ==============================================

// 1️⃣ ADMISSION SUBMITTED - Notify Admin
async function handleAdmissionSubmitted({ admissionId }: { admissionId: string }) {
    console.log(`📋 [ADMISSION] Processing submission: ${admissionId}`);

    const admission = await prisma.admission.findUnique({
        where: { id: admissionId },
    });

    if (!admission) {
        console.warn(`⚠️ [ADMISSION] Admission ${admissionId} not found`);
        return;
    }

    const admins = await prisma.admin.findMany({
        where: { isDeleted: false },
        select: { email: true },
    });

    const adminEmails = admins.map(a => a.email).filter(Boolean) as string[];

    if (adminEmails.length === 0) {
        console.warn(`⚠️ [ADMISSION] No admin emails found`);
        return;
    }

    const html = templates.admissionSubmittedAdminTemplate({
        applicantName: admission.studentName,
        email: admission.email || undefined,
        phone: admission.phone || undefined,
        ageGroup: admission.targetAgeGroup || 'Not specified',
        submittedAt: admission.createdAt,
        admissionId,
    });

    return await sendEmail({
        to: adminEmails,
        subject: `New Admission: ${admission.studentName}`,
        html,
    });
}

// 2️⃣ ADMISSION STATUS UPDATED - Notify Applicant
async function handleAdmissionStatusUpdated({ admissionId, status }: { admissionId: string; status: string }) {
    console.log(`📋 [ADMISSION] Status updated: ${admissionId} -> ${status}`);

    const admission = await prisma.admission.findUnique({
        where: { id: admissionId },
    });

    if (!admission || !admission.email) {
        console.warn(`⚠️ [ADMISSION] No email for admission ${admissionId}`);
        return;
    }

    const html = templates.admissionStatusTemplate({
        applicantName: admission.studentName,
        status: status as any,
    });

    return await sendEmail({
        to: admission.email,
        subject: `Admission Update - ${admission.studentName}`,
        html,
    });
}

// 3️⃣ ANNOUNCEMENT CREATED - Email All Relevant Users
async function handleAnnouncementCreated({ announcementId }: { announcementId: string }) {
    console.log(`📢 [ANNOUNCEMENT] Processing: ${announcementId}`);

    const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
    });

    if (!announcement) {
        console.warn(`⚠️ [ANNOUNCEMENT] Announcement ${announcementId} not found`);
        return;
    }

    const recipients: string[] = [];

    for (const role of announcement.targetRoles) {
        if (role === 'ADMIN') {
            const admins = await prisma.admin.findMany({
                where: { isDeleted: false },
                select: { email: true },
            });
            recipients.push(...admins.map(a => a.email).filter(Boolean) as string[]);
        }

        if (role === 'COACH') {
            const coaches = await prisma.coach.findMany({
                where: { isDeleted: false },
                select: { email: true },
            });
            recipients.push(...coaches.map(c => c.email).filter(Boolean) as string[]);
        }

        if (role === 'STUDENT') {
            const students = await prisma.student.findMany({
                where: { isDeleted: false },
                select: { email: true },
            });
            recipients.push(...students.map(s => s.email).filter(Boolean) as string[]);
        }

        if (role === 'PARENT') {
            const parents = await prisma.parent.findMany({
                where: { isDeleted: false },
                select: { email: true },
            });
            recipients.push(...parents.map(p => p.email).filter(Boolean) as string[]);
        }
    }

    const uniqueRecipients = [...new Set(recipients)];

    if (uniqueRecipients.length === 0) {
        console.warn(`⚠️ [ANNOUNCEMENT] No recipients found`);
        return;
    }

    console.log(`📧 [ANNOUNCEMENT] Sending to ${uniqueRecipients.length} recipients`);

    const html = templates.announcementTemplate({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        targetRoles: announcement.targetRoles,
    });

    const emails = uniqueRecipients.map(email => ({
        to: email,
        subject: `📢 ${announcement.title}`,
        html,
    }));

    return await sendBulkEmails(emails, 100);
}

// 4️⃣ EVENT CREATED
async function handleEventCreated({ eventId }: { eventId: string }) {
    console.log(`📅 [EVENT] Processing: ${eventId}`);

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) {
        console.warn(`⚠️ [EVENT] Event ${eventId} not found`);
        return;
    }

    const students = await prisma.student.findMany({
        where: { isDeleted: false },
        include: { parent: true },
    });

    const recipients = students.flatMap(s => [
        s.email,
        s.parent.email,
    ]).filter(Boolean) as string[];

    const uniqueRecipients = [...new Set(recipients)];

    const html = templates.eventCreatedTemplate({
        title: event.title,
        description: event.description || undefined,
        date: event.date,
        time: event.startTime.toLocaleTimeString(),
        venue: event.venue,
        type: event.type,
    });

    const emails = uniqueRecipients.map(email => ({
        to: email,
        subject: `📅 New Event: ${event.title}`,
        html,
    }));

    return await sendBulkEmails(emails, 100);
}

// 5️⃣ SHOP ORDER PLACED
async function handleOrderPlaced({ orderId }: { orderId: string }) {
    console.log(`🛍️ [ORDER] Processing: ${orderId}`);

    const order = await prisma.jerseyOrder.findUnique({
        where: { id: orderId },
        include: { user: true },
    });

    if (!order) {
        console.warn(`⚠️ [ORDER] Order ${orderId} not found`);
        return;
    }

    const items = [
        { name: 'Jersey', size: order.shirtSize, number: order.jerseyNumber },
        { name: 'Shorts', size: order.shortsSize },
        { name: 'Socks', size: order.socksSize },
    ];

    const customerHtml = templates.orderPlacedTemplate({
        customerName: order.customerName,
        orderId,
        items,
    });

    await sendEmail({
        to: order.email,
        subject: `Order Confirmation - ${orderId}`,
        html: customerHtml,
    });

    const admins = await prisma.admin.findMany({
        where: { isDeleted: false },
        select: { email: true },
    });

    const adminEmails = admins.map(a => a.email).filter(Boolean) as string[];

    if (adminEmails.length > 0) {
        const adminHtml = templates.orderPlacedTemplate({
            customerName: order.customerName,
            orderId,
            items,
            isAdmin: true,
        });

        await sendEmail({
            to: adminEmails,
            subject: `New Order: ${order.customerName}`,
            html: adminHtml,
        });
    }
}

// 6️⃣ STUDENT ATTENDANCE MARKED
async function handleStudentAttendanceMarked({
    studentId,
    date,
    status,
}: {
    studentId: string;
    date: Date;
    status: string;
}) {
    console.log(`✅ [ATTENDANCE] Student ${studentId}: ${status}`);

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { parent: true },
    });

    if (!student) {
        console.warn(`⚠️ [ATTENDANCE] Student ${studentId} not found`);
        return;
    }

    const recipients = [student.email, student.parent.email].filter(Boolean) as string[];

    if (recipients.length === 0) {
        console.warn(`⚠️ [ATTENDANCE] No email for student ${studentId}`);
        return;
    }

    const html = templates.attendanceMarkedTemplate({
        studentName: `${student.firstName} ${student.lastName}`,
        date,
        status: status as any,
        parentName: `${student.parent.firstName} ${student.parent.lastName}`,
    });

    return await sendEmail({
        to: recipients,
        subject: `Attendance Update - ${student.firstName}`,
        html,
    });
}

// 7️⃣ TEACHER ATTENDANCE MARKED
async function handleTeacherAttendanceMarked({
    teacherId,
    date,
    status,
}: {
    teacherId: string;
    date: Date;
    status: string;
}) {
    console.log(`✅ [ATTENDANCE] Teacher ${teacherId}: ${status}`);

    const teacher = await prisma.coach.findUnique({
        where: { id: teacherId },
    });

    if (!teacher || !teacher.email) {
        console.warn(`⚠️ [ATTENDANCE] No email for teacher ${teacherId}`);
        return;
    }

    const html = templates.teacherAttendanceTemplate({
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        date,
        status: status as any,
    });

    return await sendEmail({
        to: teacher.email,
        subject: `Attendance Recorded - ${date.toLocaleDateString()}`,
        html,
    });
}

// 8️⃣ MONTHLY FEE REMINDER (CRITICAL!)
async function handleMonthlyFeeReminder({ month, year }: { month: number; year: number }) {
    console.log(`💰 [FEE REMINDER] Processing for ${month}/${year}`);

    const students = await prisma.student.findMany({
        where: { isDeleted: false },
        include: { parent: true },
    });

    console.log(`💰 [FEE REMINDER] Found ${students.length} active students`);

    const studentsWithUnpaidFees = [];

    for (const student of students) {
        const fee = await prisma.monthlyFee.findUnique({
            where: {
                studentId_month_year: {
                    studentId: student.id,
                    month,
                    year,
                },
            },
        });

        if (!fee || fee.status === 'UNPAID' || fee.status === 'OVERDUE') {
            studentsWithUnpaidFees.push({ student, fee });
        }
    }

    console.log(`💰 [FEE REMINDER] ${studentsWithUnpaidFees.length} students with unpaid fees`);

    const emails = studentsWithUnpaidFees.map(({ student, fee }) => {
        const recipients = [student.parent.email, student.email].filter(Boolean) as string[];

        if (recipients.length === 0) {
            console.warn(`⚠️ [FEE REMINDER] No email for student ${student.firstName}`);
            return null;
        }

        const html = templates.monthlyFeeReminderTemplate({
            studentName: `${student.firstName} ${student.lastName}`,
            month,
            year,
            amount: fee?.amount || 5000,
            dueDate: fee?.dueDate || new Date(),
            parentName: `${student.parent.firstName} ${student.parent.lastName}`,
        });

        return {
            to: recipients,
            subject: `Monthly Fee Reminder - ${student.firstName} ${student.lastName}`,
            html,
        };
    }).filter(Boolean) as Array<{ to: string[]; subject: string; html: string }>;

    if (emails.length === 0) {
        console.log(`✅ [FEE REMINDER] No reminders to send - all fees paid!`);
        return;
    }

    return await sendBulkEmails(emails, 200);
}

// 9️⃣ FEE PAID - Send Confirmation
async function handleFeePaid({ feeId }: { feeId: string }) {
    console.log(`💰 [FEE PAID] Processing: ${feeId}`);

    const fee = await prisma.monthlyFee.findUnique({
        where: { id: feeId },
        include: { student: true, parent: true },
    });

    if (!fee) {
        console.warn(`⚠️ [FEE PAID] Fee ${feeId} not found`);
        return;
    }

    const recipients = [fee.parent.email, fee.student.email].filter(Boolean) as string[];

    if (recipients.length === 0) {
        console.warn(`⚠️ [FEE PAID] No email for fee ${feeId}`);
        return;
    }

    const html = templates.feePaymentConfirmationTemplate({
        studentName: `${fee.student.firstName} ${fee.student.lastName}`,
        month: fee.month,
        year: fee.year,
        amount: fee.paidAmount || fee.amount,
        paidAt: fee.paidAt || new Date(),
        parentName: `${fee.parent.firstName} ${fee.parent.lastName}`,
        receiptNumber: fee.id,
    });

    return await sendEmail({
        to: recipients,
        subject: `Payment Confirmed - ${fee.student.firstName} ${fee.student.lastName}`,
        html,
    });
}
