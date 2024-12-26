import { Router } from "express";
import { userRegister, userLogin, userLogOut } from "../controllers/userRegister.js";
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

export default router;
