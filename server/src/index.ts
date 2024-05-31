import express from "express";
import cookieParser from "cookie-parser";
import { caltachAllError } from "./utils/caltachAllError.js";

const app = express();

const port = process.env.PORT || 3000;

//middle wares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

//route imports
import { userRouter } from "./routes/user.routes.js";
import { productRouter } from "./routes/product.routes.js";

//route
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to ecommerce app server root route",
  });
});

app.use(caltachAllError);

app.listen(port, () => {
  console.log(`app listning at port ${port}`);
});
