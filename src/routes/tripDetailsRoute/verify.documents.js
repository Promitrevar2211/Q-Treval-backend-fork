import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { responseGenerators } from "../../lib/utils.js";
import documentsModel from "../../models/userDocumentModel.js";
import UserModel from "../../models/userModel.js";
import { notificationSender } from "../notifications/create.notification.js";
import Joi from 'joi';

export const verifyDocuments = async(req,res) => {
    try{
        const { docId } = req.params;
        const { status, reason } = req.body;
        const document = await documentsModel.findOne({ _id: docId});
        if(document){
            const user = await UserModel.findOne({ _id:document.uploaded_by });
            const receiver_ids = [user._id]; 
            const result=await documentsModel.findByIdAndUpdate({_id: document._id},{is_verified: status}, {new: true});
            if(status === 'verified'){
                
                await notificationSender({
                    title: "Document Verified Successfully",
                    description: `Hoorah! Your Documents are verified by our team sucessfully get your bags packed!!`,
                    receiver_id:  receiver_ids,
                });
            }
            else if(status === 'rejected'){
                //result = await documentsModel.findOneAndDelete({_id: document._id}); 
                await notificationSender({
                    title: "Document Verification failed",
                    description: `Sorry ${user.first_name} your document verification was not successful due the reason: ${reason}`,
                    receiver_id:  receiver_ids,
                });
            }
            return res
            .status(StatusCodes.OK)
            .send(
            responseGenerators(
                { result },
                StatusCodes.OK,
                `DOCUMENT MARKED`,
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