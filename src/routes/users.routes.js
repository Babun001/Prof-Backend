import { Router } from "express";
import {
    userRegister,
    userLogin,
    userLogOut,
    changeOldPassword,
    changeAvatar,
    changeCoverImage,
    getChannel
} from "../controllers/userRegister.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtCheck } from '../middlewares/jwt.middleware.js';
import { uploadVideo } from '../controllers/video.controller.js';

const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name: 'avatar',
                maxCount: 1
            },
            {
                name: 'coverImage',
                maxCount: 1
            }
        ]
    ), userRegister);

router.route("/login").post(userLogin);

router.route("/logOut").post(jwtCheck, userLogOut);

router.route("/changepassword").post(jwtCheck, changeOldPassword);

router.route("/updateAvatar").post
    (
        jwtCheck,
        upload.fields([{ name: 'updatedAvatar', maxCount: 1 }]),
        changeAvatar
    );

router.route("/changeCoverImage").post
    (
        jwtCheck,
        upload.fields([{ name: "updatedCoverImage", maxCount: 1 }])
    )

router.route("/abc").post(getChannel);

router.route("/videoupload").post(
    jwtCheck,
    upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), uploadVideo
);


export default router;
