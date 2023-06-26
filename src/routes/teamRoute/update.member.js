import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import { MEMBER_MESSAGE } from "../../commons/global-constants";
import MemberModel from "../../models/memberModel";
import { updateMemberValidation } from "../../helpers/validations/member.validation";
import moment from "moment";
export const updateMemberHandler = async (req, res) => {
  try {
    let memberId;
    if (req.isAdmin) {
      if (!req.params.memberId)
        throw new CustomError("Error, Please enter a Member ID");
      memberId = req.params.memberId;
    } else {
      memberId = req.tokenData._id;
    }

    await updateMemberValidation.validateAsync({ ...req.body, memberId });

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

    let updateMember = await MemberModel.findOneAndUpdate(
      {
        _id: memberId,
        status: "approved",
      },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateMember) throw new CustomError("Error,Approved Member not found");
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
