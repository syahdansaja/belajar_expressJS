import deleteUserDataScheduled from "../tasks/deleteUserData.js";

it('should delete expired OTPs', async () => {
    await deleteUserDataScheduled();
}); 