import { responseSuccess } from "../common/helpers/response.helper.js";
import phimService from "../services/phim.service.js";

const phimController = {
    // GET /api/QuanLyPhim/LayDanhSachBanner
    layDanhSachBanner: async (req, res) => {
        const result = await phimService.layDanhSachBanner(req);
        const resData = responseSuccess(result, "Lấy danh sách banner thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyPhim/LayDanhSachPhim
    layDanhSachPhim: async (req, res) => {
        const result = await phimService.layDanhSachPhim(req);
        const resData = responseSuccess(result, "Lấy danh sách phim thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyPhim/LayDanhSachPhimPhanTrang
    layDanhSachPhimPhanTrang: async (req, res) => {
        const result = await phimService.layDanhSachPhimPhanTrang(req);
        const resData = responseSuccess(result, "Lấy danh sách phim phân trang thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyPhim/LayDanhSachPhimTheoNgay
    layDanhSachPhimTheoNgay: async (req, res) => {
        const result = await phimService.layDanhSachPhimTheoNgay(req);
        const resData = responseSuccess(result, "Lấy danh sách phim theo ngày thành công");
        res.status(resData.statusCode).json(resData);
    },

    // POST /api/QuanLyPhim/ThemPhimUploadHinh
    themPhimUploadHinh: async (req, res) => {
        const result = await phimService.themPhimUploadHinh(req);
        const resData = responseSuccess(result, "Thêm phim với upload hình thành công");
        res.status(resData.statusCode).json(resData);
    },

    // POST /api/QuanLyPhim/CapNhatPhimUpload
    capNhatPhimUpload: async (req, res) => {
        const result = await phimService.capNhatPhimUpload(req);
        const resData = responseSuccess(result, "Cập nhật phim với upload hình thành công");
        res.status(resData.statusCode).json(resData);
    },

    // POST /api/QuanLyPhim
    themPhim: async (req, res) => {
        const result = await phimService.themPhim(req);
        const resData = responseSuccess(result, "Thêm phim thành công");
        res.status(resData.statusCode).json(resData);
    },

    // DELETE /api/QuanLyPhim/XP
    xoaPhimXP: async (req, res) => {
        const result = await phimService.xoaPhimXP(req);
        const resData = responseSuccess(result, "Xóa phim thành công");
        res.status(resData.statusCode).json(resData);
    },

    // DELETE /api/QuanLyPhim/XoaPhim
    xoaPhim: async (req, res) => {
        const result = await phimService.xoaPhim(req);
        const resData = responseSuccess(result, "Xóa phim thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyPhim/LayThongTinPhim
    layThongTinPhim: async (req, res) => {
        const result = await phimService.layThongTinPhim(req);
        const resData = responseSuccess(result, "Lấy thông tin phim thành công");
        res.status(resData.statusCode).json(resData);
    },
};

export default phimController;
