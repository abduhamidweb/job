import { Schema, model } from "mongoose";
import { ILanguage } from "../interface/interface";

const LanguageSchema = new Schema<ILanguage>({
    language: {
        type: String,
        required: true,
    },
    level: {
    type: String,
        required: true,
    },
});

const Language = model<ILanguage>("Language", LanguageSchema);

export default Language;
