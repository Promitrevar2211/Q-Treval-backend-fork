import { Router } from "express";
import { getListHistoryHandler, getSingleHistoryHandler } from "./get.history.js";
import { authenticateUser } from "../../middleware/authorization.js";
import { authenticateAdmin } from "../../middleware/adminAuth.js";

const historyRoute = Router();

historyRoute.get(
  "/single-history/:historyId",
  authenticateUser,
  authenticateAdmin,
  getSingleHistoryHandler
);
historyRoute.get(
  "/list-history",
  authenticateUser,
  authenticateAdmin,
  getListHistoryHandler
);

export default historyRoute;
