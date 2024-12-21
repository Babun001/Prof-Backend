import { Router } from "express";
import { userRegister } from "../controllers/userRegister.js";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            fileName : "Avatar",
            maxCount:1
        },
        {
            fileName : "coverImage",
            maxCount:1
        }
    ])
    ,userRegister);


export default router;
