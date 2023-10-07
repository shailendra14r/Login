import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : {    type: String,
                    required: [true, "name is mandatory"] 
            },
    email : {   type: String, 
                required: [true, "Email is mandatory"], 
                unique: [true, "Email already exist"] 
            },
    password : {    type: String, 
                    required: [true, "Password is mandatory"]   
                },
    details: {
        type: String
    }
})


// Check and extra code usage
export default  mongoose.model.Users || mongoose.model('Users', userSchema);