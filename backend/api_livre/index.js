
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'

import livreRoutes from "./routes/livre.js"

import { config } from "dotenv";

config();

const app = express();

// middleware  
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

// routes 
app.use('/api/v1/livre',livreRoutes);

// connecter database  
mongoose
    .connect(process.env.mongoDBURL + process.env.DB_NAME)
    .then(()=>{
        console.log('App connected to database');
        app.listen(process.env.PORT , ()=>{
            console.log(`App is listening to port : ${process.env.PORT}`);
        })
    })
    .catch((error)=>{
        console.log(error);
    })
