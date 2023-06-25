import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import { MEMBER_MESSAGE } from "../../commons/global-constants";
import MemberModel from "../../models/memberModel";
import { updateMemberValidation } from "../../helpers/validations/member.validation";

export const updateMemberHandler = async (req, res) => {
  try {
    await updateMemberValidation.validateAsync({ ...req.body, ...req.params });
    let membername = req.body.membername;

    let isPresent = await MemberModel.findOne({
      membername,
      _id: { $ne: req.params.memberId },
    });

    if (isPresent) {
      throw new CustomError("Membername Already Exists");
    }

    let updateMember = await MemberModel.findOneAndUpdate(
      {
        _id: req.params.memberId,
        isDeleted: false,
      },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateMember) throw new CustomError("Error, Member not found");
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { updateMember },
          StatusCodes.OK,
          MEMBER_MESSAGE.MEMBER_UPDATED,
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
