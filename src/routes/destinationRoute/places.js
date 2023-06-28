import { validationResult } from "express-validator";
import Place from "../../models/destinationModel";
import { CustomError } from "../../helpers/custome.error";
import { StatusCodes } from "http-status-codes";
import { setPagination } from "../../commons/common-functions";
import { createPlaceValidation } from "../../helpers/validations/place.validation";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import mongoose from "mongoose";
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
    logsErrorAndUrl(req, error, path.basename(__filename));
    if (error instanceof ValidationError || error instanceof CustomError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators({}, StatusCodes.BAD_REQUEST, error.message, 1)
        );
    }
    // if (
    //   error instanceof mongoose.Error.ValidationError &&
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
    logsErrorAndUrl(req, error, path.basename(__filename));
    if (error instanceof ValidationError || error instanceof CustomError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators({}, StatusCodes.BAD_REQUEST, error.message, 1)
        );
    }
    // if (
    //   error instanceof mongoose.Error.ValidationError &&
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
