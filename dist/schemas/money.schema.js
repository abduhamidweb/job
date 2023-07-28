import { Schema, model, Types } from "mongoose";
const typeOfMoneySchema = new Schema({
    moneyType: {
        type: String,
        required: [true, 'Money type is required']
    },
    job_id: {
        type: Types.ObjectId,
        ref: 'Jobs'
    },
}, {
    timestamps: true,
});
export default model("TypeOfMoney", typeOfMoneySchema);
