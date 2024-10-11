import { Router } from "express";
import { createCategory, deleteCategory, updateCategory } from "../../controllers/admin.controllers.js";

const router = Router();

//Categories related routes
router.route("/categories").post(createCategory);
router.route("/categories/:id").put(updateCategory);
router.route("/categories/:id").delete(deleteCategory);

export default router;
