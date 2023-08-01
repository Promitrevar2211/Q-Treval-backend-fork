import { Router } from "express";
import { createUserHandler } from "./create.user.js";
import { getListUserHandler, getSingleUserHandler } from "./get.user.js";
import { updateUserHandler } from "./update.user.js";
import { deleteUserHandler } from "./delete.user.js";
import { updatePassword } from "./change.password.js";
import { authenticateOnlyMember, authenticateUser } from "../../middleware/authorization.js";
import { authenticateAdmin } from "../../middleware/adminAuth.js";
import { userLoginHandler } from "./login.user.js";
import { verifyUserHandler } from "./verify.user.js";
import { otpHandler } from "./send.otp.js";
import { getUserTrips } from "./get.user.trip.history.js";

const userRoute = Router();

userRoute.post('/create-user',createUserHandler);
userRoute.get('/single-user/:userId',authenticateUser,authenticateOnlyMember,getSingleUserHandler);
userRoute.get('/list-user',authenticateUser,authenticateOnlyMember,getListUserHandler); 
userRoute.put('/update-user/:userId?',authenticateUser,updateUserHandler);
userRoute.delete('/delete-user/:userId?',authenticateUser,deleteUserHandler);
userRoute.get('/verify-user',verifyUserHandler);
userRoute.post('/change-password',updatePassword);
userRoute.get('/send-otp',otpHandler);
userRoute.post('/login',userLoginHandler);
userRoute.get('/trips/:userId',getUserTrips);
export default userRoute;