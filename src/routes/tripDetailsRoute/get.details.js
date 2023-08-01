import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import { setPagination } from "../../commons/common-functions.js";
import tripDetailsModel from "../../models/userTripDetailsModel.js";

export const getSingleTripDetailsHandler = async (req, res) => {
  try {
    if (!req.params.tripId)
      throw new CustomError(`Error, please provide a trip id`);

    let tripData = await tripDetailsModel.findOne({
      _id: req.params.tripId,
      isDeleted: false,
    });

    if (!tripData) throw new CustomError(`Error, trip details not found`);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { tripData },
          StatusCodes.OK,
          "TRIP DETAILS FOUND SUCCESSFULLY",
          0
        )
      );
  } catch (error) {
    // logsErrorAndUrl(req, error, path.basename(__filename));
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
};

export const getListTripDetailsHandler = async (req, res) => {
  try {
    const pagination = setPagination(req.query);
    let where = {
      isDeleted: false,
    };
    //console.log(req.query.search);
    const paginated_data_req=(req.query.search)?  tripDetailsModel
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
  } catch (error) {
    // logsErrorAndUrl(req, error, path.basename(__filename));
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
};
