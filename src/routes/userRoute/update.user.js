import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import { USER_MESSAGE } from "../../commons/global-constants";
import UserModel from "../../models/userModel";
import { updateUserValidation } from "../../helpers/validations/user.validation";

export const updateUserHandler = async (req, res) => {
  try {
    await updateUserValidation.validateAsync({ ...req.body, ...req.params });
    let username = req.body.username;

    let isPresent = await UserModel.findOne({
      username,
      _id: { $ne: req.params.userId },
    });

    if (isPresent) {
      throw new CustomError("Username Already Exists");
    }

    let updateUser = await UserModel.findOneAndUpdate(
      {
        _id: req.params.userId,
        isDeleted: false,
      },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateUser) throw new CustomError("Error, User not found");
    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { updateUser },
          StatusCodes.OK,
          USER_MESSAGE.USER_UPDATED,
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
