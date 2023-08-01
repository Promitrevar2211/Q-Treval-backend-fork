import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import tripDetailsModel from "../../models/userTripDetailsModel.js";

export const deleteTripDetailsHandler = async (req, res) => {
  try {
    if (!req.params.tripId)
      throw new CustomError("Error, Please enter a trip id");
    let deleteTrip = await tripDetailsModel.findOneAndUpdate(
      { _id: req.params.tripId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!deleteTrip)
      throw new CustomError(`Error, Trip Details does not exist`);
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          {},
          StatusCodes.OK,
          "TRIP DETAILS DELETED SUCCESSFULLY",
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
