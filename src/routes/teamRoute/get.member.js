import { MEMBER_MESSAGE } from "../../commons/global-constants.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import { setPagination } from "../../commons/common-functions.js";
import MemberModel from "../../models/memberModel.js";

export const getSingleMemberHandler = async (req, res) => {
  try {
    if (!req.params.memberId)
      throw new CustomError(`Error, please provide a member id`);

    let memberData = await MemberModel.findOne({
      _id: req.params.memberId,
      status: { $ne: "deleted" },
    });

    if (!memberData) throw new CustomError(`Error, member not found`);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { memberData },
          StatusCodes.OK,
          MEMBER_MESSAGE.MEMBER_FOUND,
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

export const getListMemberHandler = async (req, res) => {
  try {
    const pagination = setPagination(req.query);

    let { search } = req.query;
    let where = {
      status: { $ne: "deleted" },
    };

    if (search) {
      where = {
        ...where,
        ...{
          $or: [
            {
              name: new RegExp(search.toString(), "i"),
            },
          ],
        },
      };
    }

    let paginated_data = await MemberModel.find({ ...where })
      .sort({ ...pagination.sort })
      .skip(pagination.offset)
      .limit(pagination.limit);

    let total_count = await MemberModel.count(where);
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { paginated_data, total_count },
          StatusCodes.OK,
          MEMBER_MESSAGE.MEMBER_FOUND,
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
