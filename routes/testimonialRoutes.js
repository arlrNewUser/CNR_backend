import express from "express";
import {
    addTestimonial,
    getTestimonials,
    getTestimonial
} from "../controllers/testimonialController.js";
import checkAuth from "../middleware/authMiddleware.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router
    .route("/")
    .post(addTestimonial)
    .get(checkAuth, checkAdmin, getTestimonials)

// Private routes
router
    .route("/:date")
    .get(checkAuth, checkAdmin, getTestimonial);

export default router;
