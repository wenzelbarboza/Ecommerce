import express from "express";
import {
  createPaymentIntent,
  discount,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

//
// coupon/new
// coupon/all
// discount
// coupon/:id - to delete

//base rout for order - /api/v1/payment

paymentRouter.post("/create", createPaymentIntent);

paymentRouter.post("/coupon/new");
paymentRouter.get("/coupon/get-discount", discount);

export { paymentRouter };
