import { Router } from "express";
import { createMemberHandler } from "./create.member";
import { getListMemberHandler, getSingleMemberHandler } from "./get.member";
import { updateMemberHandler } from "./update.member";
import { deleteMemberHandler } from "./delete.member";
import { authenticateUser } from "../../middleware/authorization";
import { authenticateAdmin } from "../../middleware/adminAuth";
import { memberLoginHandler } from "./login.member";
import { verifyMemberHandler } from "./verify.member";
import { otpHandler } from "./send.otp";

const memberRoute = Router();

memberRoute.post('/create-member',authenticateUser,authenticateAdmin,createMemberHandler);
memberRoute.get('/single-member/:memberId',authenticateUser,authenticateAdmin,getSingleMemberHandler);
memberRoute.get('/list-member',authenticateUser,authenticateAdmin,getListMemberHandler);
memberRoute.put('/update-member/:memberId',authenticateUser,authenticateAdmin,updateMemberHandler);
memberRoute.delete('/delete-member/:memberId?',authenticateUser,authenticateAdmin,deleteMemberHandler);
memberRoute.get('/verify-member',verifyMemberHandler);
memberRoute.get('/send-otp',otpHandler);
memberRoute.post('/login',memberLoginHandler);
export default memberRoute;