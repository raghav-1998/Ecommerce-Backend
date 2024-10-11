import { Router } from "express";
import { loginUserByPassword, registerUser } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.route('/register').post(registerUser);
router.route('/password-login').post(loginUserByPassword);
//router.route('/logout').post(verifyJwt);

export default router;