import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import axios from "axios";
import { response } from "express";

export const getPlaceDetailsHandler = async (req, res) => {
  try {
    if (!req.query.search)
      throw new CustomError("Please enter something in search");
    let responseData;
    await axios
      .get(
        `https://data.apttechsols.com/api/business/gmv1/index.php?q=${req.query.search}&token=aobqj9ebwo4bwmpzx`
      )
      .then(
        (response) => {
          // Store the response data in a variable
          responseData = response.data;

          // Use the responseData as needed
          console.log(responseData);
        },
      )
      .catch((error) => {
        throw new CustomError(error.message);
        // Handle any errors that occurred during the API request
        responseData = error;
        console.error(error);
      });

    return res.status(StatusCodes.OK).send(responseData);
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
