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
  try {
    const pagination = setPagination(req.query);
    let where = {
      email: req.params.email,
      isDeleted: false,
    };
    //console.log(req.query.search);
    let paginated_data_req;
    if(req.query.date){
      paginated_data_req = tripDetailsModel.find({going_travel_date: new Date(req.query.date),email: req.params.email});
    }
    else{
    paginated_data_req=(req.query.search)?  tripDetailsModel
    .find({"$and":
                [{"$or":[
                  {'destination':{"$regex": req.query.search, "$options":'i'}} 
                  ,{'email':{"$regex": req.query.search, "$options":"i"}},
                  {'name':{"$regex": req.query.search, "$options":"i"}},
                ]},
                {...where}, 
          ]})
    :  tripDetailsModel
      .find({ ...where });
    }
      if(req.query.time){
        paginated_data_req.sort({going_travel_date:1});
      }
      else if(req.query.location){
        paginated_data_req.sort({destination: 1});
      }
      const paginated_data = await paginated_data_req
      .sort({ ...pagination.sort })
      .skip(pagination.offset)
      .limit(pagination.limit);
    let total_count = await tripDetailsModel.count({ ...where });
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { paginated_data, total_count },
          StatusCodes.OK,
          "TRIP DETAILS FOUND SUCCESSFULLY",
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