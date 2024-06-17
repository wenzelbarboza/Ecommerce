import express from "express";
import cookieParser from "cookie-parser";
import { caltachAllError } from "./utils/caltachAllError.js";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config({
  path: "./.env",
});

console.log("batabse url is: ", process.env.MESSAGE);

export const myCache = new NodeCache();
const app = express();

const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

//route imports
import { userRouter } from "./routes/user.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

//route
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("api/v1/payment", paymentRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to ecommerce app server root route",
  });
});

app.use(caltachAllError);

app.listen(port, () => {
  console.log(`app listning at port ${port}`);
});
