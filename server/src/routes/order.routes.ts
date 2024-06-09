import express from "express";
import { newOrder } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/new", newOrder);

export { orderRouter };
