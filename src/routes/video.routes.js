import {uploadVideo} from '../controllers/video.controller.js';
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";


const route = Router();

route.route("/videoUpload").post(
    upload.fields([
        {
            name : "videoFile",
            maxCount : 1
        },
        {
            name : "thumbnail",
            maxCount : 1
        }
    ])
    ,uploadVideo);

export default route;
