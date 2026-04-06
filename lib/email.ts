import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM = process.env.EMAIL_FROM || "onboarding@yourdomain.com";

// ─── Email Templates ────────────────────────────────────────────────────────

function contractSignedTemplate(data: {
    clientName: string;
    contractTitle: string;
    amount: number;
    currency: string;
    startDate: string;
    freelancerName: string;
}) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contract Signed</title>
</head>
<body style="background:#0f172a;color:#e2e8f0;font-family:'Inter',sans-serif;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#1e293b;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px 48px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">✍️</div>
      <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0;">Contract Signed!</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">Your contract is now active</p>
    </div>
    <div style="padding:40px 48px;">
      <p style="font-size:16px;color:#94a3b8;margin:0 0 24px;">Hi <strong style="color:#e2e8f0;">${data.clientName}</strong>,</p>
      <p style="font-size:16px;color:#94a3b8;margin:0 0 32px;line-height:1.6;">
        Your contract <strong style="color:#e2e8f0;">"${data.contractTitle}"</strong> has been signed and is now active.
      </p>
      <div style="background:#0f172a;border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Contract</td>
            <td style="padding:10px 0;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;">${data.contractTitle}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Value</td>
            <td style="padding:10px 0;color:#a78bfa;font-size:14px;font-weight:700;text-align:right;">${data.amount.toLocaleString('en-US', { style: 'currency', currency: data.currency })}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Start Date</td>
            <td style="padding:10px 0;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;">${data.startDate}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Freelancer</td>
            <td style="padding:10px 0;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;">${data.freelancerName}</td>
          </tr>
        </table>
      </div>
    </div>
    <div style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">Powered by <strong style="color:#4f46e5;">FreelanceOS</strong></p>
    </div>
  </div>
</body>
</html>`;
}

function invoiceSentTemplate(data: {
    clientName: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    dueDate: string;
    freelancerName: string;
}) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Invoice Ready</title></head>
<body style="background:#0f172a;color:#e2e8f0;font-family:'Inter',sans-serif;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#1e293b;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
    <div style="background:linear-gradient(135deg,#0891b2,#4f46e5);padding:40px 48px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">📄</div>
      <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0;">Invoice Ready</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">${data.invoiceNumber}</p>
    </div>
    <div style="padding:40px 48px;">
      <p style="font-size:16px;color:#94a3b8;margin:0 0 32px;line-height:1.6;">
        Hi <strong style="color:#e2e8f0;">${data.clientName}</strong>, an invoice has been created. Payment is due by <strong style="color:#e2e8f0;">${data.dueDate}</strong>.
      </p>
      <div style="background:linear-gradient(135deg,#0891b2,#4f46e5);border-radius:16px;padding:32px;margin-bottom:32px;text-align:center;">
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Amount Due</p>
        <div style="color:#fff;font-size:42px;font-weight:800;margin:0;">${data.amount.toLocaleString('en-US', { style: 'currency', currency: data.currency })}</div>
      </div>
      <div style="background:#0f172a;border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Invoice #</td>
            <td style="padding:10px 0;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;">${data.invoiceNumber}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Due Date</td>
            <td style="padding:10px 0;color:#f59e0b;font-size:14px;font-weight:600;text-align:right;">${data.dueDate}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">From</td>
            <td style="padding:10px 0;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;">${data.freelancerName}</td>
          </tr>
        </table>
      </div>
    </div>
    <div style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">Powered by <strong style="color:#4f46e5;">FreelanceOS</strong></p>
    </div>
  </div>
</body>
</html>`;
}

function invoicePaidTemplate(data: {
    clientName: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    freelancerName: string;
}) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Payment Confirmed</title></head>
<body style="background:#0f172a;color:#e2e8f0;font-family:'Inter',sans-serif;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#1e293b;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
    <div style="background:linear-gradient(135deg,#059669,#0891b2);padding:40px 48px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">✅</div>
      <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0;">Payment Confirmed!</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">Thank you for your payment</p>
    </div>
    <div style="padding:40px 48px;">
      <p style="font-size:16px;color:#94a3b8;margin:0 0 32px;line-height:1.6;">
        Hi <strong style="color:#e2e8f0;">${data.clientName}</strong>, we've received your payment for invoice <strong style="color:#e2e8f0;">${data.invoiceNumber}</strong>.
      </p>
      <div style="background:#0f172a;border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Invoice #</td>
            <td style="padding:10px 0;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;">${data.invoiceNumber}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Amount Paid</td>
            <td style="padding:10px 0;color:#10b981;font-size:16px;font-weight:800;text-align:right;">${data.amount.toLocaleString('en-US', { style: 'currency', currency: data.currency })}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:10px 0;color:#64748b;font-size:14px;">Status</td>
            <td style="padding:10px 0;text-align:right;"><span style="background:#10b981;color:#fff;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;">PAID</span></td>
          </tr>
        </table>
      </div>
    </div>
    <div style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">Powered by <strong style="color:#4f46e5;">FreelanceOS</strong></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function checkApiKey() {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === "SG.your_key_here") {
        throw new Error("SENDGRID_API_KEY is not configured. Please add it to your .env file.");
    }
}

// ─── Send Functions ─────────────────────────────────────────────────────────

export async function sendContractSignedEmail(data: {
    to: string;
    clientName: string;
    contractTitle: string;
    amount: number;
    currency: string;
    startDate: string;
    freelancerName: string;
}) {
    checkApiKey();
    return sgMail.send({
        from: FROM,
        to: data.to,
        subject: `✍️ Contract Signed: ${data.contractTitle}`,
        html: contractSignedTemplate(data),
    });
}

export async function sendInvoiceEmail(data: {
    to: string;
    clientName: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    dueDate: string;
    freelancerName: string;
}) {
    checkApiKey();
    return sgMail.send({
        from: FROM,
        to: data.to,
        subject: `📄 Invoice ${data.invoiceNumber} – Due ${data.dueDate}`,
        html: invoiceSentTemplate(data),
    });
}

export async function sendPaymentConfirmedEmail(data: {
    to: string;
    clientName: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    freelancerName: string;
}) {
    checkApiKey();
    return sgMail.send({
        from: FROM,
        to: data.to,
        subject: `✅ Payment Confirmed – ${data.invoiceNumber}`,
        html: invoicePaidTemplate(data),
    });
}
