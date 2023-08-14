var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { countries } from "country-data-list";
export default {
    countriesGetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(countries.all.map(e => e.name));
        });
    },
    nationGetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(countries.all);
        });
    },
};
