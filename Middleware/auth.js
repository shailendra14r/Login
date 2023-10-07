import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../Model/userSchema.js';


export async function vaildUser(req, res, next){
    try{
        const {email} = req.method==='GET'? req.query : req.body;
        const emailExist = await User.findOne({email});
        if(emailExist)   next();
        else{
            res.status(400).send({ "error" : "Invalid Creditionals"});
        }
    }
    catch(error){
        res.status(400).send({error});
    }
} 


export function verifyToken(req, res, next){
    try{
        const token = req.cookie.token;
        
        jwt.verify(token, dotenv.config().parsed.SECRET_KEY, function(error, user){
            if(error){
                res.status(400).send({error});
            }
            else{
                req.user = user;
                next();
            }
        })
    }
    catch(error){
        res.status(401).send({"error" : "UnAuthorised User", ...error});
    }
}

