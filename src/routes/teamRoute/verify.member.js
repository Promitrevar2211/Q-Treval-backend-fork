import { verifyOTP } from "../../helpers/sendEmailVerification";
import MemberModel from "../../models/memberModel";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";

export const verifyMemberHandler = async (req, res) => {
  try {
    let { email, OTP } = req.query;

    if (!email) throw new CustomError("Please Enter Email");
    if (!OTP) throw new CustomError("Please Enter OTP");
    let verified = verifyOTP(email, OTP);
    if (!verified) throw new CustomError("Entered Email or OTP is incorrect");

    let updateMember = await MemberModel.findOneAndUpdate(
      {
        email,
        status : "unverified"
      },
      {
        status: "verified",
      },
      { new: true }
    );

    if (!updateMember) throw new CustomError("Error, Member not found");

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          {},
          StatusCodes.OK,
          "Member has been verified successfully",
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
