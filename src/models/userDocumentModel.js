import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const userDocumentSchema = {
    _id: { type: String, default: generatePublicId, required: true },
    title : {type : Object, required : true},
    uploaded_by : {type : String, required : true},
    uploaded_for : {type : String, required : true},
    created_at: { type: Date, default: Date.now },
    verification: { type: Boolean, default: false},
    file: {type: Buffer , required: true},
    mimetype: { type: String , required: true},
    size: { type: Number, required: true},
  };
  
  const documentsModel = mongoose.model("document", userDocumentSchema);
  
  export default documentsModel;