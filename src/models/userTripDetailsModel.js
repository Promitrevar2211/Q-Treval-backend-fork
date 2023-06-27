import mongoose from "mongoose";
import { generatePublicId } from "../commons/common-functions";

const tripDetailsSchema = {
  _id: { type: String, default: generatePublicId, required: true },
  user_id: { type: String, required: true },
  name : {type : String, required : true},
  email : {type : String, required : true},
  phoneNo : {type : String, required : true},
  destinationId: { type: String, required: true },
  travel_type: { type: String, required: true, enum: ['One Way', 'Return'], default : "One Way" },
  going_travel_date  :{type : Date,required : true},
  return_travel_date : {type : Date},
  flight_type  :{ type: String, required: true, enum: ['Economy', 'Business','First Class'], default : "Economy" },
  book_hotel : {type : String, required : true, enum : ['Yes','No'], default : "Yes"},
  place: { type: String, required :true, default: "" },
  city: { type: String, required :true,  default: "" },
  state: { type: String, required :true,  default: "" },
  country: { type: String, required :true,  default: "" },
  isDeleted : {type : Boolean, default : false},
  created_at: { type: Date, default: Date.now },
  updated_at : {type : Date, default : Date.now}
};

const tripDetailsModel = mongoose.model("userTripDetails", tripDetailsSchema);

export default tripDetailsModel;
