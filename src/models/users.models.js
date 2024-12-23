import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password Required!"]
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video'
            }
        ],
        refreshToken:{
            type: String
        }
    },
    {
        timestamps: true
    }
);

//// bcryption 
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//// create a new method on userSchema (checkPassword)
userSchema.methods.passwordCheck = async function(pw){
    return await bcrypt.compare(pw, this.password)
}

userSchema.methods.genarateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            emailId: this.emailId,
            userName: this.userName
        },
        process.env.ACCESS_SECRET_TOKEN,
        {
            expiresIn:process.env.ACCESS_SECRET_TOKEN_EXPIRY
        }
    );
}
userSchema.methods.genarateRefreshToken = function () {
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_SECRET_TOKEN,
        {
            expiresIn:process.env.REFRESH_SECRET_TOKEN_EXPIRY
        }
    );
}

export const User = mongoose.model('User', userSchema);