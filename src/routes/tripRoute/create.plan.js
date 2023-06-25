import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import xml2js from "xml2js";
import { getCurrentUnix } from "../../commons/common-functions";
import axios from "axios";
import { response } from "express";

function escapeXmlContent(unsafe) {
  return unsafe.replace(/[&'"]/g, function (c) {
    switch (c) {
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
}

export const createTripHandler = async (req, res) => {
  try {
    if (!req.query.query) throw new CustomError("Please specify a query");

    const requestBody = {
      q: `Create travel plan according the [Query]. \n [AnswerSchema]: <plan><plan_title>🌲 3-day itinerary for Shimla 🌠, 🏔️ 7-Day Mussoorie Getaway 🏞️ , etc</plan_title><schedule><day>Day 1, Day 2, Day 3, etc.</day><title>Exploring Shimla's Beauty 🏞️, Shimla's Heritage and Nature 🏰🌲, etc.</title><tagline>Discover the beauty of Shimla and its charming attractions, Immerse yourself in the heritage and natural beauty of Shimla, etc.</tagline><items><item><time_slot>Morning, Afternoon, Evening, Night, etc.</time_slot><explain>Deatail explain, what we should do. Example - Visit the splendid ***Himalayan Bird Park***, ***Christ Church***, one of the oldest churches in North India. Admire its neo-gothic architecture and soothing interiors.</explain></item></items></schedule><schedule>...</schedule></plan> [END] \n [NextStep]: 1. Understand user requirements in detail and then suggest best suitable Travel plan. 2. Answer must be only in [AnswerSchema] format. Don't write anything outside of the [AnswerSchema]. 3. USE *** place, event, or entity name *** to mark the place and name. 4. Don't suggest same place, or event multiple times. [END] \n [Query]: ${req.query.query}. \n [Plan]:`,
      group_id: "group_id",
      followUp: 1,
      limit: 0,
    };

    const headers = {
      "Content-Type": "application/json",
      authorization: "b966c739-0c27-4f2e-ae35-5ffefbea5d3e",
    };
    let responseData;
    await axios
      .post("https://api.nextlabai.com/api/service/llm/latest", requestBody, {
        headers,
      })
      .then((response) => {
        // Store the response data in a variable
        responseData = response.data.data;
      })
      .catch((error) => {
        // Handle any errors that occurred during the API request
        throw new CustomError("Something went wrong");
      });

    const toolsStartIndex = responseData.indexOf("<plan>");
    const toolsEndIndex = responseData.indexOf("</plan>") + "</plan>".length;
    let xml;

    if (toolsStartIndex !== -1 && toolsEndIndex !== -1) {
      xml = responseData.substring(toolsStartIndex, toolsEndIndex);
    } else {
      throw new CustomError("Something went wrong");
    }
    let xml2JSON = "";
    try {
      xml = await escapeXmlContent(xml);
      xml2JSON = await xml2js.parseStringPromise(xml);
      xml2JSON["plan"]["plan_title"] = xml2JSON["plan"]["plan_title"][0];
      for (let item of xml2JSON["plan"]["schedule"]) {
        item["day"] = item["day"][0];
        item["title"] = item["title"][0];
        item["tagline"] = item["tagline"][0];
        item["items"] = item["items"][0]["item"];
        for (let single of item["items"]) {
          single["time_slot"] = single["time_slot"][0];
          single["explain"] = single["explain"][0];
        }
      }
      return res
        .status(StatusCodes.OK)
        .send(
          responseGenerators(
            { ...xml2JSON },
            StatusCodes.OK,
            "PLAN CREATED SUCCESSFULLY",
            0
          )
        );
    } catch (e) {
      throw new CustomError("Something went wrong");
    }
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
