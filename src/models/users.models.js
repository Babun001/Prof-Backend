import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true,
            index:true
        },
        emailId:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true,
        },
        avatar:{
            type:String, 
            required:true
        },
        coverImage:{
            type:String,
        },
        password:{
            type:String,
            required:[true,"Password Required!"]
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Video'
            }
        ]
    },
    {
        timestamps:true
    }
);

export const User = mongoose.model('User', userSchema);