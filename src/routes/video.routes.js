import { uploadVideo } from '../controllers/video.controller.js';
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtCheck } from '../middlewares/jwt.middleware.js'


const route = Router();

route.route("/videoupload").post(
    jwtCheck,
    upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), uploadVideo
);


export default route;
