import express from 'express'
const router = express.Router()
import { verifyJWT } from '../middlewares/auth.middleware.js'

import {registerUser, loginUser, getCurrentUser, logoutUser, updateDetails} from '../controller/user.controller.js'


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-profile/:id").patch(verifyJWT, updateDetails)


export default router;
 