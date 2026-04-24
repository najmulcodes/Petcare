import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
  const safePetName = escapeHtml(opts.petName);
  const safeTaskName = escapeHtml(opts.taskName);
  const safeDueDate = escapeHtml(opts.dueDate);
  const safeNotes = opts.notes ? escapeHtml(opts.notes) : null;

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
    .header h1 { font-size: 22px; font-weight: 700; margin: 8px 0 4px; color: #ff7a5c; }
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
      <p>A care task is coming up for <strong>${safePetName}</strong></p>
    </div>
    <div>
      <div class="detail-row">
        <span class="detail-label">Pet</span>
        <span class="detail-value">${safePetName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type</span>
        <span class="detail-value">${emoji} ${label}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">${label}</span>
        <span class="detail-value">${safeTaskName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date</span>
        <span class="detail-value">${safeDueDate}</span>
      </div>
    </div>
    ${safeNotes ? `<div class="notes-box">📝 <strong>Notes:</strong> ${safeNotes}</div>` : ""}
    <div class="footer">Sent by Whisker Diary · Your pet care companion</div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendReminderEmail(opts: ReminderEmailOptions): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn("Resend API key not configured – skipping reminder email for", opts.petName);
    return;
  }

  const label = opts.taskType === "medication" ? "Medication" : "Vaccination";

  const { error } = await resend.emails.send({
    from: "Whisker Diary <onboarding@resend.dev>", // swap to your domain once verified
    to: opts.to,
    subject: `🐾 Reminder: ${label} for ${opts.petName}`,
    html: buildReminderHtml(opts),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

export async function verifyEmailConnection(): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn("⚠️  Resend API key not set – email disabled");
    return;
  }
  console.log("✅ Resend email ready");
}