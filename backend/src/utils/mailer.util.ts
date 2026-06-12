import nodemailer from "nodemailer";
import config from "../configs/constant.config.js";
import logger from "./logger.util.js";

const transporter = nodemailer.createTransport({
    host: config.SMTP.HOST,
    port: Number(config.SMTP.PORT),
    auth: {
        user: config.SMTP.USER,
        pass: config.SMTP.PASS,
    },
});

/**
 * Sends an email using the configured SMTP server.
 * @param to The recipient's email address
 * @param subject The subject of the email
 * @param html The HTML body of the email
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
    try {
        const info = await transporter.sendMail({
            from: `"${config.WEBSITE_NAME}" <${config.SMTP.FROM}>`,
            to,
            subject,
            html,
        });

        logger.log(`Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error: any) {
        logger.error(`Failed to send email to ${to}: ${error.message}`);
        return false;
    }
};

export default {
    sendEmail,
};
