import { asyncHandler } from "../utils/asyncHandler.js";

export const newOrder = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "welcome to api/v1/order/new",
  });
});
