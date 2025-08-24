import express from "express";
import datveController from "../controllers/datve.controller.js";
import protect from "../common/middlewares/protect.middleware.js";
import checkPermission from "../common/middlewares/check-permission.middleware.js";

const datveRouter = express.Router();

// Đặt vé - cần đăng nhập
datveRouter.post("/DatVe", protect, datveController.datVe);

// Lấy danh sách phòng vé - không cần đăng nhập
datveRouter.get("/LayDanhSachPhongVe", datveController.layDanhSachPhongVe);

// Tạo lịch chiếu - cần đăng nhập và quyền QuanTri
datveRouter.post("/TaoLichChieu", protect, checkPermission, datveController.taoLichChieu);

export default datveRouter;
