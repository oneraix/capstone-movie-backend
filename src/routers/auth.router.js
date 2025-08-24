import express from "express";
import authController from "../controllers/auth.controller";
import protect from "../common/middlewares/protect.middleware";
import checkPermission from "../common/middlewares/check-permission.middleware.js";
const authRouter = express.Router()

// Original auth routes
authRouter.post("/register", authController.register)
authRouter.post("/login",authController.login )
authRouter.get("/get-info", protect,authController.getInfo)
authRouter.post("/google-login", authController.googleLogin)
authRouter.post("/refresh-token",authController.refreshToken)

// QuanLyNguoiDung routes
authRouter.post("/DangKy", authController.register)
authRouter.post("/DangNhap", authController.login)

// GET routes
authRouter.get("/LayDanhSachLoaiNguoiDung", authController.layDanhSachLoaiNguoiDung)
authRouter.get("/LayDanhSachNguoiDung", protect, checkPermission, authController.layDanhSachNguoiDung)
authRouter.get("/LayDanhSachNguoiDungPhanTrang", protect, checkPermission, authController.layDanhSachNguoiDungPhanTrang)
authRouter.get("/TimKiemNguoiDung", protect, checkPermission, authController.timKiemNguoiDung)
authRouter.get("/TimKiemNguoiDungPhanTrang", protect, checkPermission, authController.timKiemNguoiDungPhanTrang)

// GET routes for user info (đúng chuẩn REST)
authRouter.get("/ThongTinTaiKhoan", protect, authController.thongTinTaiKhoan)

// POST routes
authRouter.post("/LayThongTinNguoiDung", protect, authController.layThongTinNguoiDung)
authRouter.post("/ThemNguoiDung", protect, checkPermission, authController.themNguoiDung)

// PUT routes (cập nhật toàn bộ thông tin)
authRouter.put("/CapNhatThongTinNguoiDung", protect, authController.capNhatThongTinNguoiDung)

// PATCH routes (cập nhật một phần thông tin) - thêm option này
authRouter.patch("/CapNhatThongTinNguoiDung", protect, authController.capNhatThongTinNguoiDung)

// DELETE routes
authRouter.delete("/XoaNguoiDung", protect, checkPermission, authController.xoaNguoiDung)

export default authRouter