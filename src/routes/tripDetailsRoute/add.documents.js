import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { responseGenerators } from "../../lib/utils.js";
import documentsModel from "../../models/userDocumentModel.js";
import UserModel from "../../models/userModel.js";
import moment from "moment";
import { notificationSender } from "../notifications/create.notification.js";
import MemberModel from "../../models/memberModel.js";
export const addDocuments = async(req,res) => {
    try{
        const { originalname, mimetype, buffer , size } = req.file; 
        const result =  await documentsModel.create({
            title: originalname,
            uploaded_by: req.params.userId,
            uploaded_for: req.params.tripId,
            mimetype,
            file: buffer,
            size,
        });
        const { first_name , last_name } = await UserModel.findOne({_id: req.params.userId});
        const members = await MemberModel.find();
        const receiver_ids = members.map((item)=>item._id);
        if(result){
           
            const notification= await notificationSender({
                title: "Document uploaded",
                description: `${first_name} ${last_name} uploaded the document for tripId:${req.params.tripId} at ${moment().toString()}.`,
                sender_id: req.params.userId,
                receiver_id:  receiver_ids,
            });
        }
        else{
                res
            .status(StatusCodes.BAD_REQUEST)
            .send(
            responseGenerators(
                {},
                StatusCodes.BAD_REQUEST,
                "UNABLE TO UPLOAD DOCUMENT",
                1
            )
            );
        }
        return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { result },
          StatusCodes.OK,
          "DOCUMENT UPLOADED SUCCESSFULLY",
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