import { Router } from "express";
import { authenticateOnlyMember, authenticateUser } from "../../middleware/authorization.js";
import { authenticateAdmin } from "../../middleware/adminAuth.js";
import { upload } from "../../middleware/uploadFiles.js";
import { createTripDetailsHandler } from "./create.details.js";
import { getListTripDetailsHandler, getSingleTripDetailsHandler } from "./get.details.js";
import { deleteTripDetailsHandler } from "./delete.details.js";
import { updateTripDetailsHandler } from "./update.details.js";
import { addNotes } from "./add.notes.js";
import { getNotes } from "./get.notes.js";
import { deleteNotes } from "./delete.notes.js";
import {updateNotes} from "./update.notes.js";
import { addDocuments } from  "./add.documents.js";
const tripDetailsRoute = Router();

tripDetailsRoute.post("/create-detail",createTripDetailsHandler);
tripDetailsRoute.put("/update-detail/:tripId",authenticateUser,authenticateAdmin,updateTripDetailsHandler);
tripDetailsRoute.delete("/delete-detail/:tripId",authenticateUser,authenticateAdmin,deleteTripDetailsHandler);
tripDetailsRoute.get("/single-detail/:tripId",authenticateUser,authenticateOnlyMember,getSingleTripDetailsHandler);
tripDetailsRoute.get("/list-detail",getListTripDetailsHandler); //authenticateUser,authenticateOnlyMember
tripDetailsRoute.patch("/add-notes/:id",addNotes);
tripDetailsRoute.get("/notes/:id",getNotes);
tripDetailsRoute.delete("/notes/:tripId/:noteId", deleteNotes);
tripDetailsRoute.put("/notes/:id",updateNotes);
tripDetailsRoute.post("/upload",upload.single('file'),addDocuments);

export default tripDetailsRoute;
