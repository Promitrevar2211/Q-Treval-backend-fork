import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import UserModel from "../../models/userModel";
import { sign } from "jsonwebtoken";
import config from "../../../config";
import { loginUserValidation } from "../../helpers/validations/user.validation";
export const userLoginHandler = async (req, res) => {
  try {
    await loginUserValidation.validateAsync({ ...req.body });

    let userData = await UserModel.findOne({ ...req.body, isDeleted: false });

    if (!userData) {
      throw new CustomError(`Incorrect Email or Password`);
    }

    if (!userData.isVerified) throw new CustomError(`Please verify your email`);

    let newjwt = sign({ _id: userData._id }, config.JWT_SECRET_KEY);

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
