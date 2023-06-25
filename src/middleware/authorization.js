import { StatusCodes } from "http-status-codes";
import { ERROR } from "../commons/global-constants";
import { verifyJwt } from "../helpers/Jwt.helper";
import { verify } from "jsonwebtoken";
import { logsErrorAndUrl, responseGenerators } from "../lib/utils";
import UserModel from "../models/userModel";
import config from "../../config";
import MemberModel from "../models/memberModel";
export const authenticateUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          responseGenerators(
            {},
            StatusCodes.UNAUTHORIZED,
            ERROR.PROVIDE_TOKEN_ERROR,
            1
          )
        );
    }
    // Verify JWT token
    const tokenData = verify(authorization, config.JWT_SECRET_KEY);
    req.tokenData = tokenData;

    let user = await UserModel.findOne({
      _id: tokenData._id,
      isDeleted: false,
    });

    let member = await MemberModel.findOne({
      _id: tokenData._id,
      isDeleted: false,
    });

    if (member) {
      req.isAdmin = member["isAdmin"];
    } else {
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            responseGenerators(
              {},
              StatusCodes.UNAUTHORIZED,
              "USER NOT FOUND",
              1
            )
          );
      }
    }

    next();
  } catch (error) {
    // JWT verification failed, return unauthorized response
    logsErrorAndUrl(req, error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(
        responseGenerators(
          {},
          StatusCodes.UNAUTHORIZED,
          ERROR.PROVIDE_TOKEN_ERROR,
          1
        )
      );
  }
};
