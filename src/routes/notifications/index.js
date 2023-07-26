import { Router } from "express";
import {getNotifications} from "./get.notifications.js";
import { markRead } from "./create.notification.js";
import { authenticateUser } from "../../middleware/authorization.js";
import { authenticateAdmin } from "../../middleware/adminAuth.js";

const notificationRoute = Router();
notificationRoute.get('/:id',getNotifications);
notificationRoute.get('/:userId/:notificationId', markRead);

export default notificationRoute;