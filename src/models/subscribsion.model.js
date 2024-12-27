import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema(
    {
        //id, channelName, subscriber, created at and updated at

        channelName:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "userSchema",
            required : true,
            unique : true
        },
        subscriber:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref : "userSchema"
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Subscriber = mongoose.model("Subscriber",subscriptionSchema);