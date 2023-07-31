import { StatusCodes } from "http-status-codes";
import { responseGenerators } from "../../lib/utils.js";
import notesModel from "../../models/notesModel.js";

export const updateNotes = async(req,res) => {
    try{
        const {id} = req.params;
        const result = await notesModel.findOneAndUpdate({
            _id: id
        },{
            ...req.body
        },{new: true});
        return  res
        .status(StatusCodes.OK)
        .send(
        responseGenerators(
            { result },
            StatusCodes.OK,
            "NOTES UPDATED SUCCESSFULLY",
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