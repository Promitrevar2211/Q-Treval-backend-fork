import { sendOTP } from "../../helpers/sendEmailVerification.js";
import UserModel from "../../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";

export const otpHandler = async (req, res) => {
  try {
    let { email } = req.query;

    if (!email) throw new CustomError("Please Enter Email");

    let getUser = await UserModel.findOne({
      email,
      isDeleted: false,
    });

    if (!getUser) throw new CustomError("User does not exist");

    if(getUser.isVerified) throw new CustomError("User is already verified");

    sendOTP(email);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          {},
          StatusCodes.OK,
          "OTP has been sent successfully",
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

export const changePasswordOtpHandler = async (req, res) => {
  try {
    let { email } = req.query;

    if (!email) throw new CustomError("Please Enter Email");

    let getUser = await UserModel.findOne({
      email,
      isDeleted: false,
    });

    if (!getUser) throw new CustomError("User does not exist");

    sendOTP(email);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          {},
          StatusCodes.OK,
          "OTP has been sent successfully",
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