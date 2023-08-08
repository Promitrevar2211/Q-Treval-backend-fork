import { validationResult } from "express-validator";
import Place from "../../models/destinationModel.js";
import { CustomError } from "../../helpers/custome.error.js";
import { StatusCodes } from "http-status-codes";
import { setPagination } from "../../commons/common-functions.js";
import { createPlaceValidation } from "../../helpers/validations/place.validation.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../../../config/index.js";
import http from "https";
import bodyParser from "body-parser";

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Controller methods

export const addPlace = async (req, res) => {
  try {
    await createPlaceValidation.validateAsync({ ...req.body });

    let newPlace = await Place.create({ ...req.body, created_at: new Date() });
    return res.status(StatusCodes.OK).send(
      responseGenerators(
        {
          newPlace,
        },
        StatusCodes.OK,
        "PLACE HAS BEEN CREATED SUCCESSFULLY",
        0
      )
    );
  } catch (error) {
    // logsErrorAndUrl(req, error, path.basename(__filename));
    if (error instanceof Joi.ValidationError || error instanceof CustomError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators({}, StatusCodes.BAD_REQUEST, error.message, 1)
        );
    }
    // if (
    //   error instanceof mongoose.Error.Joi.ValidationError &&
    //   error.errors.fieldName
    // ) {
    //   // Custom error message for unique constraint violation
    //   error.errors.fieldName.message =
    //     "Custom error message: This field must be unique";
    // }
    if (error.code === 11000 || error.code === 11001) {
      // Unique constraint violation error
      // Handle the error as needed
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

export const getSinglePlace = async (req, res) => {
  try {
    if (!req.params.placeId)
      throw new CustomError("Error,Please provide a place id");

    let place = await Place.findOne({
      _id: req.params.placeId,
      isDeleted: false,
    });

    if (!place) throw new CustomError(`Error, place not found`);

    return res.status(StatusCodes.OK).send(
      responseGenerators(
        {
          place,
        },
        StatusCodes.OK,
        "PLACE FOUND SUCCESSFULLY",
        0
      )
    );
  } catch (error) {
    // logsErrorAndUrl(req, error, path.basename(__filename));
    if (error instanceof Joi.ValidationError || error instanceof CustomError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators({}, StatusCodes.BAD_REQUEST, error.message, 1)
        );
    }
    // if (
    //   error instanceof mongoose.Error.Joi.ValidationError &&
    //   error.errors.fieldName
    // ) {
    //   // Custom error message for unique constraint violation
    //   error.errors.fieldName.message =
    //     "Custom error message: This field must be unique";
    // }
    if (error.code === 11000 || error.code === 11001) {
      // Unique constraint violation error
      // Handle the error as needed
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

export const getPlaces = async (req, res) => {
  try {
    // const places = await Place.find().limit(10);
    // res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.status(200).json({ message: "Place deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchPlaces = async (req, res) => {
  try {
    const { search } = req.query;
    let where = { isDeleted: false };
    if (!search) {
      const pagination = setPagination(req.query);
      let paginated_data = await Place.find({ ...where, isFeatured: 1 })
        .sort({ ...pagination.sort })
        .skip(pagination.offset)
        .limit(pagination.limit);

      let total_count = await Place.count({ ...where, isFeatured: 1 });

      return res
        .status(StatusCodes.OK)
        .send(
          responseGenerators(
            { paginated_data, total_count },
            StatusCodes.OK,
            "PLACES FOUND",
            0
          )
        );
    } else {
      const query = {
        ...where,
        $or: [
          { place: new RegExp(search.toString(), "i") },
          { city: new RegExp(search.toString(), "i") },
          { state: new RegExp(search.toString(), "i") },
          { country: new RegExp(search.toString(), "i") },
        ],
      };
      const paginated_data = await Place.find(query);
      let total_count = await Place.count(query);
      if (total_count === 0) {
        return res
          .status(StatusCodes.OK)
          .send(
            responseGenerators(
              { paginated_data, total_count },
              StatusCodes.OK,
              "PLACE NOT FOUND",
              1
            )
          );
      } else {
        return res
          .status(StatusCodes.OK)
          .send(
            responseGenerators(
              { paginated_data, total_count },
              StatusCodes.OK,
              "PLACES FOUND",
              0
            )
          );
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const autocomplete = async (req, res) => {
  try {
    if (!req.params.search)
      throw new CustomError("Please start typing city name1");

    const search = req.params.search;

    if (search != null && search.length > 0) {
      async function httpRequest(options) {
        return new Promise((resolve, reject) => {
          const req = http.request(options, (res) => {
            const chunks = [];

            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
              const body = Buffer.concat(chunks).toString();
              try {
                const jsonData = JSON.parse(body);
                resolve(jsonData);
              } catch (err) {
                reject(err);
              }
            });
            res.on("error", reject);
          });

          req.on("error", reject);
          req.end();
        });
      }
      try {
        const options = {
          method: "GET",
          hostname: "place-autocomplete1.p.rapidapi.com",
          port: null,
          path: `/autocomplete/json?input=${search}&radius=2000`,
          headers: {
            "X-RapidAPI-Key":
              "5c080073e7msh030d64a37b94ba4p11d8acjsnd3b4a80b709b",
            "X-RapidAPI-Host": "place-autocomplete1.p.rapidapi.com",
          },
        };

        let data;
        await httpRequest(options)
          .then((response_data) => {
            data = response_data;
          })
          .catch((err) => {
            console.error(err);
          });

        if (data.status === "OK") {
          data = data.predictions
            .map((item) => {
              const requiredValuesSets = [
                ["country", "political", "geocode"],
                ["locality", "political", "geocode"],
                ["administrative_area_level_1", "political", "geocode"],
              ];
              const hasRequiredValues = requiredValuesSets.some((set) =>
                set.every((val) => item.types.includes(val))
              );
              if (!hasRequiredValues) return;
              return {
                place: item.description,
                place_id: item.place_id,
                formatting: {
                  main_text: item.structured_formatting.main_text,
                  secondary_text: item.structured_formatting.secondary_text,
                },
              };
            })
            .filter(Boolean);
        } else {
          data = [];
        }

        if (data.length === 0) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send(
              responseGenerators({}, StatusCodes.NOT_FOUND, "No place found", 0)
            );
        }
        return res
          .status(StatusCodes.OK)
          .send(responseGenerators(data, StatusCodes.OK, "Place found", 0));
      } catch (error) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(
            responseGenerators({}, StatusCodes.NOT_FOUND, "No place found", 0)
          );
      }
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators(
            {},
            StatusCodes.BAD_REQUEST,
            "Please start typing city name2",
            0
          )
        );
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
