import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import xml2js from "xml2js";
import { getCurrentUnix } from "../../commons/common-functions";
import axios from "axios";
import { response } from "express";
import Place from "../../models/destinationModel";
import { createHistory } from "../historyRoute/create.history";
import { verify } from "jsonwebtoken";
import config from "../../../config";

export const searchCityHandler = async (req, res) => {
  try {
    let { name } = req.query;
    const apiKey = "/J+4dmkH5S16rw0CkNxp0A==QqXKmfycX42FTw0W";
    let response;
    await axios
      .get(`https://api.api-ninjas.com/v1/city?name=${name}`, {
        headers: {
          "X-Api-Key": apiKey,
        },
      })
      .then((response) => {
        response = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response.status, error.response.data);
        } else {
          console.error("Request failed:", error.message);
        }
      });

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { response },
          StatusCodes.OK,
          "FOUND SUCCESSFULLY",
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
