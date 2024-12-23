import express from 'express';
import RegisterController from '../controllers/Auth/RegisterController.js';
import LoginController from '../controllers/Auth/LoginController.js';
import User from '../Models/User.js';
import { Op } from 'sequelize';

class Router {
    constructor () {
        this.router = express.Router();
        this.initializeRouter();
    }
    initializeRouter () {
        this.router.post('/auth/register', RegisterController.register);
        this.router.post('/auth/OTP_Verification', RegisterController.OTPVerification);
        this.router.post('/auth/login', LoginController.login);
    }
}
export default new Router().router;