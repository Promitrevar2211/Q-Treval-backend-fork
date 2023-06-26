import { validationResult } from "express-validator";
import Place from "../../models/destinationModel";
import { CustomError } from "../../helpers/custome.error";
import { StatusCodes } from "http-status-codes";
import { responseGenerators } from "../../lib/utils";
import { setPagination } from "../../commons/common-functions";

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Controller methods

export const addPlace = [
  handleValidationErrors,
  async (req, res) => {
    try {
      const place = new Place(req.body);
      await place.save();
      res.status(200).json(place);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

export const getPlaces = async (req, res) => {
  try {
    const pagination = setPagination(req.query);
    let paginated_data = await Place.find()
      .sort({ ...pagination.sort })
      .skip(pagination.offset)
      .limit(pagination.limit);

    let total_count = await Place.count();
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
   // const places = await Place.find().limit(10);
  //  res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
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
    if (!search) throw new CustomError("Please enter something in search");
    const query = {
      $or: [
        { place: new RegExp(search.toString(), "i") },
        { city: new RegExp(search.toString(), "i") },
        { state: new RegExp(search.toString(), "i") },
        { country: new RegExp(search.toString(), "i") },
      ],
    };
    const places = await Place.find(query);
    res.status(200).json(places);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
