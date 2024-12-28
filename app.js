import express from 'express';
import router from "./routes/router.js";
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from 'url';
import appurlconsoled from "./middlewares/getUrlAccessed.js";
import sequelize from "./config/database.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import scheduler from "./tasks/indexScheduler.js";
import {defineAssociations} from "./Models/index.js";

defineAssociations();

scheduler;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(appurlconsoled);
app.use('/api', router);
app.use('/asset/public', express.static(path.join(__dirname,'storage/public')));

try {
    await sequelize.authenticate();
    console.log("Connnection was succcessfully");
} catch (error) {
    console.error("Unable to connect to database", error);
}

export default app;