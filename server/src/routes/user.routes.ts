import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRouter = express.Router();

//route user - /api/v1/users
// create user - /new
userRouter.post("/new", createUser);
// getAllUsers user - /all
userRouter.get("/all", getAllUsers);
// getUser - /:id - dynamic
// userRouter.get("/:id", getUser);
userRouter.route("/:id").get(getUser).delete(isAdmin, deleteUser);

export { userRouter };
