// ==============================================
// EMAIL TEMPLATES - Production Ready HTML
// ==============================================

const baseStyles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #8B0000, #1E3A8A); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px 20px; }
    .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8B0000, #1E3A8A); color: white; text-decoration: none; border-radius: 8px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
    .highlight { background: #FFF3CD; padding: 15px; border-left: 4px solid #FFC107; margin: 15px 0; }
    .amount { font-size: 36px; font-weight: bold; color: #8B0000; margin: 15px 0; }
   .info-row { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
    .label { font-weight: bold; color: #333; }
    .value { color: #666; }
  </style>
`;

//  1️⃣ MONTHLY FEE REMINDER
export function monthlyFeeReminderTemplate({
  studentName,
  month,
  year,
  amount,
  dueDate,
  parentName,
}: {
  studentName: string;
  month: number;
  year: number;
  amount: number;
  dueDate: Date;
  parentName?: string;
}) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month - 1];

  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚽ Monthly Fee Reminder</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <p>Dear ${parentName || 'Parent'},</p>
          <p>This is a friendly reminder that the monthly fee for <strong>${studentName}</strong> is due.</p>
          
          <div class="info-row">
            <span class="label">Month:</span> <span class="value">${monthName} ${year}</span>
          </div>
          <div class="info-row">
            <span class="label">Due Date:</span> <span class="value">${dueDate.toLocaleDateString()}</span>
          </div>
          
          <div class="amount">PKR ${amount.toLocaleString()}</div>
          
          <div class="highlight">
            <strong>📍 Payment Instructions:</strong><br>
            • Cash payment at academy office<br>
            • Bank transfer to: [Bank Account Details]<br>
            • Please include student name in payment reference
          </div>
          
          <p>If you have already made the payment, please disregard this reminder.</p>
          <p>Thank you for your continued support!</p>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
          <p>Contact: info@patohornetsfootball.com | +92 XXX XXXXXXX</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 2️⃣ FEE PAYMENT CONFIRMATION
export function feePaymentConfirmationTemplate({
  studentName,
  month,
  year,
  amount,
  paidAt,
  parentName,
  receiptNumber,
}: {
  studentName: string;
  month: number;
  year: number;
  amount: number;
  paidAt: Date;
  parentName?: string;
  receiptNumber?: string;
}) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month - 1];

  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Received</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <p>Dear ${parentName || 'Parent'},</p>
          <p>We have successfully received your payment for <strong>${studentName}</strong>.</p>
          
          <div class="info-row">
            <span class="label">Student:</span> <span class="value">${studentName}</span>
          </div>
          <div class="info-row">
            <span class="label">Month:</span> <span class="value">${monthName} ${year}</span>
          </div>
          <div class="info-row">
            <span class="label">Amount Paid:</span> <span class="value">PKR ${amount.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Date:</span> <span class="value">${paidAt.toLocaleString()}</span>
          </div>
          ${receiptNumber ? `
          <div class="info-row">
            <span class="label">Receipt Number:</span> <span class="value">${receiptNumber}</span>
          </div>
          ` : ''}
          
          <p>Thank you for your prompt payment!</p>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 3️⃣ ADMISSION SUBMITTED (Admin Notification)
export function admissionSubmittedAdminTemplate({
  applicantName,
  email,
  phone,
  ageGroup,
  submittedAt,
  admissionId,
}: {
  applicantName: string;
  email?: string;
  phone?: string;
  ageGroup: string;
  submittedAt: Date;
  admissionId: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 New Admission Application</h1>
          <p>Admin Notification</p>
        </div>
        <div class="content">
          <p>A new admission application has been received:</p>
          
          <div class="info-row">
            <span class="label">Applicant:</span> <span class="value">${applicantName}</span>
          </div>
          ${email ? `<div class="info-row"><span class="label">Email:</span> <span class="value">${email}</span></div>` : ''}
          ${phone ? `<div class="info-row"><span class="label">Phone:</span> <span class="value">${phone}</span></div>` : ''}
          <div class="info-row">
            <span class="label">Age Group:</span> <span class="value">${ageGroup}</span>
          </div>
          <div class="info-row">
            <span class="label">Submitted:</span> <span class="value">${submittedAt.toLocaleString()}</span>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/list/admissions" class="button">Review Application</a>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy - Admin Portal</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 4️⃣ ADMISSION STATUS UPDATE (Applicant)
export function admissionStatusTemplate({
  applicantName,
  status,
  message,
}: {
  applicantName: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  message?: string;
}) {
  const statusConfig = {
    UNDER_REVIEW: { emoji: '🔍', title: 'Application Under Review', color: '#FFC107' },
    APPROVED: { emoji: '🎉', title: 'Application Approved!', color: '#4CAF50' },
    REJECTED: { emoji: '❌', title: 'Application Status', color: '#F44336' },
  };

  const config = statusConfig[status];

  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${config.emoji} ${config.title}</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>
          
          ${status === 'APPROVED' ? `
            <p style="font-size: 18px; color: ${config.color}; font-weight: bold;">
              Congratulations! Your admission application has been approved.
            </p>
            <p>Welcome to Pato Hornets Football Academy! We will contact you shortly with next steps.</p>
          ` : status === 'UNDER_REVIEW' ? `
            <p>Your admission application is currently under review. We will notify you once a decision has been made.</p>
          ` : `
            <p>Thank you for your interest in Pato Hornets Football Academy. Unfortunately, we are unable to process your application at this time.</p>
            ${message ? `<p>${message}</p>` : ''}
          `}
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 5️⃣ STUDENT ATTENDANCE MARKED
export function attendanceMarkedTemplate({
  studentName,
  date,
  status,
  parentName,
  teacherName,
}: {
  studentName: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT';
  parentName?: string;
  teacherName?: string;
}) {
  const statusConfig = {
    PRESENT: { emoji: '✅', color: '#4CAF50', message: 'was present at training' },
    ABSENT: { emoji: '❌', color: '#F44336', message: 'was absent from training' },
  };

  const config = statusConfig[status];

  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${config.emoji} Attendance Update</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <p>Dear ${parentName || 'Parent'},</p>
          <p><strong>${studentName}</strong> ${config.message} on <strong>${date.toLocaleDateString()}</strong>.</p>
          
          ${teacherName ? `<p><em>Marked by: Coach ${teacherName}</em></p>` : ''}
          
          ${status === 'ABSENT' ? `
            <div class="highlight">
              If your child was absent due to illness or emergency, please notify the academy.
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 6️⃣ TEACHER ATTENDANCE MARKED
export function teacherAttendanceTemplate({
  teacherName,
  date,
  status,
}: {
  teacherName: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT';
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Attendance Recorded</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <p>Dear Coach ${teacherName},</p>
          <p>Your attendance has been marked as <strong>${status}</strong> for <strong>${date.toLocaleDateString()}</strong>.</p>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 7️⃣ NEW ANNOUNCEMENT
export function announcementTemplate({
  title,
  content,
  priority,
  targetRoles,
}: {
  title: string;
  content: string;
  priority: number;
  targetRoles: string[];
}) {
  const priorityConfig = {
    3: { label: 'HIGH', color: '#F44336', emoji: '🔴' },
    2: { label: 'MEDIUM', color: '#FFC107', emoji: '🟡' },
    1: { label: 'LOW', color: '#2196F3', emoji: '🔵' },
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig[1];

  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 Club News & Announcements</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <div style="background: ${config.color}20; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
            <span style="color: ${config.color}; font-weight: bold;">${config.emoji} ${config.label} PRIORITY</span>
          </div>
          
          <h2 style="color: #333;">${title}</h2>
          <div style="line-height: 1.6; color: #666;">
            ${content}
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            <em>For: ${targetRoles.join(', ')}</em>
          </p>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 8️⃣ NEW EVENT CREATED
export function eventCreatedTemplate({
  title,
  description,
  date,
  time,
  venue,
  type,
}: {
  title: string;
  description?: string;
  date: Date;
  time: string;
  venue: string;
  type: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 New Event Scheduled</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <h2 style="color: #8B0000;">${title}</h2>
          
          ${description ? `<p>${description}</p>` : ''}
          
          <div class="info-row">
            <span class="label">📅 Date:</span> <span class="value">${date.toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="label">⏰ Time:</span> <span class="value">${time}</span>
          </div>
          <div class="info-row">
            <span class="label">📍 Venue:</span> <span class="value">${venue}</span>
          </div>
          <div class="info-row">
            <span class="label">🏷️ Type:</span> <span class="value">${type}</span>
          </div>
          
          <p>Please mark your calendar and plan to attend!</p>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 9️⃣ SHOP ORDER PLACED
export function orderPlacedTemplate({
  customerName,
  orderId,
  items,
  totalAmount,
  isAdmin = false,
}: {
  customerName: string;
  orderId: string;
  items: Array<{ name: string; size: string; number?: number }>;
  totalAmount?: number;
  isAdmin?: boolean;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ ${isAdmin ? 'New Order Received' : 'Order Confirmation'}</h1>
          <p>Pato Hornets Football Academy</p>
        </div>
        <div class="content">
          <p>Dear ${isAdmin ? 'Admin' : customerName},</p>
          <p>${isAdmin ? `New jersey order from ${customerName}` : 'Your jersey order has been received successfully!'}</p>
          
          <div class="info-row">
            <span class="label">Order ID:</span> <span class="value">${orderId}</span>
          </div>
          
          <h3>Order Details:</h3>
          ${items.map(item => `
            <div class="info-row">
              <span class="label">${item.name}:</span> 
              <span class="value">Size ${item.size}${item.number ? `, #${item.number}` : ''}</span>
            </div>
          `).join('')}
          
          ${totalAmount ? `
            <div class="amount">PKR ${totalAmount.toLocaleString()}</div>
          ` : ''}
          
          <p>${isAdmin ? 'Please process this order.' : 'We will contact you shortly regarding delivery and payment.'}</p>
        </div>
        <div class="footer">
          <p>Pato Hornets Football Academy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
