import express from "express";
import {
  all,
  deleteOrder,
  myOrders,
  newOrder,
  processOrder,
  singleOrder,
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

//base rout for order - /api/v1/order
orderRouter.post("/new", newOrder);
orderRouter.get("/my", myOrders);
orderRouter.get("/all", all);
orderRouter
  .route("/:id")
  .get(singleOrder)
  .put(processOrder)
  .delete(deleteOrder);

export { orderRouter };
