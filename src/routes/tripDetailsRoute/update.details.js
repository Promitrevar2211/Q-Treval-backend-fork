import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import moment from "moment";
import { updateTripDetailsValidation } from "../../helpers/validations/tripDetails.validation.js";
import tripDetailsModel from "../../models/userTripDetailsModel.js";
export const updateTripDetailsHandler = async (req, res) => {
  try {
    let tripId = req.params.tripId;
    await updateTripDetailsValidation.validateAsync({ ...req.body, tripId });

    if (req.body.going_travel_date) {
      const goingDate = req.body.going_travel_date;

      let isgoingvalid = moment(goingDate, "DD/MM/YYYY", true).isValid();

      if (!isgoingvalid)
        throw new CustomError(
          "Please enter valid going date format DD/MM/YYYY"
        );

      const [day, month, year] = goingDate.split("/");
      const formatgoing = new Date(Date.UTC(year, month - 1, day));
      req.body.going_travel_date = formatgoing;
    }

    if (req.body.return_travel_date) {
      const returnDate = req.body.return_travel_date;

      let isreturnvalid = moment(returnDate, "DD/MM/YYYY", true).isValid();

      if (!isreturnvalid)
        throw new CustomError(
          "Please enter valid return date format DD/MM/YYYY"
        );

      const [day, month, year] = returnDate.split("/");
      const formatreturn = new Date(Date.UTC(year, month - 1, day));
      req.body.return_travel_date = formatreturn;
    }

    let updateDetails = await tripDetailsModel.findOneAndUpdate(
      {
        _id: tripId,
        isDeleted: false,
      },
      {
        ...req.body,
        updated_at : new Date()
      },
      { new: true }
    );

    if (!updateDetails) throw new CustomError("Error,Trip Details not found");
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { updateDetails },
          StatusCodes.OK,
          "TRIP DETAILS UPDATED SUCCESSFULLY",
          0
        )
      );
  } catch (error) {
    logsErrorAndUrl(req, error, path.basename(__filename));
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
