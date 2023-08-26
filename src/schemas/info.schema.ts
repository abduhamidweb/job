import { Schema, model, Types, InferSchemaType } from "mongoose";

const infoSchema = new Schema(
  {
   jobText : {
    type : String,
    required : [true, 'Job info is required']
   },
   job_id : {
    type : Types.ObjectId,
    ref : 'FileData'
   },
  },
  {
    timestamps: true,
  }
);

type info = InferSchemaType<typeof infoSchema>;
export default model<info>("MoreInfo", infoSchema);