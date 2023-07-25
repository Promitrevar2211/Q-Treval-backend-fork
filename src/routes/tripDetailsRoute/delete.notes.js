import { StatusCodes } from "http-status-codes";
import { responseGenerators } from "../../lib/utils.js";
import tripDetailsModel from "../../models/userTripDetailsModel.js";
import notesModel from "../../models/notesModel.js";

export const deleteNotes = async(req,res) => {
    try{
        const { tripId, noteId } = req.params;
        const tripDetails = await tripDetailsModel.findOne({_id: tripId});
        const notes = tripDetails.notes.filter(note => note != noteId);
        const result = await tripDetailsModel.findOneAndUpdate({_id: tripId},{
            notes: notes
        },{ new: true});
        await notesModel.findByIdAndDelete({_id: noteId});

        return res
        .status(StatusCodes.OK)
        .send(
        responseGenerators(
            { result },
            StatusCodes.OK,
            "NOTE DELETED SUCCESSFULLY",
            0
        )
        );
    }
    catch(error){
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          responseGenerators(
            {},
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal Server Error",
            1
          )
        );
    }
}