import express from 'express';
import RegisterController from '../controllers/Auth/RegisterController.js';
import LoginController from '../controllers/Auth/LoginController.js';
import authorizationCheck from "../middlewares/authorizationCheck.js";
import UserController from "../controllers/UserController.js";

class Router {
    constructor () {
        this.router = express.Router();
        this.initializeRouter();
    }
    initializeRouter () {
        this.router.post('/auth/register', RegisterController.register);
        this.router.post('/auth/OTP_Verification', RegisterController.OTPVerification);
        this.router.post('/auth/login', LoginController.login);
        this.router.post('/auth/refreshToken', LoginController.generateNewAccessToken);
        this.router.get('/user/index', authorizationCheck, UserController.index);
    }
}
export default new Router().router;