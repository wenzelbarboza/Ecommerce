import express from "express";
import {
  barChart,
  dashboardsStats,
  lineChart,
  pieChart,
} from "../controllers/stats.controller.js";

const statsRouter = express.Router();

//route user - /api/v1/dashboard/

statsRouter.get("/stats", dashboardsStats);
statsRouter.get("/pie", pieChart);
statsRouter.get("/bar", barChart);
statsRouter.get("/line", lineChart);

export { statsRouter };
