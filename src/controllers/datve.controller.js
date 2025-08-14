import { responseSuccess } from "../common/helpers/response.helper.js";
import datVeService from "../services/datve.service.js";

const datVeController = {
    // POST /api/QuanLyDatVe/DatVe
    datVe: async (req, res) => {
        const result = await datVeService.datVe(req);
        const resData = responseSuccess(result, "Đặt vé thành công");
        res.status(resData.statusCode).json(resData);
    },

    // GET /api/QuanLyDatVe/LayDanhSachPhongVe
    layDanhSachPhongVe: async (req, res) => {
        const result = await datVeService.layDanhSachPhongVe(req);
        const resData = responseSuccess(result, "Lấy danh sách phòng vé thành công");
        res.status(resData.statusCode).json(resData);
    },

    // POST /api/QuanLyDatVe/TaoLichChieu
    taoLichChieu: async (req, res) => {
        const result = await datVeService.taoLichChieu(req);
        const resData = responseSuccess(result, "Tạo lịch chiếu thành công");
        res.status(resData.statusCode).json(resData);
    },
};

export default datVeController;
