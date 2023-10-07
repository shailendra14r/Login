import bycrpt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Model/userSchema.js';
import dotenv from 'dotenv';


// POST:  http://localhost:8080/api/register
/**
 * @param {
 * "username" : "",
 * "email" : "",
 * "password" : "",
 * "fisrtname" : "",
 * "lastname" : "",
 * "mobile" : "",
 * "address" : "",
 * "profile" : ""
 * } 
 */
export async function register(req,res){
    try{
        const {name, email, password} = req.body;

        // What is the need for try block here
        const emailExist = new Promise(async function(resolve, reject){
            try{
                const userEmail = await User.findOne({email});
                if(userEmail) reject({ error : 'Email already exist'});
                resolve();
            }
            catch(error){ 
                reject(new Error(error));
             }
        });

        emailExist
                .then(()=>{
                            bycrpt.hash(password,10)
                                .then((hashedPassword)=>{
                                            const user = new User({
                                                name,
                                                email,
                                                password: hashedPassword
                                            });
                                            user.save().then((doc)=>{  
                                                                        const {password, ...rest} = Object.assign({}, doc.toJSON());
                                                                        res.status(200).send(rest); 
                                                                    })
                                                        .catch((error) =>{res.status(500).send(error);})
                                    })
                                .catch((error)=>{res.status(500).json(error);});
                    }
                )
                .catch(
                    error =>{ 
                                res.statusCode = 500;
                                res.json({'message' : 'Unable to Register', error})
                            }
                );
    }
    catch(error){
        // console.log(error);
        res.statusCode = 500;
        res.json({'message' : 'Server Error'});
    }
};

// POST:  http://localhost:8080/api/login
/**
 * @param {
* "username" : "",
* "password" : "",
* } 
*/
export async function login(req,res){

    const {email, password} = req.body;

    try{

        User.findOne({email})
            .then((user)=>{
                bycrpt.compare(password, user.password)
                .then((passwordCheck)=>{
                            if(!passwordCheck) res.status(400).send({"message":"Invalid Credentials"});
                            else{
                                try{
                                    jwt.sign({userId : user._id, email : user.email}, dotenv.config().parsed.SECRET_KEY, { expiresIn:'6h'}, (error, token)=>{
                                        if(!error){
                                            res.status(200).cookie('token', token).send({"message" : "Login Successfull"});
                                        }
                                        else{
                                            res.status(500).send(error);
                                        }
                                    }) 
                                }
                                catch(error){res.status(500).send({"message" : "Unable to generate token"})};
                            }
                        })
                    .catch((error)=> res.status(400).send({"message":"Unable to Verify Password", error}));
        })
            .catch((error)=> res.status(400).send({"message" : "Unable to Process request", error}));
    }
    catch(error){
        res.status(404).send(error);
    }
};
