import express from "express";

const paymentRouter = express.Router();

//
// coupon/new
// coupon/all
// discount
// coupon/:id - to delete

//base rout for order - /api/v1/payment
paymentRouter.post("/coupon/new");

export { paymentRouter };
