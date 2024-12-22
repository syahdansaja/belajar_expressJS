import express from 'express';
import UserController from "../controllers/UserController.js";
import LoginController from "../controllers/Auth/LoginController.js";

class Router {
    constructor () {
        this.router = express.Router();
        this.initializeRouter();
    }
    initializeRouter () {
        this.router.post('/auth/register',LoginController.register);
        this.router.post('/auth/login', LoginController.login);
        this.router.get('/auth/haha', async  (req , res) => {
            res.status(200).json({
                status: 'success'
            })
        })
    }
}
export default new Router().router;