import { responseSuccess } from "../common/helpers/response.helper.js";
import rapService from "../services/rap.service.js";

const rapController = {
    // GET /api/QuanLyRap/LayThongTinHeThongRap
    layThongTinHeThongRap: async (req, res) => {
        const result = await rapService.layThongTinHeThongRap(req);
        const resData = responseSuccess(result, "Lấy thông tin hệ thống rạp thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyRap/LayThongTinCumRapTheoHeThong
    layThongTinCumRapTheoHeThong: async (req, res) => {
        const result = await rapService.layThongTinCumRapTheoHeThong(req);
        const resData = responseSuccess(result, "Lấy thông tin cụm rạp theo hệ thống thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyRap/LayThongTinLichChieuHeThongRap
    layThongTinLichChieuHeThongRap: async (req, res) => {
        const result = await rapService.layThongTinLichChieuHeThongRap(req);
        const resData = responseSuccess(result, "Lấy thông tin lịch chiếu hệ thống rạp thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyRap/LayThongTinLichChieuPhim
    layThongTinLichChieuPhim: async (req, res) => {
        const result = await rapService.layThongTinLichChieuPhim(req);
        const resData = responseSuccess(result, "Lấy thông tin lịch chiếu phim thành công");
        res.status(resData.statusCode).json(resData);
    },
};

export default rapController;
