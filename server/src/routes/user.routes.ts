import express from "express";
import { createUser } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/new", createUser);

export { userRouter };
