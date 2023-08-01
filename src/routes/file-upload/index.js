import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import config from "../../../config/index.js";
import AWS, { S3 } from "aws-sdk";
import * as path from "path";
import Joi from "joi";
import {
  ERROR,
  FILE_MESSAGE,
  maxFileSize,
  validFile,
} from "../../commons/global-constants.js";
import {
  logsError,
  logsErrorAndUrl,
  responseGenerators,
  responseValidation,
} from "../../lib/utils";
import { generatePublicId } from "../../commons/common-functions.js";
import { CustomError, FileTypeIssue } from "../../helpers/custome.error.js";

dotenv.config();

AWS.config.update({
  // eslint-disable-next-line no-undef
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  // eslint-disable-next-line no-undef
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  // region: process.env.REGION,
});

export const getS3 = () => {
  return new S3({
    // eslint-disable-next-line no-undef
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    // eslint-disable-next-line no-undef
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  });
};

export const fileName = (data) => {
  const { originalname } = data;
  return `${generatePublicId()}${path.extname(originalname)}`;
};

export const uploads3 = async (file, bucket, name, mimeType) => {
  try {
    const s3 = getS3();
    console.log(s3.config.accessKeyId)
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimeType,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  } catch (error) {
    // set logs Error function
    logsError(error);
  }
};


export const documentUploadHandler = async (req, res) => {
  try {
    const data = req.file;
    const fileSize = data.size;
   // await documentUploadValidation.validateAsync(req.body);
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators(
            {},
            StatusCodes.BAD_REQUEST,
            FILE_MESSAGE.ATTACHMENT_FILE_ERROR,
            true
          )
        );
    }

    if (!validFile.includes(data.mimetype)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators(
            {},
            StatusCodes.BAD_REQUEST,
            FILE_MESSAGE.NOT_VALID,
            true
          )
        );
    }
    if (fileSize > maxFileSize) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          responseGenerators(
            {},
            StatusCodes.BAD_REQUEST,
            FILE_MESSAGE.FILE_SIZE_EXCEED,
            true
          )
        );
    }
    const fileData = await uploads3(
      data.buffer,
      config.S3_BUCKET_NAME,
      fileName(data),
      data.mimetype
    );
    if (fileData.message) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          responseGenerators(
            {},
            StatusCodes.INTERNAL_SERVER_ERROR,
            ERROR.INTERNAL_SERVER_ERROR,
            true
          )
        );
    }

    return res.status(StatusCodes.OK).send(
      responseGenerators(
        {
          link: fileData.Location,
        },
        StatusCodes.OK,
        FILE_MESSAGE.UPLOADED,
        false
      )
    );
  } catch (error) {
    // set logs Error function
    // logsErrorAndUrl(req, error);
    if (
      error instanceof CustomError ||
      error instanceof FileTypeIssue ||
      error instanceof ValidationError
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(responseValidation(StatusCodes.BAD_REQUEST, error.message, true));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(
        responseGenerators(
          {},
          StatusCodes.INTERNAL_SERVER_ERROR,
          ERROR.INTERNAL_SERVER_ERROR,
          true
        )
      );
  }
};
