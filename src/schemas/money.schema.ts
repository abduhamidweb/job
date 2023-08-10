import { Schema, model, Types, InferSchemaType } from "mongoose";

const typeOfMoneySchema = new Schema(
  {
   moneyType : {
    type : String,
    required : [true, 'Money type is required']
   },
   job_id : {
    type : Types.ObjectId,
    ref : 'Jobs'
   },
  },
  {
    timestamps: true,
  }
);

type typeOfMoney = InferSchemaType<typeof typeOfMoneySchema>;
export default model<typeOfMoney>("TypeOfMoney", typeOfMoneySchema);