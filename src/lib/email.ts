export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "AngelBook <noreply@angelbook.org>";

  if (!apiKey) {
    console.log("=========================================");
    console.log("EMAIL SIMULATION (No RESEND_API_KEY set):");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, " ")}`);
    console.log("=========================================");
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Resend API returned status ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error };
  }
}
