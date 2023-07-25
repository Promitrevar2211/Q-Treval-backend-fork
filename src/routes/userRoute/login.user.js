import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import UserModel from "../../models/userModel.js";
import jsonwebtoken from "jsonwebtoken" ;
import config from "../../../config/index.js";
import { loginUserValidation } from "../../helpers/validations/user.validation.js";
export const userLoginHandler = async (req, res) => {
  try {
    await loginUserValidation.validateAsync({ ...req.body });

    let userData = await UserModel.findOne({ ...req.body, isDeleted: false });

    if (!userData) {
      throw new CustomError(`Incorrect Email or Password`);
    }

    if (!userData.isVerified) throw new CustomError(`Please verify your email`);

    let newjwt = jsonwebtoken.sign ({ _id: userData._id }, config.JWT_SECRET_KEY);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { accessToken: newjwt, userData: userData },
          StatusCodes.OK,
          "Login Success",
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
