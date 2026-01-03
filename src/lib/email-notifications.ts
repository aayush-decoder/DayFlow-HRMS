import { mailer } from "@/lib/mailer";
import { format } from "date-fns";

interface LeaveNotificationData {
  employeeName: string;
  employeeEmail: string;
  leaveType: string;
  duration: string;
  fromDate: string;
  toDate: string;
  daysCount: number;
  reason?: string;
  status: "APPROVED" | "REJECTED";
  adminName?: string;
}

export async function sendLeaveStatusNotification(data: LeaveNotificationData) {
  const {
    employeeName,
    employeeEmail,
    leaveType,
    duration,
    fromDate,
    toDate,
    daysCount,
    reason,
    status,
    adminName = "HR Team"
  } = data;

  const isApproved = status === "APPROVED";
  const statusText = isApproved ? "Approved" : "Rejected";
  const statusColor = isApproved ? "#059669" : "#DC2626";
  const statusBgColor = isApproved ? "#D1FAE5" : "#FEE2E2";
  const statusIcon = isApproved ? "✅" : "❌";

  const formattedFromDate = format(new Date(fromDate), "MMM dd, yyyy");
  const formattedToDate = format(new Date(toDate), "MMM dd, yyyy");

  const subject = `${statusIcon} Leave Request ${statusText} - ${formattedFromDate}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leave Request ${statusText}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">DayFlow</h1>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Employee Management System</p>
      </div>

      <!-- Status Banner -->
      <div style="background-color: ${statusBgColor}; border-left: 4px solid ${statusColor}; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
        <h2 style="color: ${statusColor}; margin: 0 0 10px 0; font-size: 24px;">
          ${statusIcon} Leave Request ${statusText}
        </h2>
        <p style="margin: 0; color: ${statusColor}; font-weight: 500;">
          Your leave request has been ${status.toLowerCase()} by ${adminName}.
        </p>
      </div>

      <!-- Employee Info -->
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin: 0 0 15px 0;">Leave Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280; width: 30%;">Employee:</td>
            <td style="padding: 8px 0; color: #111827;">${employeeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">Leave Type:</td>
            <td style="padding: 8px 0; color: #111827;">
              <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                ${leaveType}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">Duration:</td>
            <td style="padding: 8px 0; color: #111827;">${duration.replace('_', ' ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">From Date:</td>
            <td style="padding: 8px 0; color: #111827;">${formattedFromDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">To Date:</td>
            <td style="padding: 8px 0; color: #111827;">${formattedToDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">Total Days:</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${daysCount} day${daysCount !== 1 ? 's' : ''}</td>
          </tr>
          ${reason ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280; vertical-align: top;">Reason:</td>
            <td style="padding: 8px 0; color: #111827;">${reason}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${isApproved ? `
      <!-- Approval Message -->
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="color: #065f46; margin: 0 0 10px 0;">✅ Your leave has been approved!</h4>
        <p style="color: #047857; margin: 0;">
          You can now take your leave as requested. Please ensure proper handover of your responsibilities before your leave begins.
        </p>
      </div>
      ` : `
      <!-- Rejection Message -->
      <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="color: #991b1b; margin: 0 0 10px 0;">❌ Your leave request has been rejected</h4>
        <p style="color: #dc2626; margin: 0;">
          Please contact your manager or HR team for more information about the rejection. You may resubmit your request with necessary modifications.
        </p>
      </div>
      `}

      <!-- Next Steps -->
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="color: #1e40af; margin: 0 0 10px 0;">📋 Next Steps</h4>
        <ul style="color: #1e3a8a; margin: 0; padding-left: 20px;">
          ${isApproved ? `
          <li>Mark your calendar for the approved leave dates</li>
          <li>Complete any pending work before your leave</li>
          <li>Inform your team about your absence</li>
          <li>Set up an out-of-office message if needed</li>
          ` : `
          <li>Contact your manager for clarification on the rejection</li>
          <li>Review company leave policies</li>
          <li>Consider resubmitting with modifications if applicable</li>
          <li>Plan alternative dates if needed</li>
          `}
        </ul>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
          This is an automated notification from DayFlow Employee Management System
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          If you have any questions, please contact your HR team or manager.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
          Sent on ${format(new Date(), "PPP 'at' p")}
        </p>
      </div>

    </body>
    </html>
  `;

  const textContent = `
DayFlow - Leave Request ${statusText}

${statusIcon} Your leave request has been ${status.toLowerCase()} by ${adminName}.

Leave Details:
- Employee: ${employeeName}
- Leave Type: ${leaveType}
- Duration: ${duration.replace('_', ' ')}
- From Date: ${formattedFromDate}
- To Date: ${formattedToDate}
- Total Days: ${daysCount} day${daysCount !== 1 ? 's' : ''}
${reason ? `- Reason: ${reason}` : ''}

${isApproved ? `
✅ Your leave has been approved!
You can now take your leave as requested. Please ensure proper handover of your responsibilities before your leave begins.

Next Steps:
- Mark your calendar for the approved leave dates
- Complete any pending work before your leave
- Inform your team about your absence
- Set up an out-of-office message if needed
` : `
❌ Your leave request has been rejected
Please contact your manager or HR team for more information about the rejection. You may resubmit your request with necessary modifications.

Next Steps:
- Contact your manager for clarification on the rejection
- Review company leave policies
- Consider resubmitting with modifications if applicable
- Plan alternative dates if needed
`}

---
This is an automated notification from DayFlow Employee Management System
If you have any questions, please contact your HR team or manager.
Sent on ${format(new Date(), "PPP 'at' p")}
  `;

  try {
    const info = await mailer.sendMail({
      from: `"DayFlow HR" <${process.env.EMAIL_USER}>`,
      to: employeeEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    console.log(`✅ Leave notification email sent to ${employeeEmail}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Status: ${statusText}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send leave notification email to ${employeeEmail}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Additional function for leave application confirmation
export async function sendLeaveApplicationConfirmation(data: Omit<LeaveNotificationData, 'status' | 'adminName'>) {
  const {
    employeeName,
    employeeEmail,
    leaveType,
    duration,
    fromDate,
    toDate,
    daysCount,
    reason
  } = data;

  const formattedFromDate = format(new Date(fromDate), "MMM dd, yyyy");
  const formattedToDate = format(new Date(toDate), "MMM dd, yyyy");

  const subject = `📝 Leave Application Received - ${formattedFromDate}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leave Application Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">DayFlow</h1>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Employee Management System</p>
      </div>

      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
        <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 24px;">
          📝 Leave Application Received
        </h2>
        <p style="margin: 0; color: #92400e; font-weight: 500;">
          Your leave application has been submitted and is pending approval.
        </p>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin: 0 0 15px 0;">Application Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280; width: 30%;">Employee:</td>
            <td style="padding: 8px 0; color: #111827;">${employeeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">Leave Type:</td>
            <td style="padding: 8px 0; color: #111827;">
              <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                ${leaveType}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">Duration:</td>
            <td style="padding: 8px 0; color: #111827;">${duration.replace('_', ' ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">From Date:</td>
            <td style="padding: 8px 0; color: #111827;">${formattedFromDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">To Date:</td>
            <td style="padding: 8px 0; color: #111827;">${formattedToDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280;">Total Days:</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${daysCount} day${daysCount !== 1 ? 's' : ''}</td>
          </tr>
          ${reason ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 500; color: #6b7280; vertical-align: top;">Reason:</td>
            <td style="padding: 8px 0; color: #111827;">${reason}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="color: #1e40af; margin: 0 0 10px 0;">⏳ What happens next?</h4>
        <ul style="color: #1e3a8a; margin: 0; padding-left: 20px;">
          <li>Your manager/HR will review your application</li>
          <li>You'll receive an email notification once it's processed</li>
          <li>You can check the status in your dashboard</li>
          <li>Processing typically takes 1-2 business days</li>
        </ul>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
          This is an automated confirmation from DayFlow Employee Management System
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
          Sent on ${format(new Date(), "PPP 'at' p")}
        </p>
      </div>

    </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"DayFlow HR" <${process.env.EMAIL_USER}>`,
      to: employeeEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log(`✅ Leave application confirmation sent to ${employeeEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send leave application confirmation:`, error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}