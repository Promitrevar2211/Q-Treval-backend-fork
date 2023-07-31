import { StatusCodes } from "http-status-codes";
import { responseGenerators } from "../../lib/utils.js";
import tripDetailsModel from "../../models/userTripDetailsModel.js";
import notesModel from "../../models/notesModel.js";

export const addNotes = async(req,res)=>{
    try{
        const {id} = req.params;
        const getTripDetails = await tripDetailsModel.findOne(
            {
            _id: id,
            isDeleted: false
        });
        const addNotes = await notesModel.create({...req.body, user_id: getTripDetails.email})
        const previousNotes =  getTripDetails.notes;
        const result =await  tripDetailsModel.findOneAndUpdate(
            {
              _id: id,
              isDeleted: false,
            },
            {
              notes: [...previousNotes,addNotes._id],
              updated_at : new Date()
            },
            { new: true }
          );
        return res
        .status(StatusCodes.OK)
        .send(
          responseGenerators(
            { result },
            StatusCodes.OK,
            "NOTES ADDED SUCCESSFULLY",
            0
          )
        );
    }
    catch(err){
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