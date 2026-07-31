import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, fullName, ticketId } = await request.json();

    if (!email || !fullName || !ticketId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Folago Academy <info@byfayiz.web.id>',
      to: [email],
      subject: `E-Ticket Registrasi: ${ticketId} - Dari Konten Jadi Cuan`,
      html: `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dari Konten Jadi Cuan - E-Ticket & Tactlink</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logos -->
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 30px 20px; border-bottom: 4px solid #22c55e;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Organized by</p>
              <img src="https://raw.githubusercontent.com/fyznugraha-pixel/iwapi/main/public/logo/folago.jpeg" alt="Folago Academy" style="height: 50px; margin-bottom: 20px;" />
              
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">In Collaboration With</p>
              <div style="text-align: center;">
                <img src="https://raw.githubusercontent.com/fyznugraha-pixel/iwapi/main/public/logo/iwapi.png" alt="IWAPI" style="height: 35px; margin: 0 10px; vertical-align: middle;" />
                <img src="https://raw.githubusercontent.com/fyznugraha-pixel/iwapi/main/public/logo/tactlink.png" alt="Tactlink" style="height: 35px; margin: 0 10px; vertical-align: middle;" />
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 800; color: #22c55e; text-align: center;">Pendaftaran Berhasil!</h2>
              <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #18181b;">Halo, ${fullName}!</h3>
              
              <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 24px; color: #3f3f46;">
                Terima kasih telah mendaftar di acara <strong>Dari Konten Jadi Cuan Bersama Folago Academy</strong>. Pendaftaran Anda telah kami catat.
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #3f3f46;">
                Berikut adalah detail E-Ticket Anda:
              </p>

              <!-- Ticket Details -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background: #f0fdf4; border-radius: 8px; overflow: hidden; border: 1px solid #bbf7d0;">
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #bbf7d0; width: 30%;"><b>Ticket ID</b></td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #bbf7d0; font-family: monospace; font-size: 16px; color: #16a34a;"><strong>${ticketId}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #bbf7d0;"><b>Tanggal</b></td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #bbf7d0;">8 Agustus 2026</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #bbf7d0;"><b>Waktu</b></td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #bbf7d0;">10.00 WIB - Selesai</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px;"><b>Lokasi</b></td>
                  <td style="padding: 12px 15px;">
                    Aula Kampus Universitas Dinamika Bangsa Jambi (Kampus Kotabaru)
                  </td>
                </tr>
              </table>

              <!-- Tactlink Section -->
              <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: center;">
                <img src="https://raw.githubusercontent.com/fyznugraha-pixel/iwapi/main/public/logo/tactlink.png" alt="Logo Tactlink" width="120" style="display: block; margin: 0 auto 15px auto; width: 120px; height: auto;" />
                <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #18181b;">Persiapan Check-in</h3>
                <p style="margin: 0 0 15px 0; font-size: 15px; color: #3f3f46; line-height: 22px;">
                  Agar proses masuk ke area event lebih cepat dan lancar tanpa antrean panjang, pastikan Anda sudah
                  mengunduh dan meng-<em>install</em> aplikasi Tactlink di HP Anda.
                </p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 15px;">
                  <tr>
                    <td align="center" valign="middle" style="padding: 10px 0;">
                      <a href="https://play.google.com/store/apps/details?id=com.tactlink.app" style="display: inline-block; margin: 0 10px; vertical-align: middle;">
                        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Dapatkan di Google Play" style="height: 60px; border: 0; display: block;" />
                      </a>
                      <a href="https://apps.apple.com/id/app/tactlink/id1469516661" style="display: inline-block; margin: 0 10px; vertical-align: middle;">
                        <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1276560000" alt="Unduh di App Store" style="height: 40px; border: 0; display: block;" />
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0; font-size: 13px; color: #71717a;">Gunakan email yang sama dengan email registrasi ini untuk login.</p>
              </div>

              <!-- Tutorial Video -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-bottom: 25px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #18181b;">Cara Pakai Tactlink</h3>
                <p style="margin: 0 0 15px 0; font-size: 14px; color: #3f3f46; line-height: 22px;">
                  Tonton video tutorial singkat ini tentang cara registrasi akun dan cara check-in pada saat hari H nanti:
                </p>
                <a href="https://youtube.com/shorts/JuYtU3TVvYo?si=59D_rAYEUXMxZjjj" style="display: inline-block; background-color: #ec3f73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Tonton Tutorial</a>
              </div>

              <p style="margin: 0; font-size: 15px; line-height: 24px; color: #3f3f46; text-align: center;">
                Sampai jumpa di hari H!<br><br>
                Salam hangat,<br>
                <strong>Tim Folago Academy x Tactlink</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 20px;">
                © 2026 Folago Academy.<br>
                Jambi, Indonesia.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
