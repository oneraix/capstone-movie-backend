import { BadrequestException } from "../helpers/exception.helper";

const checkPermission = async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new BadrequestException("User không tồn tại từ protect");
    }

    // Nếu maLoaiNguoiDung là "QuanTri" - quyền cao nhất
    if (user.maLoaiNguoiDung === "QuanTri") {
        next();
        return;
    }

    // Các API chỉ dành cho QuanTri
    const adminOnlyEndpoints = [
        "/api/QuanLyNguoiDung/LayDanhSachNguoiDung",
        "/api/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang", 
        "/api/QuanLyNguoiDung/TimKiemNguoiDung",
        "/api/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang",
        "/api/QuanLyNguoiDung/ThemNguoiDung",
        "/api/QuanLyNguoiDung/XoaNguoiDung",
        "/api/QuanLyDatVe/TaoLichChieu",
        "/api/QuanLyPhim/ThemPhimUploadHinh",
        "/api/QuanLyPhim/CapNhatPhimUpload",
        "/api/QuanLyPhim",
        "/api/QuanLyPhim/XP",
        "/api/QuanLyPhim/XoaPhim"
    ];

    const currentEndpoint = req.baseUrl + req.route?.path;
    
    if (adminOnlyEndpoints.includes(currentEndpoint)) {
        throw new BadrequestException("Không có quyền truy cập - Chỉ dành cho Quản trị viên");
    }

    next();
};

export default checkPermission;