import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { bookingToOwnerDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async requestResetPassword(payload: {
    url: string;
    email: string;
  }): Promise<void> {
    try {
      const { url, email } = payload;

      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9ff;
              color: #000000;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px;
            }
            .header img {
              width: 80px;
              margin-bottom: 20px;
            }
            .content {
              line-height: 1.6;
              font-size: 16px;
              color: #555555;
            }
            .content h1 {
              text-align: center;
              color: #333333;
            }
            .content p {
              margin: 15px 0;
            }
            .cta {
              text-align: center;
              margin: 30px 0;
            }
            .cta a {
              text-decoration: none;
              color: #ffffff;
              background-color: #fdb441;
              padding: 12px 24px;
              border-radius: 25px;
              font-size: 16px;
              display: inline-block;
            }
            .cta a:hover {
              background-color: #e89c35;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              font-size: 14px;
              color: #888888;
            }
            .footer a {
              color: #0000ee;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header Section -->
            <div class="header">
              <img src="cid:lockIcon" alt="Reset Password Icon" />
              <h1>Reset Password Anda</h1>
            </div>

            <!-- Content Section -->
            <div class="content">
              <p>Halo,</p>
              <p>Anda telah meminta untuk mereset kata sandi akun Anda. Klik tombol di bawah ini untuk mengatur ulang kata sandi Anda:</p>
              <div class="cta">
                <a href="${url}" target="_blank">Reset Password</a>
              </div>
              <p><strong>Catatan:</strong> Tautan ini bersifat rahasia dan hanya boleh digunakan oleh Anda. Jangan bagikan tautan ini kepada siapapun demi keamanan akun Anda.</p>
              <p>Jika Anda tidak meminta reset kata sandi ini, abaikan email ini atau hubungi tim dukungan kami.</p>
            </div>

            <!-- Footer Section -->
            <div class="footer">
              <p>TourWeb | <a href="https://example.com/privacy">Kebijakan Privasi</a> | <a href="https://example.com/help">Bantuan</a></p>
              <p>&copy; 2024 TourWeb. Semua hak dilindungi.</p>
            </div>
          </div>
        </body>
        </html>
`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Password Anda',
        html: htmlTemplate,
        attachments: [
          {
            filename: 'lock-icon.png',
            path: 'auth-api/images/email/image-1.png', // Adjust with actual path
            cid: 'lockIcon',
          },
        ],
      });

      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Error sending email to `, error);
      throw error;
    }
  }

  async sendOrderPackageTourToOwner(payload: bookingToOwnerDto) {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Confirmation</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            background-color: #f9f9ff;
            color: #000;
            margin: 0;
            padding: 0;
            }
            .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
            text-align: center;
            padding: 20px;
            }
            .header img {
            width: 80px;
            margin-bottom: 10px;
            }
            .content {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            }
            .content h1 {
            text-align: center;
            color: #333;
            }
            .table-container {
            margin-top: 20px;
            }
            table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            }
            th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            }
            th {
            background-color: #fdb441;
            color: white;
            }
            .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h2>New Booking Received</h2>
            </div>
            <div class="content">
            <p>Hello,</p>
            <p>A new package tour booking has just been made. Below are the details:</p>
            <div class="table-container">
                <table>
                <tr>
                    <th>Field</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td><strong>Package Name</strong></td>
                    <td>${payload.package_name}</td>
                </tr>
                <tr>
                    <td><strong>Name</strong></td>
                    <td>${payload.name}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td>${payload.email}</td>
                </tr>
                <tr>
                    <td><strong>Country of Origin</strong></td>
                    <td>${payload.country_of_origin}</td>
                </tr>
                <tr>
                    <td><strong>Phone Number</strong></td>
                    <td>${payload.phone_number}</td>
                </tr>
                <tr>
                    <td><strong>Number of Adults</strong></td>
                    <td>${payload.number_of_adults}</td>
                </tr>
                <tr>
                    <td><strong>Number of Children</strong></td>
                    <td>${payload.number_of_children}</td>
                </tr>
                <tr>
                    <td><strong>Start Date</strong></td>
                    <td>${payload.start_date}</td>
                </tr>
                <tr>
                    <td><strong>Pickup Location</strong></td>
                    <td>${payload.pickup_location}</td>
                </tr>
                <tr>
                    <td><strong>Pickup Time</strong></td>
                    <td>${payload.pickup_time}</td>
                </tr>
                <tr>
                    <td><strong>Additional Condition</strong></td>
                    <td>${payload.additional_condition}</td>
                </tr>
                </table>
            </div>
            <p>Please review the details and process the booking accordingly.</p>
            </div>
            <div class="footer">
            <p>&copy; 2025 Ride Bali Explore. All Rights Reserved.</p>
            </div>
        </div>
        </body>
        </html>

`;

      await this.mailerService.sendMail({
        to: 'ridebaliexplore@gmail.com',
        subject: 'New Order Package Tour Just Received',
        html: htmlTemplate,
      });
    } catch (error) {
      console.error(`Error sending order package tour email to `, error);
      throw error;
    }
  }
}
