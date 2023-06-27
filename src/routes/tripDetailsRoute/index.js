import { Router } from "express";
import { authenticateOnlyMember, authenticateUser } from "../../middleware/authorization";
import { authenticateAdmin } from "../../middleware/adminAuth";
import { createTripDetailsHandler } from "./create.details";
import { getListTripDetailsHandler, getSingleTripDetailsHandler } from "./get.details";
import { deleteTripDetailsHandler } from "./delete.details";
import { updateTripDetailsHandler } from "./update.details";

const tripDetailsRoute = Router();

tripDetailsRoute.post("/create-detail",authenticateUser,createTripDetailsHandler);
tripDetailsRoute.put("/update-detail/:tripId",authenticateUser,authenticateAdmin,updateTripDetailsHandler);
tripDetailsRoute.delete("/delete-detail/:tripId",authenticateUser,authenticateAdmin,deleteTripDetailsHandler);
tripDetailsRoute.get("/single-detail/:tripId",authenticateUser,authenticateOnlyMember,getSingleTripDetailsHandler);
tripDetailsRoute.get("/list-detail",authenticateUser,authenticateOnlyMember,getListTripDetailsHandler);

export default tripDetailsRoute;
