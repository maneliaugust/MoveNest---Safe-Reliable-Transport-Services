const { Resend } = require('resend');

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    }

    async sendPasswordResetEmail(toEmail, userName, verificationCode) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: toEmail,
                subject: 'MoveNest - Password Reset Request',
                html: this.getPasswordResetTemplate(userName, verificationCode)
            });

            if (error) {
                console.error('❌ Email send error:', error);
                return { success: false, error: error.message };
            }

            console.log('✅ Email sent successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Email service error:', error);
            return { success: false, error: error.message };
        }
    }

    getPasswordResetTemplate(userName, code) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - MoveNest</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2d5f5d 0%, #1a3a38 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MoveNest</h1>
                            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 14px;">Safe & Reliable Transport Services</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">Hi ${userName},</p>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">We received a request to reset your password. Use the verification code below to complete the process:</p>
                            
                            <!-- Verification Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="background-color: #f8f9fa; border: 2px dashed #2d5f5d; border-radius: 8px; padding: 30px;">
                                        <p style="color: #666; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                        <p style="color: #2d5f5d; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${code}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">This code will expire in 10 minutes for security reasons.</p>
                            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="color: #999; margin: 0 0 10px 0; font-size: 12px;">© 2026 MoveNest. All rights reserved.</p>
                            <p style="color: #999; margin: 0; font-size: 12px;">Safe & Reliable Transport Services</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;
    }
}

module.exports = EmailService;
