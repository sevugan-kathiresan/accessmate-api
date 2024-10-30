import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool: Pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT): 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { // This SSL setting need to be set to false otherwise the RDS instance will reject the connection
        rejectUnauthorized: false,  // Set to true in production to validate the server's certificate
    },
});

export default pool;