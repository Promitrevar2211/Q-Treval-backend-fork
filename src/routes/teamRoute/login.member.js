import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import MemberModel from "../../models/memberModel.js";
import jsonwebtoken from "jsonwebtoken" ;
import config from "../../../config/index.js";
import { loginMemberValidation } from "../../helpers/validations/member.validation.js";
export const memberLoginHandler = async (req, res) => {
  try {
    await loginMemberValidation.validateAsync({ ...req.body });

    let memberData = await MemberModel.findOne({
      ...req.body,
      status: { $ne: "deleted" },
    });

    if (!memberData) {
      throw new CustomError(`Incorrect Email or Password`);
    }

    if (memberData["status"] == "unverified")
      throw new CustomError(`Please verify your email`);
    else if (memberData["status"] == "verified") {
      throw new CustomError(`Please wait for approval from admin`);
    }

    let newjwt = jsonwebtoken.sign ({ _id: memberData._id }, config.JWT_SECRET_KEY);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { accessToken: newjwt, memberData: memberData },
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
