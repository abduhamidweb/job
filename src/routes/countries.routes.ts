import { Router } from "express";
import countriesController from "../controllers/countries.controller.js";

const router = Router();
router.get('/countries',countriesController.countriesGetter)
// router.get('/nation',countriesController.nationGetter)
 export default router