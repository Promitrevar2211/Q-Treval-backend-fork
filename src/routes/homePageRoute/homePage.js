import Place from "../../models/destinationModel.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error.js";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils.js";
import Joi from "joi";
import path from "path";
import WeatherEngine from "../../helpers/getWeatherDetails.js";
export const homePageHandler = async (req, res) => {
  try {
    let locations = await Place.find(
      { isFeatured: 1, isDeleted: false },
    );

    let weather = await fetchWeatherData(locations);

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(weather, StatusCodes.OK, "HOME PAGE LOADED", 0)
      );
  } catch (error) {
    logsErrorAndUrl(req, error, path.basename(__filename));
    if (error instanceof Joi.ValidationError || error instanceof CustomError) {
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

async function fetchWeatherData(locations) {
  const weatherDataPromises = locations.map(async (location) => {
    let place = location.place
    const response = await WeatherEngine.getWeatherByCity({ location: place });
    return {
      location,
      weatherData: response.data,
    };
  });

  const weatherData = await Promise.all(weatherDataPromises);
  return weatherData;
}
