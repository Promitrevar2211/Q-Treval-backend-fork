import { Router } from "express";
import { getListHistoryHandler, getSingleHistoryHandler } from "./get.history";
import { authenticateUser } from "../../middleware/authorization";
import { authenticateAdmin } from "../../middleware/adminAuth";

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
