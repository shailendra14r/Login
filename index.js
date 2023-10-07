import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './Router/Router.js';
import DbConnection from './Database/Connection.js';
import dotenv from 'dotenv';
import cookieParsser from 'cookie-parser';

const app = express();
dotenv.config();
const port = process.env.PORT;


// To Allow requests from different server
app.use(cors());
app.use(cookieParsser());
app.use(express.json());
app.use(morgan('tiny'));


// Routes
app.use('/api', router);


// DB connection 
DbConnection()
    .then(()=>{
        console.log('Connection Made Succefully');
        try{
            app.listen(port,()=>{
                console.log(`Server Started at http://localhost:${port}`);
            })
        }catch(error){
            console.log('Unable to start Server');
            console.log(error);
        }
    })
    .catch(()=>{console.log('Cannot connect to database')});
