import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import http from "http";
import * as bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import { responseValidation } from "./lib/utils.js";
import logger from "./lib/logger/index.js";
import helmet from "helmet";
import cors from "cors";
import config from "../config/index.js";
import { createTripHandler } from "./routes/tripRoute/create.plan.js";
import { create } from "domain";
import userRoute from "./routes/userRoute/index.js";
import { authenticateUser } from "./middleware/authorization.js";
import memberRoute from "./routes/teamRoute/index.js";
import { getPlaceDetailsHandler } from "./routes/tripRoute/get.placedetails.js";
import placeRoute from "./routes/destinationRoute/index.js";
import historyRoute from "./routes/historyRoute/index.js";
import notificationRoute from "./routes/notifications/index.js";
import tripDetailsRoute from "./routes/tripDetailsRoute/index.js";
import { homePageHandler } from "./routes/homePageRoute/homePage.js";
import { searchCityHandler } from "./routes/searchCityRoute/searchCity.js";
import fileUpload from "express-fileupload";
dotenv.config();
const app = express();
const server = new http.Server(app);

//Chat server
const chatServer = http.createServer(app);
const io = new Server(chatServer);

io.on("connection", (socket) => {
  console.log("new user connected");
  let name;
  socket.on("joining msg", (username) => {
    name = username;
    io.emit("chat message", `---${name} joined the chat---`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("chat message", `---${name} left the chat---`);
  });
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg); //sending message to all except the sender
  });
});

app.use(function (req, res, next) {


  res.setHeader('Access-Control-Allow-Origin', config.FRONT_END_URL);

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

if (process.env.NODE_ENV == "production") {
  // eslint-disable-next-line no-undef
  app.use(cors({ origin: [config.FRONT_END_URL] }));
} else if(process.env.NODE_ENV == 'stagging'){
  app.use(cors({ origin: [config.FRONT_END_URL]}));
}
else{
  app.use(cors({ origin: "*" }));
}

//app.use(fileUpload());
app.use(express.urlencoded());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many request hit from this IP, please try again after 5 min.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());
// app.use(express.static('public'))
//Strip

// Use JSON parser for parsing payloads as JSON on all non-webhook routes.
// app.use((req, res, next) => {
//     if (req.originalUrl === "/webhook") {
//         next();
//     } else {
//         bodyParser.json()(req, res, next);
//     }
// });
app.post("/api/create-plan", createTripHandler);
app.get("/api/place-details", getPlaceDetailsHandler);
app.use("/api/user", userRoute);
app.use("/api/member", memberRoute);
app.use("/api/place", placeRoute);
app.use("/api/history", historyRoute);
app.use("/api/user-trip-details", tripDetailsRoute);
app.use("/api/notifications", notificationRoute);
app.get("/api/home-page", homePageHandler);
app.get("/", (req, res) => {
  console.log(process.env.NODE_ENV);
  res.send({ env: process.env.NODE_ENV, frontend: config.FRONT_END_URL });
});
console.log(process.env.NODE_ENV);
//app.get("/api/city-search",searchCityHandler);
app.use((req, res, next) => {
  try {
    // set header for swagger.
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self';"
    );

    // const xForwardedFor = (req.headers["x-forwarded-for"] || "").replace(
    //     /:\d+$/,
    //     ""
    // );
    // const ip = xForwardedFor || req.connection.remoteAddress ? .split(":").pop();
    logger.info(
      `------------ API Info ------------
      IMP - API called path: ${req.path},
      method: ${req.method},
      query: ${JSON.stringify(req.query)}, 
      remote address (main/proxy ip):,
      reference: ${req.headers.referer} , 
      user-agent: ${req.headers["user-agent"]}
      ------------ End ------------  `
    );
  } catch (error) {
    logger.error(`error while printing caller info path: ${req.path}`);
  }
  next();
});

const health = async (req, res) => {
  try {
    res.json({
      message: "Server is up an running",
      // eslint-disable-next-line no-undef
      env: process.env.NODE_ENV || "development",
      headers: req.headers,
    });
  } catch (error) {
    console.log(error);
  }
};

app.get("/", health);
app.use((req, res) => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(
      responseValidation(StatusCodes.INTERNAL_SERVER_ERROR, "No route found")
    );
});

app.use((error, req, res) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
    responseValidation(
      StatusCodes.INTERNAL_SERVER_ERROR,
      /* If the environment is development, then return the error message, otherwise return an empty
                          object. */
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === "development" ? error.message : {}
    )
  );
});

export default server;
