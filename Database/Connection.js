import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async function(req, res){
    const db = await mongoose.connect(process.env.DB_URL);
    return db;
}

export default dbConnection;
