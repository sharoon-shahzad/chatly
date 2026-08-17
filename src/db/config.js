

import { Sequelize } from 'sequelize';

const connectDB = async () => {
    try {
        const sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT,
            }
        );

        await sequelize.authenticate()
            .then(() => {
                console.log('Database connection has been established successfully.');
            })
            .catch((error) => {
                throw error;
            })

    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}
export default connectDB;   