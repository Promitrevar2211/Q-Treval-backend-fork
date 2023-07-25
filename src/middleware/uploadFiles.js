import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { maxFileSize} from '../commons/global-constants.js';

import { FileTypeIssue } from '../helpers/custome.error.js'

dotenv.config();

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize, // we are allowing only 1 MB files
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    console.log(ext);
    if (ext != '.jpeg' && ext != '.jpg' && ext != '.png') {
      return callback(new FileTypeIssue('Error, Only jpeg, jpg or png file is allowed'), false)
    }
    callback(null, true)
  },
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});