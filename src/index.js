
// import connectDB from './db/config.js';
import checkInstantConnect from './db/test-db.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env',
    debug: true, // Enable debug mode to log environment variable loading
});

checkInstantConnect();

