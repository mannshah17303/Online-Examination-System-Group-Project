import express from 'express';
import checkAuthRoute from './checkAuth.js';
import forgotPassRoute from './forgotPassRoute.js';
import loginRoute from './login.js';
import logoutRoute from './logout.route.js';
import signupRoute from './signup.js';
const router = express.Router();

router.use("/",logoutRoute);
router.use("/",loginRoute);
router.use("/",signupRoute);
router.use("/",forgotPassRoute);
router.use("/admin",checkAuthRoute);
router.use("/",checkAuthRoute);

export default router;