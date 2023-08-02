import { USER_MESSAGE } from "../../commons/global-constants.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import chatModel from "../../models/chatModel.js"
import tripDetailsModel from "../../models/userTripDetailsModel.js";
import { notificationSender } from "../notifications/create.notification.js";


export const createAdminChat = async(req,res) =>{
    try{
       const {message} = req.body;
       const chat = await chatModel.findOne({trip_id: req.params.tripId});
       const trip = await tripDetailsModel.findOne({_id: req.params.tripId});
       const result = await chatModel.findOneAndUpdate({trip_id: req.params.tripId},{
            chats: [...chat.chats,{id:'admin',message}]
        }, { new: true});
    
    if(result){
        await notificationSender({
            title: "Received message",
            description: `message for enquiry of trip ${req.params.tripId}.`,
            sender_id: req.params.tripId,
            receiver_id: [trip.user_id],
        });
    }

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { result },
          StatusCodes.OK,
          'Sent Chat Successfully',
          0
        )
    );
    }
    catch(error){
        if (error instanceof Joi.ValidationError || error instanceof CustomError) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .send(
                responseGenerators({}, StatusCodes.BAD_REQUEST, error.message, 1)
              );
          }
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