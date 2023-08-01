import { StatusCodes } from "http-status-codes";
import { ERROR } from "../commons/global-constants.js";
import { verifyJwt } from "../helpers/Jwt.helper.js";
import { verify } from "jsonwebtoken";
import { logsErrorAndUrl, responseGenerators } from "../lib/utils.js";
import UserModel from "../models/userModel.js";
import config from "../../config/index.js";
import MemberModel from "../models/memberModel.js";

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

    let member = await MemberModel.findOne({
      _id: tokenData._id,
      status : "approved"
    });

    if (member) {
      req.isAdmin = member["isAdmin"];
      req.permission = "member";
    } else {
      let user = await UserModel.findOne({
        _id: tokenData._id,
        isDeleted: false,
      });

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
      } else {
        req.permission = "user";
      }
    }

    next();
  } catch (error) {
    // JWT verification failed, return unauthorized response
    // logsErrorAndUrl(req, error);
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

export const authenticateOnlyMember = async (req, res, next) => {
  try {
    if (req.permission != "member") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          responseGenerators({}, StatusCodes.UNAUTHORIZED, "NOT AUTHORIZED", 1)
        );
    }

    next();
  } catch (error) {
    // JWT verification failed, return unauthorized response
    // logsErrorAndUrl(req, error);
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
