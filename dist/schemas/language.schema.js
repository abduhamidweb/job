import { Schema, model } from "mongoose";
const LanguageSchema = new Schema({
    language: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
});
const Language = model("Language", LanguageSchema);
export default Language;
