import express from "express";
import { createUser } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/new", createUser);

export { userRouter };
