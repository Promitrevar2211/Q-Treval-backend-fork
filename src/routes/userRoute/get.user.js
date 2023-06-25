import { USER_MESSAGE } from "../../commons/global-constants";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import { setPagination } from "../../commons/common-functions";
import UserModel from "../../models/userModel";

export const getSingleUserHandler = async (req, res) => {
  try {
    
    if (!req.params.userId)
      throw new CustomError(`Error, please provide a user id`);

    let userData = await UserModel.findOne({
      _id: req.params.userId,
      isDeleted: false,
    });

    if (!userData) throw new CustomError(`Error, user not found`);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { userData },
          StatusCodes.OK,
          USER_MESSAGE.USER_FOUND,
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

export const getListUserHandler = async (req, res) => {
  try {
    const pagination = setPagination(req.query);

    let { search } = req.query;
    let where = {
      isDeleted: false,
    };

    if (search) {
      where = {
        ...where,
        ...{
          $or: [
            {
              name: new RegExp(search.toString(), "i"),
              username: new RegExp(search.toString(), "i"),
            },
          ],
        },
      };
    }

    let paginated_data = await UserModel.find({ ...where })
      .sort({ ...pagination.sort })
      .skip(pagination.offset)
      .limit(pagination.limit);

    let total_count = await UserModel.count(where);
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { paginated_data, total_count },
          StatusCodes.OK,
          USER_MESSAGE.USER_FOUND,
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
