import { StatusCodes } from "http-status-codes";
import { responseGenerators } from "../../lib/utils.js";
import tripDetailsModel from "../../models/userTripDetailsModel.js";
import notesModel from "../../models/notesModel.js";

export const getNotes = async(req,res) => {
    try{
        const { notes } = await tripDetailsModel.findOne({_id: req.params.id});
        const result = await Promise.all(notes.map(async note => await notesModel.findOne({_id: note})));
        return res
            .status(StatusCodes.OK)
            .send(
            responseGenerators(
                { result },
                StatusCodes.OK,
                "NOTES FETCHED SUCCESSFULLY",
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