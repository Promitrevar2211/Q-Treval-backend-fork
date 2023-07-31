import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import { USER_MESSAGE } from "../../commons/global-constants.js";
import UserModel from "../../models/userModel.js";
import { updateUserValidation } from "../../helpers/validations/user.validation.js";
import moment from "moment";
export const updateUserHandler = async (req, res) => {
  try {
    let userId;
    if (req.permission == "user") {
      userId = req.tokenData._id;
    } else if (req.permission == "member") {
      if (!req.params.userId) throw new CustomError("Please enter a User ID");
      userId = req.params.userId;
    }

    await updateUserValidation.validateAsync({ ...req.body, userId });

    if (req.body.dob) {
      const dobString = req.body.dob;

      let isvalid = moment(dobString, "DD/MM/YYYY", true).isValid();

      if (!isvalid)
        throw new CustomError("Please enter valid date format DD/MM/YYYY");

      const [day, month, year] = dobString.split("/");

      // Create a new Date object with the year, month (subtracting 1 as months are zero-based), and day
      const formatdob = new Date(Date.UTC(year, month - 1, day));

      req.body.dob = formatdob;
    }

    if (req.body.gender) {
      if (req.body.gender != "Male" && req.body.gender != "Female")
        throw new CustomError("Please specify a valid value");
    }

    let updateUser = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        isDeleted: false,
      },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateUser) throw new CustomError("Error, User not found");
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { updateUser },
          StatusCodes.OK,
          USER_MESSAGE.USER_UPDATED,
          0
        )
      );
  } catch (error) {
    //logsErrorAndUrl(req, error, path.basename(__filename));
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
