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
import moment from "moment";
export const createMemberHandler = async (req, res) => {
  try {
    await createMemberValidation.validateAsync({ ...req.body });
    let { first_name, last_name, dob, gender, email, password } = req.body;

    const dobString = dob;

    let isvalid = moment(dobString, "DD/MM/YYYY", true).isValid();

    if (!isvalid)
      throw new CustomError("Please enter valid date format DD/MM/YYYY");

    let checkMember = await MemberModel.findOne({ email, isDeleted: false });

    if (checkMember) {
      throw new CustomError("Email Already Exists");
    }

    sendOTP(email);

    const [day, month, year] = dobString.split("/");

    // Create a new Date object with the year, month (subtracting 1 as months are zero-based), and day
    const formatdob = new Date(Date.UTC(year, month - 1, day));

    let newMember = await MemberModel.create({
      first_name,
      last_name,
      gender,
      email,
      dob: formatdob,
      password,
      created_at: new Date(),
    });

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          {},
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
