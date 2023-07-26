import { StatusCodes } from "http-status-codes";
import notificationModel from "../../models/notificationModel.js";
import {
  responseGenerators,
} from "../../lib/utils.js";

export const getNotifications = async(req,res) =>{
    try{
        const {id} = req.params;
        const result = await notificationModel.find({
            receiver_id: id,
            active: true,
        });
        return res
        .status(StatusCodes.OK)
        .send(
            responseGenerators(weather, StatusCodes.OK, "HOME PAGE LOADED", 0)
        );
    }catch(error){
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
