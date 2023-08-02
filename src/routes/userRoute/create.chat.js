import { USER_MESSAGE } from "../../commons/global-constants.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import { setPagination } from "../../commons/common-functions.js";
import MemberModel from "../../models/memberModel.js";
import chatModel from "../../models/chatModel.js"
import tripDetailsModel from "../../models/userTripDetailsModel.js";
import { notificationSender } from "../notifications/create.notification.js";


export const createUserChat = async(req,res) =>{
    try{
       const {message} = req.body;
       const admin = await MemberModel.findOne({isAdmin: true});
       const chat = await chatModel.findOne({trip_id: req.params.tripId});
       let result;
       if(!chat){
                result = await chatModel.create({
                    trip_id : req.params.tripId,
                    chats: [{id:'user',message}],
                    member_id: admin._id
                });
            
    }
    else{
        result = await chatModel.findOneAndUpdate({trip_id: req.params.tripId},{
            chats: [...chat.chats,{id:'user',message}]
        }, { new: true});
    }
    if(result){
        await notificationSender({
            title: "Received message",
            description: `message for enquiry of trip ${req.params.tripId}.`,
            sender_id: req.params.tripId,
            receiver_id: [admin._id],
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