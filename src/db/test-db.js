
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import { Sequelize } from 'sequelize';

// 1. Initialize instance with your .env credentials
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false, // Prevents terminal clutter
    }
);

// 2. Instant connection verification function
async function checkInstantConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ SUCCESS: Connection established with MySQL via Sequelize!');
    } catch (error) {
        console.error('❌ ERROR: Could not connect to the database.');
        console.error('Details:', error);
    } finally {
        await sequelize.close(); // Cleanly close the test connection pool
    }
}

export default checkInstantConnection;