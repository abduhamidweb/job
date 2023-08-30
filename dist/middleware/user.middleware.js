var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import err from "../Responser/error.js";
import Users from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    checkBody(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, userEmail: email, } = req.body;
                if (!fullName || !email) {
                    return err(res, "Invalid data", 400);
                }
                const emailCheck = yield Users.findOne({
                    email: email,
                });
                if (emailCheck) {
                    return err(res, "The email is already taken", 409);
                }
                let userTest = new Users({
                    fullName,
                    email
                });
                yield userTest.save();
                yield Users.findOneAndDelete({ email });
                next();
            }
            catch (error) {
                err(res, error.message, 400);
            }
        });
    },
    idChecker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const id = JWT.VERIFY(token).id;
                if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                    return err(res, "Invalid id", 400);
                }
                const existingProjectData = yield Users.findById(id).exec();
                if (!existingProjectData) {
                    return err(res, "User not found", 404);
                }
                next();
            }
            catch (error) {
                err(res, "Server error", 500);
            }
        });
    },
    putChecker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const { fullName, userEmail: email, password } = req.body;
                const emailCheck = email ? yield Users.findOne({
                    email: email,
                    _id: { $ne: id },
                }) : null;
                if (emailCheck) {
                    return err(res, "The email is already taken", 409);
                }
                next();
            }
            catch (error) {
                return err(res, error.message, 409);
            }
        });
    },
    isUsersData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let secretKey = process.env.SECRET_KEY;
                let { id } = req.params;
                let token = req.headers.token;
                if (!token)
                    return err(res, "Forbidden", 403);
                let userId = JWT.VERIFY(token);
                if (userId.id !== id) {
                    return err(res, "Forbidden", 403);
                }
                next();
            }
            catch (error) {
                return err(res, "Forbidden", 403);
            }
        });
    },
};
