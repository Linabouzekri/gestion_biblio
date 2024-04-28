import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'

// import {PORT , mongoDBURL } from "./config.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;
const DB_NAME = process.env.DB_NAME;
const SECRET = process.env.SECRET;

import clientRoutes from "./routes/client.js"

const app = express();

// middleware  
app.use(cors());
app.use(express.json())
app.use(express.static('public'))


app.use('/api/v1/client',clientRoutes);

// connecter database  
mongoose
    .connect(mongoDBURL + DB_NAME)
    .then(()=>{
        app.listen(PORT , ()=>{
            console.log(`App is listening to port : ${PORT}`);
        })
    })
    .catch((error)=>{
        console.log(error);
    })