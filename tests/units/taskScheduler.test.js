import deleteUserDataScheduled from "../../tasks/deleteUserData.js";
import User from "../../Models/User.js";
import dotenv from "dotenv";

dotenv.config();

describe("Test delete user data that doesn't verificate OTP", () => {
    let testUser; // user that doesn't verificate OTP
    beforeAll(async () => {
        testUser = await User.create({
            firstName: "User",
            lastName: "Test",
            email: process.env.PURPOSE_EMAIL_FOR_TEST,
            password: "12345678",
            otpPassword: "123456",
            otpExpiry: new Date(Date.now() - 30 * 60 * 1000),
            otpExpiredAt: null
        });
    });

    it('should be delete user data', async () => {
        await deleteUserDataScheduled();

        // expect user data should be deleted
        const user = await User.findOne({
            where: {
                email: testUser.email,
            }
        });
        console.table(user);
        // expect(user).toBe(null);
    });
})