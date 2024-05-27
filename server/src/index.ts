import express from "express";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 3000;

//middle wares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//route imports
import { userRouter } from "./routes/user.routes.js";
import { caltachAllError } from "./utils/caltachAllError.js";

//route
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to ecommerce app server root route",
  });
});

app.listen(port, () => {
  console.log(`app listning at port ${port}`);
});

app.use(caltachAllError);
