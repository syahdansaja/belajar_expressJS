import express from 'express';
import UserController from "../controllers/UserController.js";
import LoginController from "../controllers/Auth/LoginController.js";

class Router {
    constructor () {
        this.router = express.Router();
        this.initializeRouter();
    }
    initializeRouter () {
        this.router.post('/auth/login', LoginController.login);
        this.router.get('/data', UserController.index);
        this.router.post('/data/post', UserController.create);
    }
}
export default new Router().router;