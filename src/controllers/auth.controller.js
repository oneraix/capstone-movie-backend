import { responseSuccess } from "../common/helpers/response.helper";
import authService from "../services/auth.service";

const authController = {
    register: async(req, res) =>{
        const result = await authService.register(req);
        const resData = responseSuccess(result);
        res.status(resData.statusCode).json(resData);
    },
    login: async(req,res)=> {
        const result = await authService.login(req);
        const resData = responseSuccess(result);
        res.status(resData.statusCode).json(resData);
    },
    getInfo: async(req, res)=>{
        const result = await authService.getInfo(req);
        const resData = responseSuccess(result);
        res.status(resData.statusCode).json(resData);
    },
   googleLogin: async (req, res) => {
      const result = await authService.googleLogin(req);
      const resData = responseSuccess(result);
      res.status(resData.statusCode).json(resData);
   },

   refreshToken: async (req, res) => {
      const result = await authService.refreshToken(req);
      const resData = responseSuccess(result);
      res.status(resData.statusCode).json(resData);
   },

   // GET /api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung
   layDanhSachLoaiNguoiDung: async (req, res) => {
      const result = await authService.layDanhSachLoaiNguoiDung(req);
      const resData = responseSuccess(result, "Lấy danh sách loại người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },

   // GET /api/QuanLyNguoiDung/LayDanhSachNguoiDung
   layDanhSachNguoiDung: async (req, res) => {
      const result = await authService.layDanhSachNguoiDung(req);
      const resData = responseSuccess(result, "Lấy danh sách người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },

   // GET /api/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang
   layDanhSachNguoiDungPhanTrang: async (req, res) => {
      const result = await authService.layDanhSachNguoiDungPhanTrang(req);
      const resData = responseSuccess(result, "Lấy danh sách người dùng phân trang thành công");
      res.status(resData.statusCode).json(resData);
   },

   // GET /api/QuanLyNguoiDung/TimKiemNguoiDung
   timKiemNguoiDung: async (req, res) => {
      const result = await authService.timKiemNguoiDung(req);
      const resData = responseSuccess(result, "Tìm kiếm người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },

   // GET /api/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang
   timKiemNguoiDungPhanTrang: async (req, res) => {
      const result = await authService.timKiemNguoiDungPhanTrang(req);
      const resData = responseSuccess(result, "Tìm kiếm người dùng phân trang thành công");
      res.status(resData.statusCode).json(resData);
   },

   // POST /api/QuanLyNguoiDung/ThongTinTaiKhoan
   thongTinTaiKhoan: async (req, res) => {
      const result = await authService.thongTinTaiKhoan(req);
      const resData = responseSuccess(result, "Lấy thông tin tài khoản thành công");
      res.status(resData.statusCode).json(resData);
   },

   // POST /api/QuanLyNguoiDung/LayThongTinNguoiDung
   layThongTinNguoiDung: async (req, res) => {
      const result = await authService.layThongTinNguoiDung(req);
      const resData = responseSuccess(result, "Lấy thông tin người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },

   // POST /api/QuanLyNguoiDung/ThemNguoiDung
   themNguoiDung: async (req, res) => {
      const result = await authService.themNguoiDung(req);
      const resData = responseSuccess(result, "Thêm người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },

   // PUT & POST /api/QuanLyNguoiDung/CapNhatThongTinNguoiDung
   capNhatThongTinNguoiDung: async (req, res) => {
      const result = await authService.capNhatThongTinNguoiDung(req);
      const resData = responseSuccess(result, "Cập nhật thông tin người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },

   // DELETE /api/QuanLyNguoiDung/XoaNguoiDung
   xoaNguoiDung: async (req, res) => {
      const result = await authService.xoaNguoiDung(req);
      const resData = responseSuccess(result, "Xóa người dùng thành công");
      res.status(resData.statusCode).json(resData);
   },
};

export default authController