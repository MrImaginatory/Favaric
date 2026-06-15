export const getPasswordResetEmailTemplate = (userName: string, otp: string): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        /* Reset margins and paddings for consistent rendering across email clients */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    </style>
</head>
<body style="background-color: #f4f4f5; margin: 0; padding: 0;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #4F46E5; padding: 30px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td align="left" style="padding: 40px 30px; color: #333333;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                We received a request to reset the password for your account. Please use the following One-Time Password (OTP) to complete the process:
                            </p>

                            <!-- OTP Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="background-color: #F3F4F6; border: 1px dashed #4F46E5; border-radius: 6px; padding: 15px 30px; display: inline-block;">
                                            <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0; font-size: 16px; line-height: 24px;">
                                This OTP is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                            
                            <p style="margin: 40px 0 0 0; font-size: 16px; line-height: 24px; color: #666666;">
                                Best regards,<br>
                                <strong>The Application Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 18px;">
                                © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
    `;
};

export const getPasswordUpdatedEmailTemplate = (userName: string, time: string, deviceInfo: string, supportUrl: string): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Updated Successfully</title>
    <style>
        /* Reset margins and paddings for consistent rendering across email clients */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    </style>
</head>
<body style="background-color: #f4f4f5; margin: 0; padding: 0;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #10B981; padding: 30px 20px;">
                            <!-- Optional: You can add a success icon here -->
                            <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-block; margin-bottom: 15px;">
                                <span style="color: white; font-size: 36px; line-height: 60px;">✓</span>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Updated</h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td align="left" style="padding: 40px 30px; color: #333333;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                Hello <strong>${userName}</strong>,
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                This email is to confirm that the password for your account has been successfully changed.
                            </p>
                            
                            <div style="background-color: #F3F4F6; border-left: 4px solid #10B981; padding: 15px; margin: 25px 0;">
                                <p style="margin: 0; font-size: 15px; color: #4B5563;">
                                    <strong>Time of change:</strong> ${time}<br>
                                    <strong>Device/Location:</strong> ${deviceInfo}
                                </p>
                            </div>

                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                If you made this change, no further action is required. You can safely log in with your new password.
                            </p>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #DC2626; font-weight: 600;">
                                Didn't make this change?
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px;">
                                If you did not update your password, please secure your account immediately by contacting our support team or resetting your password again.
                            </p>

                            <!-- Call to Action -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${supportUrl}" style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">Secure My Account</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 40px 0 0 0; font-size: 16px; line-height: 24px; color: #666666;">
                                Best regards,<br>
                                <strong>The Application Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 18px;">
                                © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
    `;
};
