import express from 'express';
const app = express();
const appurlconsoled = app.use((req,res,next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

export default appurlconsoled;