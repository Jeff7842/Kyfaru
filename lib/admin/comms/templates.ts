// ============================================================
// Transactional email templates (simple branded HTML).
// ============================================================

const SHELL = (heading: string, body: string) => `
  <div style="font-family:Inter,Arial,sans-serif;background:#f6f7f6;padding:32px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eceeec">
      <div style="background:#0b7350;padding:20px 28px">
        <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.5px">KYFARU</span>
      </div>
      <div style="padding:28px">
        <h1 style="font-size:18px;color:#16231d;margin:0 0 12px">${heading}</h1>
        ${body}
      </div>
      <div style="padding:18px 28px;border-top:1px solid #eceeec;color:#8a948f;font-size:12px">
        Kyfaru · Nairobi, Kenya · <a href="https://kyfaru.com" style="color:#0b7350">kyfaru.com</a>
      </div>
    </div>
  </div>`

const p = (t: string) => `<p style="font-size:14px;color:#3a443f;line-height:1.6;margin:0 0 12px">${t}</p>`

export function contactAckEmail(name: string) {
  return {
    subject: 'We received your message — Kyfaru',
    html: SHELL(
      `Thanks for reaching out, ${name || 'there'}!`,
      p('We have received your message and a member of our team will get back to you shortly — usually within one business day.') +
        p('In the meantime, feel free to explore our work at kyfaru.com.') +
        p('— The Kyfaru Team'),
    ),
  }
}

export function quoteAckEmail(name: string) {
  return {
    subject: 'Your quote request was received — Kyfaru',
    html: SHELL(
      `Thanks, ${name || 'there'} — your request is in!`,
      p('We have received your project quotation request. Our team will review the details and send you a tailored proposal with timelines and pricing within 24 hours.') +
        p('A dedicated project agent may also reach out by phone to learn more about your needs.') +
        p('— The Kyfaru Team'),
    ),
  }
}

export function contactNotifyEmail(fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;color:#8a948f;font-size:12px;text-transform:capitalize">${k}</td><td style="padding:6px 10px;font-size:13px;color:#16231d">${v}</td></tr>`,
    )
    .join('')
  return {
    subject: `New enquiry: ${fields.topic || fields.service || 'General'} — ${fields.name || fields.email}`,
    html: SHELL(
      'New website enquiry',
      `<table style="width:100%;border-collapse:collapse;border:1px solid #eceeec;border-radius:8px">${rows}</table>`,
    ),
  }
}
