import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const notificationSchema = {
    _id: { type: String, default: generatePublicId, required: true },
    title : {type : Object, required : true},
    description : {type : String, required : true},
    receiver_id : {type : Array, required: true},
    created_at: { type: Date, default: Date.now },
    link : {type: String},
    active: {type: Boolean, default: true},
    image_link: {type: String},
    sender_id: {type : String, required : true},
    read: {type: Boolean, default: false}
  };
  
  const notificationModel = mongoose.model("notification", notificationSchema);
  
  export default notificationModel;