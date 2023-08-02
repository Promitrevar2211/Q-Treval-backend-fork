import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions.js";

const chatSchema = {
    _id: { type: String, default: generatePublicId, required: true },
    member_id : {type : String, required : true},
    chats : {type : Array, default: []},
    trip_id : {type : String, required : true},
    created_at: { type: Date, default: Date.now },
  };
  
  const chatModel = mongoose.model("chats", chatSchema);
  
  export default chatModel;