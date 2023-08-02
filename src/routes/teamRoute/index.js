import { Router } from "express";
import { createMemberHandler } from "./create.member.js";
import { getListMemberHandler, getSingleMemberHandler } from "./get.member.js";
import { updateMemberHandler } from "./update.member.js";
import { deleteMemberHandler } from "./delete.member.js";
import { authenticateUser, authenticateOnlyMember } from "../../middleware/authorization.js";
import { authenticateAdmin } from "../../middleware/adminAuth.js";
import { memberLoginHandler } from "./login.member.js";
import { verifyMemberHandler } from "./verify.member.js";
import { otpHandler } from "./send.otp.js";
import { approveMemberHandler } from "./approve.member.js";
import { createAdminChat } from "./create.chat.js";

const memberRoute = Router();

memberRoute.post('/create-member',createMemberHandler);
memberRoute.get('/single-member/:memberId',authenticateUser,authenticateAdmin,getSingleMemberHandler);
memberRoute.get('/list-member',authenticateUser,authenticateAdmin,getListMemberHandler);
memberRoute.put('/update-member/:memberId?',authenticateUser,authenticateOnlyMember,updateMemberHandler);
memberRoute.get('/approve-member/:memberId',authenticateUser,authenticateAdmin,approveMemberHandler);
memberRoute.delete('/delete-member/:memberId?',authenticateUser,authenticateOnlyMember,deleteMemberHandler);
memberRoute.get('/verify-member',verifyMemberHandler);
memberRoute.post('/chats/:tripId', createAdminChat);
memberRoute.get('/send-otp',otpHandler);
memberRoute.post('/login',memberLoginHandler);
export default memberRoute;