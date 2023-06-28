import dotenv from "dotenv";
dotenv.config();
import getCurrentLine from "get-current-line";
import axios from "axios";

class WeatherEngine {
  static getWeatherByCity = async (data = {}) => {
    console.log(data);
    try {
      if (!data) {
        return {
          status: 0,
          message: "Invalid location",
          data: {},
          code: 400,
          ev: getCurrentLine().line,
        };
      }

      let location;
      if (
        data.location != null &&
        data.location != undefined &&
        data.location != ""
      ) {
        location = data.location;
      } else {
        return {
          status: 0,
          message: "Invalid location",
          data: {},
          code: 400,
          ev: getCurrentLine().line,
        };
      }

      const url = `http://api.weatherapi.com/v1/current.json?key=a30f711aae524cc288d100330231806&q=${encodeURIComponent(location)}`;

      let response = await axios.get(url);
      if (response.error != null) {
        return {
          status: 0,
          message: "Unable to fetch weather data for this location",
          data: {},
          code: 400,
          ev: getCurrentLine().line,
        };
      }
      response = response.data;

      let weatherData = {};

      weatherData.location_name = response.location.name;
      weatherData.location_region = response.location.region;
      weatherData.location_country = response.location.country;
      weatherData.timezone = response.location.tz_id;
      weatherData.latitude = response.location.lat;
      weatherData.longitude = response.location.lon;
      weatherData.temperature = `${response.current.temp_c}°C`;
      weatherData.is_day = response.current.is_day ? "Yes" : "No";
      weatherData.wind_mph = `${response.current.wind_mph} mph`;
      weatherData.wind_degree = `${response.current.wind_degree}°`;
      weatherData.wind_dir = response.current.wind_dir;
      weatherData.pressure_mb = `${response.current.pressure_mb} mb`;
      weatherData.precip_mm = `${response.current.precip_mm} mm`;
      weatherData.humidity = `${response.current.humidity}%`;
      weatherData.cloud = `${response.current.cloud}%`;
      weatherData.feelslike_c = `${response.current.feelslike_c}°C`;
      weatherData.visibility_km = `${response.current.vis_km} km`;
      weatherData.uv = `${response.current.uv}`;
      weatherData.gust_mph = `${response.current.gust_mph} mph`;
      weatherData.condition = response.current.condition.text;
      weatherData.last_updated = response.current.last_updated;

    //   let reportString = "Weather report: ";
    //   for (let key in weatherData) {
    //     reportString += `${key} - ${weatherData[key]}, `;
    //   }
    //   // Remove trailing comma and space
    //   reportString = reportString.slice(0, -2) + ".";

      return {
        status: 1,
        message: "Success",
        data: weatherData,
        code: 200,
      };
    } catch (error) {
      return {
        status: 0,
        message: "Something went wrong",
        data: {},
        code: 400,
        ev: getCurrentLine().line,
      };
    }
  };
}

export default WeatherEngine;