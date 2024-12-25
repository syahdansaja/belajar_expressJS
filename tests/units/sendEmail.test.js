import {sendEmail} from "../../providers/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

describe("send email function test", () => {
    it('should be sending email', async () => {
        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: process.env.PURPOSE_EMAIL_FOR_TEST,
            subject: "Test email",
            text: "Test email",
            html: `
            <h1 style="justify-self: center;">Test Email</h1>
            `
        }
        const  resultSendEmail = await sendEmail(mailOptions);
        // expect send email to be successfully
        expect(resultSendEmail).toBe(true);
    });
})