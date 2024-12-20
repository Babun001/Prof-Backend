import { Router } from "express";
import {userRegister} from "../controllers/userRegister.js";


const router = Router();

router.route("/register").post(userRegister);


export default router;
