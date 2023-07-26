import { Router } from "express";
import {getNotifications} from "./get.notifications";
import { authenticateUser } from "../../middleware/authorization.js";
import { authenticateAdmin } from "../../middleware/adminAuth.js";

const notificationRoute = Router();
notificationRoute.get('/:id',getNotifications);

export default notificationRoute;