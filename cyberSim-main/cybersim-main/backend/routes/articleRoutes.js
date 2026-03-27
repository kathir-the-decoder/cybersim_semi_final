import express from "express";
import { getArticles, getArticleBySlug, createArticle } from "../controllers/articleController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.post("/", protect, admin, createArticle);

export default router;