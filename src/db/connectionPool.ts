import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool: Pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT): 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,  // Set to true in production to validate the server's certificate
    },
});

// // Adding event listeners to our db pool object
// pool.on('connect', () => {
//     console.log('Connected to databse');
// });

// pool.on('error', (error) => {
//     console.log('Connection failed', error.message)
// });

export default pool;