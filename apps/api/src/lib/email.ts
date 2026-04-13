import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export interface ReminderEmailOptions {
  to: string;
  petName: string;
  taskType: "medication" | "vaccination";
  taskName: string;
  dueDate: string;
  notes?: string | null;
}

function buildReminderHtml(opts: ReminderEmailOptions): string {
  const emoji = opts.taskType === "medication" ? "💊" : "💉";
  const label = opts.taskType === "medication" ? "Medication" : "Vaccination";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reminder – Whisker Diary</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 32px 16px; color: #111827; }
    .card { background: #ffffff; border-radius: 16px; max-width: 480px; margin: 0 auto; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { text-align: center; margin-bottom: 24px; }
    .header .icon { font-size: 48px; }
    .header h1 { font-size: 22px; font-weight: 700; margin: 8px 0 4px; color: #0369a1; }
    .header p { color: #6b7280; font-size: 14px; margin: 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; }
    .detail-value { font-weight: 600; color: #111827; }
    .notes-box { background: #fefce8; border-radius: 8px; padding: 12px 14px; margin-top: 20px; font-size: 13px; color: #713f12; }
    .footer { text-align: center; margin-top: 28px; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="icon">🐾</div>
      <h1>Whisker Diary Reminder</h1>
      <p>A care task is coming up for <strong>${opts.petName}</strong></p>
    </div>
    <div>
      <div class="detail-row">
        <span class="detail-label">Pet</span>
        <span class="detail-value">${opts.petName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type</span>
        <span class="detail-value">${emoji} ${label}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">${label}</span>
        <span class="detail-value">${opts.taskName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date</span>
        <span class="detail-value">${opts.dueDate}</span>
      </div>
    </div>
    ${opts.notes ? `<div class="notes-box">📝 <strong>Notes:</strong> ${opts.notes}</div>` : ""}
    <div class="footer">Sent by Whisker Diary · Your pet care companion</div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendReminderEmail(opts: ReminderEmailOptions): Promise<void> {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn("Email not configured – skipping reminder email for", opts.petName);
    return;
  }

  const label = opts.taskType === "medication" ? "Medication" : "Vaccination";

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: opts.to,
    subject: `🐾 Reminder: ${label} for ${opts.petName}`,
    html: buildReminderHtml(opts),
  });
}

export async function verifyEmailConnection(): Promise<void> {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) return;
  try {
    await transporter.verify();
    console.log("✅ Email transport ready");
  } catch (err) {
    console.warn("⚠️  Email transport not available:", (err as Error).message);
  }
}
