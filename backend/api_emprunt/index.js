
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import { config } from "dotenv";
import empruntRoutes from "./routes/emprunt.js"

config();

const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;
const DB_NAME = process.env.DB_NAME;
const SECRET = process.env.SECRET;
const app = express();

// middleware  
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

//routes 
app.use('/api/v1/emprunt',empruntRoutes);

// connecter database  
mongoose
    .connect(mongoDBURL + DB_NAME)
    .then(()=>{
        console.log('App connected to database');
        app.listen(PORT , ()=>{
            console.log(`App is listening to port : ${PORT}`);
        })
    })
    .catch((error)=>{
        console.log(error);
    })
