import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../helpers/custome.error";
import { logsErrorAndUrl, responseGenerators } from "../../lib/utils";
import { ValidationError } from "joi";
import path from "path";
import moment from "moment";
import { createTripDetailsValidation } from "../../helpers/validations/tripDetails.validation";
import tripDetailsModel from "../../models/userTripDetailsModel";
import nodemailer from "nodemailer";
import { verify } from "jsonwebtoken";
import config from "../../../config";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import emailResponseModel from "../../models/emailResponseModel";
import { transporter } from "../../helpers/mailTransporter";

function getCountryCodeFromNumber(phoneNumber) {
  try {
    const PNF = PhoneNumberFormat;
    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(phoneNumber);
    return phoneUtil.getRegionCodeForNumber(number);
  } catch (err) {
    console.log(err);
    return null;
  }
}

function isValidNumber(phoneNumber, countryCode) {
  try {
    const PNF = PhoneNumberFormat;
    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
    return phoneUtil.isValidNumber(number);
  } catch (err) {
    return false;
  }
}

async function sendEmailToVendor(data) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "booking@quantumtravel.ai",
      subject: `New Customer Booking Details - ${data.destination} Trip`,
      text: `Dear Admin,\n\nWe have received a new booking request from a customer who wishes to travel to ${
        data.destination
      }. Below are the details provided by the customer:\n\nName: ${
        data.name
      }\nEmail: ${data.email}\nPhone: ${data.phoneNo}\n\nDestination: ${
        data.destination
      }\n\nTravel Type: ${
        data.travel_type
      }\n\nFrom: ${data.going_travel_date.toDateString()}\nTo: ${
        data.return_travel_date ? data.return_travel_date.toDateString() : "N/A"
      }\n\nFlight Type: ${data.flight_type}\n\nHotel Booking: ${
        data.book_hotel
      }\n`,
    };

    transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
}

async function sendEmailToCustomer(data) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: `Thank You for Your Query`,
      text: `Thank You for your Query. Our travel concierge will contact you in the next 30 minutes.\nFor any other communication please contact us at booking@quantumtravel.ai\n`,
    };

    transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
}

export const createTripDetailsHandler = async (req, res) => {
  try {
    const { authorization } = req.headers;
    let tokenData;
    try {
      if (authorization) {
        tokenData = verify(authorization, config.JWT_SECRET_KEY);
      }
    } catch (error) {
      throw new CustomError("Please provide a valid token");
    }

    await createTripDetailsValidation.validateAsync({ ...req.body });

    let {
      name,
      email,
      phoneNo,
      destination,
      travel_type,
      going_travel_date,
      return_travel_date,
      flight_type,
      book_hotel,
    } = req.body;

    let countryCode = getCountryCodeFromNumber(phoneNo);
    let isPhoneValid = isValidNumber(phoneNo, countryCode);

    if (!isPhoneValid)
      throw new CustomError("Please Enter a valid Phone Number.");

    const goingDate = going_travel_date;

    let isgoingvalid = moment(goingDate, "DD/MM/YYYY", true).isValid();

    if (!isgoingvalid)
      throw new CustomError("Please enter valid going date format DD/MM/YYYY");

    const [day, month, year] = goingDate.split("/");
    let formatgoing = new Date(Date.UTC(year, month - 1, day));
    // formatgoing.setHours(0, 0, 0, 0);
    let formatreturn;
    if (return_travel_date) {
      const returnDate = return_travel_date;

      let isreturnvalid = moment(returnDate, "DD/MM/YYYY", true).isValid();

      if (!isreturnvalid)
        throw new CustomError(
          "Please enter valid return date format DD/MM/YYYY"
        );

      const [day, month, year] = returnDate.split("/");
      formatreturn = new Date(Date.UTC(year, month - 1, day));
      // formatreturn.setHours(0, 0, 0, 0);
    }

    let newDetails = await tripDetailsModel.create({
      user_id: tokenData ? tokenData._id : "guest",
      name,
      email,
      phoneNo,
      destination,
      travel_type,
      going_travel_date: formatgoing,
      return_travel_date: formatreturn,
      flight_type,
      book_hotel,
      created_at: new Date(),
    });

    let SendEmailToVendor = await sendEmailToVendor(newDetails);
    if (!SendEmailToVendor) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators(
            {},
            StatusCodes.BAD_REQUEST,
            "UNABLE TO SEND EMAIL",
            1
          )
        );
    }
    let SendEmailToCustomer = await sendEmailToCustomer({ email: email });
    if (!SendEmailToCustomer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators(
            {},
            StatusCodes.BAD_REQUEST,
            "UNABLE TO SEND EMAIL",
            1
          )
        );
    }

    return res
      .status(StatusCodes.OK)
      .send(
        responseGenerators(
          { newDetails },
          StatusCodes.OK,
          "USER TRIP DETAILS CREATED SUCCESSFULLY",
          0
        )
      );
  } catch (error) {
    console.log(error);
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
