import { generateBookingPdfBuffer } from "../invoice/generatePdfInvoice";

export interface BookingEmailPayload {
  bookingId: string;
  reference: string;
  source?: string;
  guestName: string;
  phone: string;
  email?: string | null;
  hotel?: string | null;
  notes?: string | null;
  serviceName: string;
  durationMinutes: number;
  date: string;
  time: string;
  guests: number;
  price?: number | null;
}

interface ResendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  attachments?: Array<{
    filename: string;
    content: string; // Base64-encoded string
  }>;
}

/**
 * Send an email using Resend HTTP API directly (0 extra npm dependencies needed).
 */
export async function sendResendEmail(options: ResendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ [Resend Email] RESEND_API_KEY is not configured in environment. Skipping email dispatch.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const toRecipients = Array.isArray(options.to) ? options.to : [options.to];
    
    // Filter out invalid/empty emails
    const validRecipients = toRecipients.filter(
      (email) => typeof email === "string" && email.trim().includes("@")
    );

    if (validRecipients.length === 0) {
      return { success: false, error: "No valid recipient email address" };
    }

    const payload: Record<string, any> = {
      from: options.from,
      to: validRecipients,
      subject: options.subject,
      html: options.html,
    };

    if (options.text) {
      payload.text = options.text;
    }

    if (options.reply_to) {
      payload.reply_to = options.reply_to;
    }

    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(`❌ [Resend Email Error ${response.status}]:`, JSON.stringify(data));
      return { success: false, error: data?.message || `HTTP ${response.status}` };
    }

    console.log(`✉️ [Resend Email Sent]: id=${data.id} to=${validRecipients.join(", ")}`);
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("❌ [Resend Email Network Error]:", err?.message || err);
    return { success: false, error: err?.message || "Unknown email delivery error" };
  }
}

/**
 * Common Header HTML for Teuk Massage & Spa Emails
 */
function getEmailHeader(): string {
  return `
    <!-- Header -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0E110C; border-top-left-radius: 16px; border-top-right-radius: 16px; text-align: center;">
      <tr>
        <td style="padding: 36px 24px 28px 24px;">
          <p style="margin: 0; color: #C9A84C; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600;">
            SIEM REAP · KINGDOM OF CAMBODIA
          </p>
          <h1 style="margin: 10px 0 6px 0; color: #FAF7F2; font-family: Georgia, 'Playfair Display', serif; font-size: 26px; font-weight: 500; letter-spacing: 1px;">
            TEUK MASSAGE &amp; SPA
          </h1>
          <p style="margin: 0; color: #A6A29A; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-style: italic;">
            Sanctuary of Khmer Wellness &amp; Botanical Care
          </p>
        </td>
      </tr>
      <tr>
        <td height="3" style="background: linear-gradient(90deg, #997828 0%, #E5C365 50%, #997828 100%); line-height: 3px; font-size: 3px;">&nbsp;</td>
      </tr>
    </table>
  `;
}

/**
 * Common Footer HTML
 */
function getEmailFooter(): string {
  return `
    <!-- Footer -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #161A13; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; text-align: center;">
      <tr>
        <td style="padding: 28px 24px; color: #A6A29A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 20px;">
          <p style="margin: 0 0 8px 0; color: #C9A84C; font-weight: 600; letter-spacing: 1px; font-size: 11px; text-transform: uppercase;">
            Teuk Massage &amp; Spa
          </p>
          <p style="margin: 0 0 6px 0; color: #D5D1C8;">
            Street 08 (Near Pub Street &amp; Old Market), Krong Siem Reap, Cambodia
          </p>
          <p style="margin: 0 0 12px 0;">
            Opening Hours: Daily · 10:00 AM – 10:00 PM
          </p>
          <p style="margin: 0; font-size: 11px; color: #7A776F;">
            WhatsApp: <a href="https://wa.me/8551770835459" style="color: #C9A84C; text-decoration: none;">+855 17 708 35459</a> &nbsp;·&nbsp;
            Telegram: <a href="https://t.me/TeukSpaBookingBot" style="color: #C9A84C; text-decoration: none;">@TeukSpaBookingBot</a>
          </p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * 1. Admin / Staff Notification Email HTML
 */
export function buildAdminAlertEmailHtml(payload: BookingEmailPayload): string {
  const totalPrice = (payload.price ?? 0) * (payload.guests || 1);
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://teukmassageandspa.com"}/admin/bookings`;
  const cleanPhone = (payload.phone || "").replace(/\D/g, "");
  const waUrl = cleanPhone.startsWith("0")
    ? `https://wa.me/855${cleanPhone.slice(1)}`
    : `https://wa.me/${cleanPhone}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Reservation Alert: ${payload.reference}</title>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #F4EFEB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E2D5; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td>${getEmailHeader()}</td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              
              <!-- Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background-color: #EFE8D6; color: #8F7226; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; border: 1px solid #D8C89D;">
                  NEW RESERVATION ALERT
                </span>
                <h2 style="margin: 12px 0 4px 0; font-family: Georgia, serif; font-size: 24px; color: #22291E; font-weight: 500;">
                  Booking Reference: <span style="color: #8F7226;">${payload.reference}</span>
                </h2>
                <p style="margin: 0; color: #6E6A62; font-size: 13px;">
                  Received via <strong>${payload.source || "Website"}</strong>
                </p>
              </div>

              <!-- Treatment & Schedule Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; border-radius: 12px; border: 1px solid #EAE3D2; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8F7226; font-weight: 600;">Selected Journey</span>
                          <p style="margin: 4px 0 0 0; font-size: 18px; font-family: Georgia, serif; color: #22291E; font-weight: 600;">
                            ${payload.serviceName}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top: 1px solid #EAE3D2; padding-top: 12px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%" style="vertical-align: top; padding-right: 8px;">
                                <span style="font-size: 11px; color: #8A857B; text-transform: uppercase;">Date &amp; Time</span>
                                <p style="margin: 2px 0 0 0; font-size: 14px; color: #22291E; font-weight: 600;">
                                  📅 ${payload.date}
                                </p>
                                <p style="margin: 2px 0 0 0; font-size: 14px; color: #8F7226; font-weight: 600;">
                                  ⏰ ${payload.time} (${payload.durationMinutes} mins)
                                </p>
                              </td>
                              <td width="50%" style="vertical-align: top; padding-left: 8px;">
                                <span style="font-size: 11px; color: #8A857B; text-transform: uppercase;">Party &amp; Price</span>
                                <p style="margin: 2px 0 0 0; font-size: 14px; color: #22291E; font-weight: 600;">
                                  👥 ${payload.guests} Guest${payload.guests > 1 ? "s" : ""}
                                </p>
                                <p style="margin: 2px 0 0 0; font-size: 15px; color: #2E5A27; font-weight: 700;">
                                  💵 $${totalPrice} USD
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Guest Information Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAE3D2; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 12px 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #8F7226; font-weight: 700;">
                      Guest Details
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 24px; color: #22291E;">
                      <tr>
                        <td width="35%" style="color: #7A756C;">Full Name:</td>
                        <td width="65%" style="font-weight: 600;">${payload.guestName}</td>
                      </tr>
                      <tr>
                        <td style="color: #7A756C;">Phone / WhatsApp:</td>
                        <td style="font-weight: 600;">
                          <a href="${waUrl}" style="color: #2E5A27; text-decoration: none;">${payload.phone}</a>
                        </td>
                      </tr>
                      ${payload.email ? `
                      <tr>
                        <td style="color: #7A756C;">Email:</td>
                        <td><a href="mailto:${payload.email}" style="color: #8F7226; text-decoration: none;">${payload.email}</a></td>
                      </tr>
                      ` : ""}
                      ${payload.hotel ? `
                      <tr>
                        <td style="color: #7A756C;">Hotel / Villa:</td>
                        <td style="font-weight: 500;">🏨 ${payload.hotel}</td>
                      </tr>
                      ` : ""}
                      ${payload.notes ? `
                      <tr>
                        <td style="color: #7A756C; vertical-align: top;">Special Requests:</td>
                        <td style="color: #555148; font-style: italic; background-color: #FAF7F2; padding: 6px 10px; border-radius: 6px;">${payload.notes}</td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${adminUrl}" style="display: block; width: 85%; background-color: #22291E; color: #FAF7F2; text-decoration: none; padding: 14px 20px; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 30px; text-align: center; box-shadow: 0 4px 12px rgba(34,41,30,0.2);">
                      Manage in Admin Dashboard &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${waUrl}" style="display: inline-block; color: #25D366; text-decoration: none; font-size: 13px; font-weight: 600;">
                      💬 Open WhatsApp Chat with Guest
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>${getEmailFooter()}</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 2. Guest Reservation Received Email HTML
 */
export function buildGuestReceivedEmailHtml(payload: BookingEmailPayload): string {
  const totalPrice = (payload.price ?? 0) * (payload.guests || 1);
  const waConciergeUrl = `https://wa.me/8551770835459?text=Hello%2C%20I%20have%20a%20question%20about%20my%20booking%20${payload.reference}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Spa Reservation Request - Teuk Massage &amp; Spa</title>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #F4EFEB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E2D5; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td>${getEmailHeader()}</td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 30px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 6px 0; color: #C9A84C; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
                CHOUM REAP SOUR · WARM WELCOME
              </p>
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 26px; color: #22291E; font-weight: 500;">
                Dear ${payload.guestName},
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #524E46; font-weight: 300;">
                Thank you for choosing <strong>Teuk Massage &amp; Spa</strong>. We have successfully received your reservation request. Our spa concierge team is currently preparing your sanctuary and will confirm your appointment shortly.
              </p>

              <!-- Reference Callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; border-radius: 12px; border: 1px solid #EAE3D2; margin-bottom: 28px; text-align: center;">
                <tr>
                  <td style="padding: 18px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8F7226; font-weight: 700;">
                      Your Booking Reference
                    </p>
                    <p style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #22291E; font-weight: 600; letter-spacing: 1px;">
                      ${payload.reference}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Journey Summary -->
              <h3 style="margin: 0 0 12px 0; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #8F7226; font-weight: 700;">
                Reservation Summary
              </h3>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #EAE3D2; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
                <tr style="background-color: #FAF7F2;">
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; width: 40%; border-bottom: 1px solid #EAE3D2;">Treatment / Journey</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; width: 60%; border-bottom: 1px solid #EAE3D2;">${payload.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; border-bottom: 1px solid #EAE3D2;">Date</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; border-bottom: 1px solid #EAE3D2;">📅 ${payload.date}</td>
                </tr>
                <tr style="background-color: #FAF7F2;">
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; border-bottom: 1px solid #EAE3D2;">Time &amp; Duration</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; border-bottom: 1px solid #EAE3D2;">⏰ ${payload.time} (${payload.durationMinutes} minutes)</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; border-bottom: 1px solid #EAE3D2;">Number of Guests</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; border-bottom: 1px solid #EAE3D2;">👥 ${payload.guests} Guest${payload.guests > 1 ? "s" : ""}</td>
                </tr>
                <tr style="background-color: #FAF7F2;">
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C;">Estimated Total</td>
                  <td style="padding: 14px 18px; font-size: 16px; color: #2E5A27; font-weight: 700;">$${totalPrice} USD <span style="font-size: 11px; font-weight: normal; color: #7A756C;">(Pay at Spa)</span></td>
                </tr>
              </table>

              <!-- Helpful Tips -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7FAF6; border: 1px solid #D5E5D3; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 6px 0; color: #2E5A27; font-weight: 600; font-size: 13px;">
                      🌿 Spa Ritual Preparation
                    </p>
                    <p style="margin: 0; color: #4B6347; font-size: 13px; line-height: 20px;">
                      We recommend arriving <strong>10–15 minutes prior</strong> to your scheduled time to unwind with our complimentary iced lemongrass welcome drink and herbal foot soak ceremony.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Concierge CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 12px;">
                <tr>
                  <td>
                    <a href="${waConciergeUrl}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; border-radius: 30px; box-shadow: 0 4px 12px rgba(37,211,102,0.25);">
                      💬 Message Concierge on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>${getEmailFooter()}</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 3. Guest Booking Confirmed Email HTML
 */
export function buildGuestConfirmedEmailHtml(payload: BookingEmailPayload): string {
  const totalPrice = (payload.price ?? 0) * (payload.guests || 1);
  const waConciergeUrl = `https://wa.me/8551770835459?text=Hello%2C%20regarding%20my%20confirmed%20booking%20${payload.reference}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Reservation is Confirmed - Teuk Massage &amp; Spa</title>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #F4EFEB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E2D5; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td>${getEmailHeader()}</td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 30px;">
              
              <!-- Confirmation Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background-color: #E2F2E1; color: #22641E; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 18px; border-radius: 20px; border: 1px solid #B8E0B6;">
                  ✓ RESERVATION CONFIRMED
                </span>
                <h2 style="margin: 14px 0 6px 0; font-family: Georgia, serif; font-size: 26px; color: #22291E; font-weight: 500;">
                  We Look Forward to Welcoming You
                </h2>
                <p style="margin: 0; color: #6E6A62; font-size: 14px;">
                  Booking Reference: <strong style="color: #8F7226;">${payload.reference}</strong>
                </p>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #524E46; font-weight: 300;">
                Dear <strong>${payload.guestName}</strong>, your sanctuary has been prepared. Your appointment at Teuk Massage &amp; Spa has been officially confirmed by our team.
              </p>

              <!-- Journey Summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #EAE3D2; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
                <tr style="background-color: #FAF7F2;">
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; width: 40%; border-bottom: 1px solid #EAE3D2;">Treatment</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; width: 60%; border-bottom: 1px solid #EAE3D2;">${payload.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; border-bottom: 1px solid #EAE3D2;">Date</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; border-bottom: 1px solid #EAE3D2;">📅 ${payload.date}</td>
                </tr>
                <tr style="background-color: #FAF7F2;">
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; border-bottom: 1px solid #EAE3D2;">Confirmed Time</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; border-bottom: 1px solid #EAE3D2;">⏰ ${payload.time} (${payload.durationMinutes} mins)</td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C; border-bottom: 1px solid #EAE3D2;">Guests</td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #22291E; font-weight: 600; border-bottom: 1px solid #EAE3D2;">👥 ${payload.guests} Guest${payload.guests > 1 ? "s" : ""}</td>
                </tr>
                <tr style="background-color: #FAF7F2;">
                  <td style="padding: 14px 18px; font-size: 13px; color: #7A756C;">Total Payable</td>
                  <td style="padding: 14px 18px; font-size: 16px; color: #2E5A27; font-weight: 700;">$${totalPrice} USD <span style="font-size: 11px; font-weight: normal; color: #7A756C;">(Pay at Spa upon arrival)</span></td>
                </tr>
              </table>

              <!-- Location & Directions -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; border-radius: 12px; border: 1px solid #EAE3D2; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8F7226; font-weight: 700;">
                      Sanctuary Location
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #22291E; font-weight: 600;">
                      Teuk Massage &amp; Spa
                    </p>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #6E6A62; line-height: 20px;">
                      Street 08 (Near Pub Street &amp; Old Market), Krong Siem Reap, Cambodia.<br>
                      <em>A few steps from riverside, tucked into a peaceful private garden.</em>
                    </p>
                    <a href="https://maps.google.com/?q=Siem+Reap+Cambodia+Pub+Street" target="_blank" style="display: inline-block; font-size: 12px; color: #8F7226; font-weight: 600; text-decoration: underline;">
                      📍 View on Google Maps &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Concierge CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="text-align: center;">
                <tr>
                  <td>
                    <a href="${waConciergeUrl}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; border-radius: 30px; box-shadow: 0 4px 12px rgba(37,211,102,0.25);">
                      💬 WhatsApp Concierge
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>${getEmailFooter()}</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Primary Dispatcher: Send email notifications when a new booking is requested.
 * Sends to BOTH:
 * 1. Spa Administration / Staff (e.g. hello@teukmassage.com or ADMIN_NOTIFICATION_EMAIL)
 * 2. Customer / Guest (if customer provided their email in booking form)
 */
export async function sendBookingEmailNotifications(payload: BookingEmailPayload) {
  const fromEmail = process.env.EMAIL_FROM || "Teuk Massage & Spa <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.BOOKING_ALERT_EMAIL || "hello@teukmassage.com";

  console.log(`[Email Service] Processing reservation emails for ref ${payload.reference}...`);

  // 1. Send Alert to Admin / Staff
  const adminSubject = `🔔 New Booking Alert [${payload.reference}] - ${payload.serviceName} (${payload.guestName})`;
  const adminHtml = buildAdminAlertEmailHtml(payload);
  
  const adminResult = await sendResendEmail({
    from: fromEmail,
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
  });

  // 2. Send Received Confirmation to Guest (if email provided)
  let guestResult = null;
  if (payload.email && payload.email.trim().includes("@")) {
    const guestSubject = `✨ Your Spa Reservation Request [${payload.reference}] - Teuk Massage & Spa`;
    const guestHtml = buildGuestReceivedEmailHtml(payload);

    guestResult = await sendResendEmail({
      from: fromEmail,
      to: payload.email.trim(),
      subject: guestSubject,
      html: guestHtml,
      reply_to: adminEmail,
    });
  }

  return { adminResult, guestResult };
}

/**
 * Status Update Dispatcher: Send email when booking status changes to "confirmed"
 */
export async function sendBookingStatusEmail(payload: BookingEmailPayload, newStatus: string) {
  if (!payload.email || !payload.email.trim().includes("@")) {
    return { success: false, reason: "No guest email provided" };
  }

  const fromEmail = process.env.EMAIL_FROM || "Teuk Massage & Spa <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.BOOKING_ALERT_EMAIL || "hello@teukmassage.com";

  if (newStatus === "confirmed") {
    const subject = `🌿 Reservation Confirmed [${payload.reference}] - Teuk Massage & Spa`;
    const html = buildGuestConfirmedEmailHtml(payload);

    // Generate PDF invoice attachment if possible
    let attachments: Array<{ filename: string; content: string }> | undefined = undefined;
    try {
      const pdfBuffer = await generateBookingPdfBuffer({
        reference: payload.reference,
        guestName: payload.guestName,
        phone: payload.phone,
        email: payload.email,
        hotel: payload.hotel,
        notes: payload.notes,
        serviceName: payload.serviceName,
        durationMinutes: payload.durationMinutes,
        date: payload.date,
        time: payload.time,
        guests: payload.guests,
        price: payload.price,
      });

      if (pdfBuffer && pdfBuffer.length > 0) {
        attachments = [
          {
            filename: `Teuk-Spa-Confirmation-${payload.reference}.pdf`,
            content: pdfBuffer.toString("base64"),
          },
        ];
      }
    } catch (pdfErr) {
      console.warn("Could not generate PDF invoice for confirmed email attachment:", pdfErr);
    }

    return await sendResendEmail({
      from: fromEmail,
      to: payload.email.trim(),
      subject,
      html,
      reply_to: adminEmail,
      attachments,
    });
  }

  return { success: false, reason: `No email template for status: ${newStatus}` };
}
