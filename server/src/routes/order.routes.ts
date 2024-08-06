import express from "express";
import {
  all,
  deleteOrder,
  myOrders,
  newOrder,
  processOrder,
  singleOrder,
} from "../controllers/order.controllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const orderRouter = express.Router();

//base rout for order - /api/v1/order
orderRouter.post("/new", newOrder);
orderRouter.get("/my", myOrders);
orderRouter.get("/all", isAdmin, all);
orderRouter
  .route("/:id")
  .get(isAdmin, singleOrder)
  .put(isAdmin, processOrder)
  .delete(isAdmin, deleteOrder);

export { orderRouter };
