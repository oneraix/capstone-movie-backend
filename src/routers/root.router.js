import express from "express";
import authRouter from "./auth.router.js";
import datveRouter from "./datve.router.js";
import rapRouter from "./rap.router.js";
import phimRouter from "./phim.router.js";

const rootRouter = express.Router();

// Health check endpoint
rootRouter.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

rootRouter.use("/QuanLyNguoiDung", authRouter)
rootRouter.use("/QuanLyDatVe", datveRouter)
rootRouter.use("/QuanLyRap", rapRouter)
rootRouter.use("/QuanLyPhim", phimRouter)

export default rootRouter;