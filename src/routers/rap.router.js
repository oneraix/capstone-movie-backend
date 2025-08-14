import express from "express";
import rapController from "../controllers/rap.controller.js";

const rapRouter = express.Router();

// GET /api/QuanLyRap/LayThongTinHeThongRap - Lấy danh sách hệ thống rạp
rapRouter.get("/LayThongTinHeThongRap", rapController.layThongTinHeThongRap);

// GET /api/QuanLyRap/LayThongTinCumRapTheoHeThong - Lấy cụm rạp theo hệ thống
rapRouter.get("/LayThongTinCumRapTheoHeThong", rapController.layThongTinCumRapTheoHeThong);

// GET /api/QuanLyRap/LayThongTinLichChieuHeThongRap - Lấy lịch chiếu theo hệ thống rạp
rapRouter.get("/LayThongTinLichChieuHeThongRap", rapController.layThongTinLichChieuHeThongRap);

// GET /api/QuanLyRap/LayThongTinLichChieuPhim - Lấy lịch chiếu theo phim
rapRouter.get("/LayThongTinLichChieuPhim", rapController.layThongTinLichChieuPhim);

export default rapRouter;
