import express from "express";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.use('/test', ()=>{});


export default router