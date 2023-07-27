import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { responseGenerators } from "../../lib/utils.js";
import documentsModel from "../../models/userDocumentModel.js";
import UserModel from "../../models/userModel.js";
import { notificationSender } from "../notifications/create.notification.js";
import Joi from 'joi';

export const getDocuments = async(req,res) => {
    try{
        const { tripId, memberId } = req.params;
        const document = await documentsModel.findOne({ uploaded_for: tripId });
        if(document){
            
            const user = await UserModel.findOne({ _id:document.uploaded_by });
            const receiver_ids = [user._id];
            await notificationSender({
                title: "Document Verfication",
                description: `Your Documents are being verified by our team sit tight while we fetch you your trip!!`,
                sender_id: memberId,
                receiver_id:  receiver_ids,
            }) 
            return res
            .status(StatusCodes.OK)
            .send(
            responseGenerators(
                { document },
                StatusCodes.OK,
                "FETCHED DOCUMENT SUCCESSFULLY",
                0
            )
            );
        }
        else{
            throw new CustomError(`Error, document does not exists`);
        }
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