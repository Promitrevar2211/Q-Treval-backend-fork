import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import MemberModel from "../../models/memberModel";

export const approveMemberHandler = async (req, res) => {
  try {
    if (!req.params.memberId)
      throw new CustomError("Error, Please enter a member id");

    let approveMember = await MemberModel.findOneAndUpdate(
      {
        _id: req.params.memberId,
        status: "verified",
      },
      {
        status: "approved",
      },
      { new: true }
    );

    if (!approveMember) throw new CustomError("Error, Verified Member not found");
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { approveMember },
          StatusCodes.OK,
          "MEMBER HAS BEEN SUCCESSFULLY APPROVED",
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
