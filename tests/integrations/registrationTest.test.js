import app from "../../app.js";
import fs from "fs";
import path from "path";
import User from "../../Models/User.js";
import sequelize from "../../config/database.js";
import request from "supertest";

describe("Registration test", () => {
    const testDir = 'storage/avatars';
    beforeAll(async () => {
        await fs.mkdir(testDir, { recursive: true });
    });
    afterEach(async () => {
        // clean up database
        await sequelize.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
        // Delete uploaded file
        const files = await fs.readdir(testDir);
        await Promise.all(files.map(file => fs.unlink(path.join(testDir, file))));
    });
    afterAll(async () => {
        await sequelize.close();
    });
    // run registration test
    it('should register a user',async () => {
        const res = await request(app)
            .post("/api/auth/register");
    });
})