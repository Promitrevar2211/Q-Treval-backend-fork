import { StatusCodes } from "http-status-codes";
import { ERROR } from "../commons/global-constants";
import { logsErrorAndUrl, responseGenerators } from "../lib/utils";

export const authenticateAdmin = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          responseGenerators({}, StatusCodes.UNAUTHORIZED, "NOT AUTHORIZED", 1)
        );
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
