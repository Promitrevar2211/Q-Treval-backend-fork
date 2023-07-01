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
import { google } from "googleapis";
import config from "../../../config";
import { auth } from "google-auth-library";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import emailResponseModel from "../../models/emailResponseModel";
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

// function sendEmail3() {
//   var defaultClient = SibApiV3Sdk.ApiClient.instance;
//   // Instantiate the client\
//   var apiKey = defaultClient.authentications["api-key"];
//   apiKey.apiKey = "YOUR_API_V3_KEY";
//   var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
//   var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
//   // Define the campaign settings\
//   emailCampaigns.name = "Customer Booking Details";
//   emailCampaigns.subject = "New Customer Booking Details - Ladakh Trip";
//   emailCampaigns.sender = {
//     name: "Quantum Travels",
//     email: "booking@quantumtravel.ai",
//   };
//   emailCampaigns.type = "classic";
//   // Content that will be sent\
//   emailCampaigns.htmlContent =
//     "Congratulations! You successfully sent this example campaign via the Brevo API.";
//   // Select the recipients\
//   emailCampaigns.recipients = { listIds: [2, 7] };
//   // Make the call to the client\
//   apiInstance.createEmailCampaign(emailCampaigns).then(
//     function (data) {
//       console.log("API called successfully. Returned data: " + data);
//     },
//     function (error) {
//       console.error(error);
//     }
//   );
// }

// const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
//   "https://www.googleapis.com/auth/spreadsheets",
// ]);

// async function gsrun(cl) {
//   const gsapi = google.sheets({ version: "v4", auth: cl });

//   let spreadsheetId = "Sheet1"; // add your spreadsheet id here

//   let createSpreadsheet = false;
//   try {
//     await gsapi.spreadsheets.get({ spreadsheetId });
//   } catch (err) {
//     if (err.code === 404) {
//       createSpreadsheet = true;
//     } else {
//       throw err;
//     }
//   }

//   if (createSpreadsheet) {
//     const request = {
//       resource: {
//         properties: {
//           title: "My Sheet",
//         },
//       },
//     };

//     const response = (await gsapi.spreadsheets.create(request)).data;
//     spreadsheetId = response.spreadsheetId;
//     console.log(`Spreadsheet ID: ${spreadsheetId}`);
//   }

//   let data = [
//     ["Name", "Age", "Gender"],
//     ["John", "20", "Male"],
//     ["Emma", "30", "Female"],
//   ]; // data to be appended

//   const updateOptions = {
//     spreadsheetId,
//     range: "Sheet1!A1",
//     valueInputOption: "USER_ENTERED",
//     resource: { values: data },
//   };

//   let res = await gsapi.spreadsheets.values.append(updateOptions);
//   console.log("res");
// }

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or the port number provided by your SMTP provider
  secure: false, // Set it to true if you are using a secure connection (TLS/SSL)
  auth: {
    user: "bootesoft@gmail.com",
    pass: "hdwyruzyuvkepocd",
  },
});

// function sendFormEmail(data) {
//   const mailOptions = {
//     from: "bootesoft@gmail.com",
//     to: "booking@quantumtravel.ai",
//     subject: `New Customer Booking Details - ${data.destination} Trip`,
//     text: `Dear Admin,\n\nWe have received a new booking request from a customer who wishes to travel to ${
//       data.destination
//     }. Below are the details provided by the customer:\n\nName: ${
//       data.name
//     }\nEmail: ${data.email}\nPhone: ${data.phoneNo}\n\nDestination: ${
//       data.destination
//     }\n\nTravel Type: ${
//       data.travel_type
//     }\n\nFrom: ${data.going_travel_date.toDateString()}\nTo: ${
//       data.return_travel_date ? data.return_travel_date.toDateString() : "N/A"
//     }\n\nFlight Type: ${data.flight_type}\n\nHotel Booking: ${
//       data.book_hotel
//     }\n`,
//   };

//   transporter.sendMail(mailOptions);
// }

async function sendFormEmail2(data) {
  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      "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";

    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        sender: { email: "booking@quantumtravel.ai", name: "Quantum Travels" },
        subject: `New Customer Booking Details - ${data.destination} Trip`,
        textContent: `Dear Admin,\n\nWe have received a new booking request from a customer who wishes to travel to ${
          data.destination
        }. Below are the details provided by the customer:\n\nName: ${
          data.name
        }\nEmail: ${data.email}\nPhone: ${data.phoneNo}\n\nDestination: ${
          data.destination
        }\n\nTravel Type: ${
          data.travel_type
        }\n\nFrom: ${data.going_travel_date.toDateString()}\nTo: ${
          data.return_travel_date
            ? data.return_travel_date.toDateString()
            : "N/A"
        }\n\nFlight Type: ${data.flight_type}\n\nHotel Booking: ${
          data.book_hotel
        }\n`,
        messageVersions: [
          //Definition for Message Version 1
          {
            to: [
              {
                email: "booking@quantumtravel.ai",
                name: "Quantum Travels",
              },
            ],
          },
        ],
      })
      .then(
        async function (res) {
          // let emailResponse = await emailResponseModel.create({
          //   response: res,
          //   api_name: "form submit",
          //   user_name : data.name
          // });
          //console.log(emailResponse);
        },
        async function (error) {
          // let emailResponse = await emailResponseModel.create({
          //   response: error,
          //   api_name: "form submit",
          //   user_name : data.name
          // });
          //console.error(emailResponse);
        }
      );
  // try {
  //   let emailResponse = await emailResponseModel.create({
  //     response: "function called",
  //     api_name: "form submit",
  //     user_name : data.name
  //   });
    
  // } catch (error) {
  //   let emailResponse = emailResponseModel.create({
  //     response: error,
  //     api_name: "form submit",
  //     user_name : data.name
  //   });
  // }
}

// function sendCustomerEmail(email) {
//   const mailOptions = {
//     from: "bootesoft@gmail.com",
//     to: email,
//     subject: "Thank You for Your Query",
//     text: `Thank You for your Query. Our travel concierge will contact you in the next 30 minutes.\nFor any other communication please contact us at booking@quantumtravel.ai.`,
//   };

//   transporter.sendMail(mailOptions);
// }

async function sendCustomerEmail2(name, email) {
  
  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
    "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";

  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      sender: { email: "booking@quantumtravel.ai", name: "Quantum Travels" },
      subject: `Thank You for Your Query`,
      textContent: `Thank You for your Query. Our travel concierge will contact you in the next 30 minutes.\nFor any other communication please contact us at booking@quantumtravel.ai.`,
      messageVersions: [
        //Definition for Message Version 1
        {
          to: [
            {
              email: email,
              name: name,
            },
          ],
        },
      ],
    })
    .then(
      async function (data) {
        // let emailResponse = await emailResponseModel.create({
        //   response: data,
        //   api_name: "thankyou email",
        //   user_name : name
        // });
        //console.log(data);
      },
      async function (error) {
        // let emailResponse = await emailResponseModel.create({
        //   response: error,
        //   api_name: "thankyou email",
        //   user_name : name
        // });
        //console.error(error);
      }
    );
  // try {
  //   let emailResponse = await emailResponseModel.create({
  //     response: "function called",
  //     api_name: "thankyou email",
  //     user_name : name
  //   });
  // } catch (error) {
  //   // let emailResponse = emailResponseModel.create({
  //   //   response: error,
  //   //   api_name: "thankyou email",
  //   //   user_name : name
  //   // });
  // }
}

// async function writeData() {
//   const client = await auth.fromJSON(keys);

//   client.scopes = ["https://www.googleapis.com/auth/spreadsheets"];
//   await client.authorize();

//   gsrun(client);
// }

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
      // destinationId,
      travel_type,
      going_travel_date,
      return_travel_date,
      flight_type,
      book_hotel,
      // place,
      // city,
      // state,
      // country,
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
      //destinationId,
      destination,
      travel_type,
      going_travel_date: formatgoing,
      return_travel_date: formatreturn,
      flight_type,
      book_hotel,
      // place,
      // city,
      // state,
      // country,
      created_at: new Date(),
    });

    //sendFormEmail(newDetails);
    //sendCustomerEmail(email);
    sendFormEmail2(newDetails);
    sendCustomerEmail2(name, email);

    // writeData();

    // client.authorize(function (err, tokens) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   } else {
    //     console.log("Connected!");
    //     gsrun(client);
    //   }
    // });

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
