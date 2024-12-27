import { Router } from "express";
import { userRegister, userLogin, userLogOut, changeOldPassword, changeAvatar } from "../controllers/userRegister.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtCheck } from '../middlewares/jwt.middleware.js'

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

router.route("/changecoverImage").post
(
    jwtCheck,
    upload.fields([{name: "updatedCoverImage", maxCount:1}])
)

export default router;
