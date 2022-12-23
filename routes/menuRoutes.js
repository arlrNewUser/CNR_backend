import express from "express";
import {
    addMenu,
    getMenus,
    getMenu,
    updateMenu,
    removeMenu,
    addContent,
    getContents,
    getContent,
    updateContent,
    removeContent,
} from "../controllers/menuController.js";
import checkAuth from "../middleware/authMiddleware.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router
    .route("/contents")
    .post(checkAuth, checkAdmin, addContent)
    .get(checkAuth, checkAdmin, getContents);

router
    .route("/contents/:id")
    .get(getContent)
    .put(checkAuth, checkAdmin, updateContent)
    .delete(checkAuth, checkAdmin, removeContent);

router
    .route("/")
    .post(checkAuth, checkAdmin, addMenu)
    .get(getMenus);

router
    .route("/:date")
    .get(getMenu)
    .put(checkAuth, checkAdmin, updateMenu)
    .delete(checkAuth, checkAdmin, removeMenu);

export default router;
