import { USER_MESSAGE } from "../../commons/global-constants.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import { setPagination } from "../../commons/common-functions.js";
import UserModel from "../../models/userModel.js";
import tripDetailsModel from "../../models/userTripDetailsModel.js";

export const getUserTrips = async(req,res) => {
    try{
        const pagination = setPagination(req.query);
        const {email} =  req.params;
        
        const result = await tripDetailsModel.find({
                email: email,
                isDeleted: false
            }).sort({ ...pagination.sort })
            .skip(pagination.offset)
            .limit(pagination.limit);

            return res
            .status(StatusCodes.OK)
            .send(
            responseGenerators(
                { result },
                StatusCodes.OK,
                "TRIPS FETCHED SUCCESSFULLY",
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