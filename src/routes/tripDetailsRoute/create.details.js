import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import moment from "moment";
import { createTripDetailsValidation } from "../../helpers/validations/tripDetails.validation";
import tripDetailsModel from "../../models/userTripDetailsModel";
export const createTripDetailsHandler = async (req, res) => {
  try {
    await createTripDetailsValidation.validateAsync({ ...req.body });

    let {
      name,
      email,
      phoneNo,
      destinationId,
      travel_type,
      going_travel_date,
      return_travel_date,
      flight_type,
      book_hotel,
      place,
      city,
      state,
      country,
    } = req.body;

    const goingDate = going_travel_date;

    let isgoingvalid = moment(goingDate, "DD/MM/YYYY", true).isValid();

    if (!isgoingvalid)
      throw new CustomError("Please enter valid going date format DD/MM/YYYY");

    const [day, month, year] = goingDate.split("/");
    const formatgoing = new Date(Date.UTC(year, month - 1, day));
    let formatreturn;
    if (return_travel_date) {
      const returnDate = return_travel_date;

      let isreturnvalid = moment(returnDate, "DD/MM/YYYY", true).isValid();

      if (!isreturnvalid)
        throw new CustomError(
          "Please enter valid return date format DD/MM/YYYY"
        );

      const [day, month, year] = returnDate.split("/");
      formatreturn = new Date(Date.UTC(year, month - 1, day));
    }

    let newDetails = await tripDetailsModel.create({
      user_id : req.tokenData._id,
      name,
      email,
      phoneNo,
      destinationId,
      travel_type,
      going_travel_date : formatgoing,
      return_travel_date : formatreturn,
      flight_type,
      book_hotel,
      place,
      city,
      state,
      country,
      created_at: new Date(),
    });

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { newDetails },
          StatusCodes.OK,
          "USER TRIP DETAILS CREATED SUCCESSFULLY",
          0
        )
      );
  } catch (error) {
    logsErrorAndUrl(req, error, path.basename(__filename));
    if (error instanceof ValidationError || error instanceof CustomError) {
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
