import { StatusCodes } from "http-status-codes";
import { responseGenerators } from "../../lib/utils.js";
import chatModel from "../../models/chatModel.js";

export const getChats = async(req,res)=>{
    try{
        const chat = await chatModel.findOne({trip_id: req.params.tripId}); 
        if(!chat){
            return res
        .status(StatusCodes.OK)
        .send(
          responseGenerators(
            {},
            StatusCodes.OK,
            "No chats found",
            0
          )
        )
        }
        return res
        .status(StatusCodes.OK)
        .send(
          responseGenerators(
            { chat },
            StatusCodes.OK,
            "Fetch chats SUCCESSFULLY",
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