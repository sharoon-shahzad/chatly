import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { sequelize, connectDB } from "./db/config.js";
import { app } from "./app.js";
import "./models/associations.js";



app.use(express.json());



async function startServer() {
    try {
        await connectDB();

        await sequelize.sync();

        console.log("Database synchronized");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {
        console.error("Unable to start application:", error);
        process.exit(1);
    }
}

startServer();