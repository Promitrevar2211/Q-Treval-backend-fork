import { validationResult } from "express-validator";
import Place from "../../models/destinationModel";
import { CustomError } from "../../helpers/custome.error";
import { StatusCodes } from "http-status-codes";
import { setPagination } from "../../commons/common-functions";
import { createPlaceValidation } from "../../helpers/validations/place.validation";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
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
      let paginated_data = await Place.find({ ...where })
        .sort({ ...pagination.sort })
        .skip(pagination.offset)
        .limit(pagination.limit);

      let total_count = await Place.count({ ...where });
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
      const places = await Place.find(query);
      res.status(200).json(places);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
