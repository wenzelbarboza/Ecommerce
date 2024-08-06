import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import {
  deleteProduct,
  details,
  filterProduct,
  getLatestProducts,
  getProductCatagories,
  getProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const productRouter = express.Router();

productRouter.post("/new", isAdmin, singleUpload, newProduct);
productRouter.get("/latest", getLatestProducts);
productRouter.get("/all", isAdmin, getProducts);
productRouter.get("/catagories", getProductCatagories);
productRouter.get("/search", filterProduct);
productRouter
  .route("/:id")
  .get(details)
  .delete(isAdmin, deleteProduct)
  .put(isAdmin, singleUpload, updateProduct);

export { productRouter };
