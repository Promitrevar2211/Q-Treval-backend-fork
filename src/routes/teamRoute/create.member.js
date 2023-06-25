import { MEMBER_MESSAGE } from "../../commons/global-constants";
import MemberModel from "../../models/memberModel";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import { getCurrentUnix } from "../../commons/common-functions";
import { createMemberValidation } from "../../helpers/validations/member.validation";
import { sendOTP } from "../../helpers/sendEmailVerification";

export const createMemberHandler = async (req, res) => {
  try {
    await createMemberValidation.validateAsync({ ...req.body });
    let { name, email, password } = req.body;

    let checkMember = await MemberModel.findOne({ email, isDeleted: false });

    if (checkMember) {
      throw new CustomError("Email Already Exists");
    }
    
    sendOTP(email);

    let newMember = await MemberModel.create({
      name,
      email,
      password,
      created_at: getCurrentUnix(),
    });

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { },
          StatusCodes.OK,
          "OTP has been sent to your email successfully",
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
