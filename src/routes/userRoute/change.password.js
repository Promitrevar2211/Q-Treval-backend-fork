import { verifyOTP } from "../../helpers/sendEmailVerification.js";
import UserModel from "../../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";

export const updatePassword = async (req, res) => {
    try {
        let { email } = req.query;
    
        if (!email) throw new CustomError("Please Enter Email");
        // if (!OTP) throw new CustomError("Please Enter OTP");
        // let verified = verifyOTP(email, OTP);
        // if (!verified) throw new CustomError("Entered Email or OTP is incorrect");
    
        let updateUser = await UserModel.findOneAndUpdate(
          {
            email,
            isDeleted: false,
          },
          {
            password: req.body.password
          },
          { new: true }
        );
    
        if (!updateUser) throw new CustomError("Error, User not found");
    
        return res
          .status(StatusCodes.OK)
          .send(
            responseGenerators(
              {},
              StatusCodes.OK,
              "Password has been updated successfully",
              0
            )
          );
      } catch (error) {
        //// logsErrorAndUrl(req, error, path.basename(__filename));
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
}
