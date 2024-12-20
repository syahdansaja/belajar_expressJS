import express from 'express';
import router from "./routes/router.js";
import path from 'path';
import { fileURLToPath } from 'url';
import appurlconsoled from "./middlewares/getUrlAccessed.js";
import sequelize from "./config/database.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(appurlconsoled);
app.use('/api', router);
app.use('/asset/public', express.static(path.join(__dirname,'storage/public')));

try {
    await sequelize.authenticate();
    console.log("Connnection was succcessfully");
} catch (error) {
    console.error("Unable to connect to database", error);
}

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});