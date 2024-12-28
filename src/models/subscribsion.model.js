import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema(
    {
        ////id, channelName, subscriber, created at and updated at

        channelName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userSchema",
            required: true,
            unique: true
        },

        //// it was a mistake ... i don't take subscriber as a array while the number could be in millions
        subscriber:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userSchema"
        }

    },
    {
        timestamps: true
    }
)

export const Subscriber = mongoose.model("Subscriber", subscriptionSchema);