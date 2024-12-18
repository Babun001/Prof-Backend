import mongoose from "mongoose";
import aggregatePaginate  from 'mongoose-aggregate-paginate-v2'
const videoSchema = new mongoose.Schema(
    {
        videoFile:{
            type:String,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
        },
        views:{
            type:Number,
            default:0,
        },
        duration:{
            type:Number,
            required:true
        },
        isPublished:{
            type:boolean,
            default:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }

    },
    {
        timestamps:true
    }
);

videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);