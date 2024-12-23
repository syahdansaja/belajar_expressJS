import {sendEmailFunction} from "../controllers/Auth/RegisterController.js";

test("must be send email", async () => {
    const response = sendEmailFunction("aanjkt018@gmail.com", "123456");
    console.log("email has been sent, log sent: " + response);
    expect(response).toBeDefined();
});