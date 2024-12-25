import transporter from "../config/email.js";

const sendEmail = async (message) => {
    try {
        await transporter.sendMail(message);
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {sendEmail};