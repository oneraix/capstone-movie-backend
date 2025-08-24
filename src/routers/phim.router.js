import express from "express";
import phimController from "../controllers/phim.controller.js";
import protect from "../common/middlewares/protect.middleware.js";
import checkPermission from "../common/middlewares/check-permission.middleware.js";
import uploadCloud from "../common/multer/cloud.multer.js";

const phimRouter = express.Router();

// GET routes - không cần đăng nhập
phimRouter.get("/LayDanhSachBanner", phimController.layDanhSachBanner);
phimRouter.get("/LayDanhSachPhim", phimController.layDanhSachPhim);
phimRouter.get("/LayDanhSachPhimPhanTrang", phimController.layDanhSachPhimPhanTrang);
phimRouter.get("/LayDanhSachPhimTheoNgay", phimController.layDanhSachPhimTheoNgay);
phimRouter.get("/LayThongTinPhim", phimController.layThongTinPhim);

// POST routes - cần đăng nhập và quyền QuanTri
phimRouter.post("/ThemPhimUploadHinh", protect, checkPermission, uploadCloud.single("hinhAnh"), phimController.themPhimUploadHinh);
phimRouter.post("/CapNhatPhimUpload", protect, checkPermission, uploadCloud.single("hinhAnh"), phimController.capNhatPhimUpload);
phimRouter.post("/", protect, checkPermission, phimController.themPhim);

// DELETE routes - cần đăng nhập và quyền QuanTri
phimRouter.delete("/XP", protect, checkPermission, phimController.xoaPhimXP);
phimRouter.delete("/XoaPhim", protect, checkPermission, phimController.xoaPhim);

export default phimRouter;
