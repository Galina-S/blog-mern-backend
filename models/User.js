import mongoose, { Mongoose } from "mongoose";

const UserSchema = new mongoose.Schema({
   
    fullName: {
        type: String,
        required: true, 
    }, 

    email: {
        type: String,
        required: true, 
        unique: true
    },

    // encrypted password
    passwordHash: {
        type: String,
        required: true,
    },

    avatarUrl: String,
},

{
    timestamps: true,
},
);

export default mongoose.model('User',UserSchema);