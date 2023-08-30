var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import err from "../Responser/error.js";
import Users from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
import sha256 from "sha256";
import { sendConfirmationEmail } from "../utils/nodemailer.js";
import responser from "../Responser/data.js";
import path from "path";
import jobSchema from "../schemas/job.schema.js";
import fs from "fs";
import { client } from "../db/redis.js";
let { msg, send } = responser;
// client.connect(); 
export default {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { fullName, userEmail: email, password, confirmationCode, } = req.body;
                if (password) {
                    if (!confirmationCode) {
                        const generatedConfirmationCode = yield sendConfirmationEmail(email);
                        yield client.set(email, generatedConfirmationCode);
                        return msg(res, "Confirmation code sent to the email", 200);
                    }
                    if (confirmationCode !== (yield client.get(email))) {
                        return msg(res, "The confirmation code you entered is incorrect. Please try again.", 400);
                    }
                }
                let pass = process.env.SECRET_KEY;
                const user = new Users({
                    fullName,
                    email,
                    password: sha256(password || pass),
                });
                yield user.save();
                client.set(email, "");
                res.status(201).json({
                    token: JWT.SIGN({
                        id: user._id,
                    }),
                    data: user,
                });
            }
            catch (error) {
                err(res, error.message, 500);
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield Users.find()
                    .populate("education")
                    .populate("resume")
                    .populate("experience")
                    .populate("roleAndSalary")
                    .populate("skills")
                    .populate("lang")
                    .populate({
                    path: "workExperience",
                    populate: "projects",
                });
                if (!user) {
                    return res.status(404).json({ message: "Users not found" });
                }
                return res.status(200).json(user);
            }
            catch (err) {
                console.error("Error fetching user:", err);
                res
                    .status(500)
                    .json({ message: "An error occurred while fetching the user" });
            }
        });
    },
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const user = yield Users.findById(userId)
                    .populate("education")
                    .populate("resume")
                    .populate("experience")
                    .populate("roleAndSalary")
                    .populate("skills")
                    .populate("lang")
                    .populate("workExperience");
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(user);
            }
            catch (err) {
                console.error("Error fetching user:", err);
                res
                    .status(500)
                    .json({ message: "An error occurred while fetching the user" });
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { userEmail: email, password } = req.body;
                let user = yield Users.findOne({
                    email,
                    password: sha256(password || process.env.SECRET_KEY),
                });
                if (!user) {
                    return err(res, "Email or password wrong!", 400);
                }
                send(res, {
                    data: user,
                    token: JWT.SIGN({
                        id: user._id,
                    }),
                });
            }
            catch (error) {
                err(res, error.message, 500);
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const id = JWT.VERIFY(token).id;
                let reqFiles = req.files;
                if (req.files && reqFiles) {
                    const profilePicture = reqFiles.profilePicture;
                    const allowedExtensions = [".jpg", ".jpeg", ".png"];
                    const ext = path.extname(profilePicture.name).toLowerCase();
                    if (!allowedExtensions.includes(ext)) {
                        return res
                            .status(400)
                            .json({ message: "Only JPEG and PNG image files are allowed" });
                    }
                    const fileName = id + "." + profilePicture.mimetype.split("/")[1];
                    let direction = path.join(process.cwd(), "src", "public", "images");
                    const uploadPath = path.join(direction, fileName);
                    fs.readdir(direction, (err, file) => {
                        if (file[0] && file[0].split(".")[0] == id) {
                            fs.unlinkSync(direction + "/" + file[0]);
                        }
                    });
                    setTimeout(() => {
                        profilePicture.mv(uploadPath, (err) => {
                            if (err) {
                                return res.status(500).json({ message: err });
                            }
                        });
                    }, 3);
                    yield Users.findByIdAndUpdate(id, {
                        profilePicture: "/images/" + fileName,
                    });
                }
                const updateData = req.body;
                const requiredProperties = [
                    "fullName",
                    "available",
                    "resume",
                    "linkedIn",
                    "phoneNumber",
                    "nationality",
                    "residence",
                    "aboutyourself",
                ];
                const foundProperty = requiredProperties.find((property) => req.body[property]);
                if ((Object.keys(updateData).length === 0 || !foundProperty) &&
                    !req.files) {
                    return err(res, "No data provided for update.", 400);
                }
                const existingData = yield Users.findById(id);
                if (!existingData) {
                    return res.status(404).json({ message: "User not found." });
                }
                for (const field in updateData) {
                    if (updateData.hasOwnProperty(field)) {
                        const fieldValue = updateData[field];
                        if (fieldValue && requiredProperties.includes(field)) {
                            existingData[field] = fieldValue;
                        }
                    }
                }
                const updatedData = yield existingData.save();
                res.status(201).json({
                    data: updatedData,
                    message: "User successfully updated.",
                });
            }
            catch (error) {
                err(res, error.message, 500);
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const deletedUser = yield Users.findByIdAndDelete(userId);
                if (!deletedUser) {
                    err(res, "User not found", 404);
                }
                msg(res, "User deleted successfully");
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    apply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let { jobId } = req.body;
                if (!jobId) {
                    return res.status(400).json({ message: "Invalid data", status: 400 });
                }
                let updatedJob = yield jobSchema.findByIdAndUpdate(jobId, {
                    $push: {
                        employeies: userId,
                    },
                });
                if (!updatedJob) {
                    return res.status(404).json({ message: "Job not found", status: 404 });
                }
                return res.status(201).json("Sucsessfully applied");
            }
            catch (error) {
                return res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
            }
        });
    },
};
