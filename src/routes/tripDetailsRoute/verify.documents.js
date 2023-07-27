import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { responseGenerators } from "../../lib/utils.js";
import documentsModel from "../../models/userDocumentModel.js";
import UserModel from "../../models/userModel.js";
import { notificationSender } from "../notifications/create.notification.js";

export const verifyDocuments = async(req,res) => {
    try{
        const { docId, memberId } = req.params;
        const { isAccepted, reason } = req.body;
        const document = await documentsModel.findOne({ _id: docId});
        let result;
        if(document){
            const user = await UserModel.findOne({ _id:document.uploaded_by });
            const receiver_ids = [user._id]; 
            if(isAccepted){
                result=await documentsModel.findByIdAndUpdate({_id: docId},{is_verified: true}, {new: true});
                await notificationSender({
                    title: "Document Verified Successfully",
                    description: `Hoorah! Your Documents are verified by our team sucessfully get your bags packed!!`,
                    sender_id: memberId,
                    receiver_id:  receiver_ids,
                });
            }
            else{
                result = await documentsModel.findOneAndDelete({_id: docId}); 
                await notificationSender({
                    title: "Document Verification failed",
                    description: `Sorry ${user.first_name} your document verification was not successful as ${reason}`,
                    sender_id: memberId,
                    receiver_id:  receiver_ids,
                });
            }
            return res
            .status(StatusCodes.OK)
            .send(
            responseGenerators(
                { result },
                StatusCodes.OK,
                "DOCUMENT VERIFIED",
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