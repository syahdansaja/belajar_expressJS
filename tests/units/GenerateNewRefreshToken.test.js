import LoginController from "../../controllers/Auth/LoginController.js";
import User from "../../Models/User.js";
import dotenv from "dotenv";

dotenv.config();

// ini di taruh ke unit test
describe("Test generate new OTP Password for re-authentication and send email", () => {
    let testUser;
    beforeAll(async () => {
        testUser = await User.create({
            firstName: "User",
            lastName: "Testing",
            email: process.env.PURPOSE_EMAIL_FOR_TEST,
            password: "test123",
            otpPassword: "123456",
            otpExpiry: new Date(Date.now() + 30 * 60 * 1000),
            otpVerifiedAt: new Date(Date.now() + 30)
        })
    });
    afterAll(async () => {
        // deleting user dummy data after testing finished
        await User.destroy({
            where: { email: process.env.PURPOSE_EMAIL_FOR_TEST }
        });
    });

    it('should generate OTP Password for re-authentication and send email', async () => {
        // get dummy user data
        const userData = await User.findOne({
            where: { email: process.env.PURPOSE_EMAIL_FOR_TEST }
        });
        // expect user data found
        expect(userData).not.toBeNull();
        // Generating OTP Password and send email
        const response = await LoginController.generateOTPPassword(userData);
        // expect that OTP Password successfully to be sent
        expect(response).toBe(true);
    });
});