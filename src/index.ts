import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import router from "./router";


const app: Express = express();

// Configuring Cors
const corsOptions: CorsOptions = {
    origin: '*', // Allow all the deomains to access the resource
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}

app.use(cors(corsOptions));


// Loading Port from environment variable
dotenv.config();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001; // Environment variable is loaded as string by default we need to convert it in to number

// Binding the router to the server
app.use('/api',router());

app.listen(port, () => {
    console.log(`Server Listening on http://localhost:${port}/`);
});
