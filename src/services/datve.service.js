import { BadrequestException } from "../common/helpers/exception.helper.js";
import prisma from "../common/prisma/init.prisma.js";

const datVeService = {
    // Đặt vé
    datVe: async (req) => {
        const { maLichChieu, danhSachVe } = req.body;
        const user = req.user;

        if (!user) {
            throw new BadrequestException("Người dùng chưa đăng nhập");
        }

        if (!maLichChieu || !danhSachVe || !Array.isArray(danhSachVe) || danhSachVe.length === 0) {
            throw new BadrequestException("Thông tin đặt vé không hợp lệ");
        }

        // Kiểm tra lịch chiếu tồn tại
        const lichChieu = await prisma.lichChieu.findUnique({
            where: { maLichChieu: parseInt(maLichChieu) },
            include: {
                RapPhim: {
                    include: {
                        CumRap: {
                            include: {
                                HeThongRap: true
                            }
                        }
                    }
                },
                Phim: true
            }
        });

        if (!lichChieu) {
            throw new BadrequestException("Lịch chiếu không tồn tại");
        }

        // Kiểm tra ghế có tồn tại và chưa được đặt
        const danhSachMaGhe = danhSachVe.map(ve => parseInt(ve.maGhe));
        
        // Kiểm tra ghế tồn tại
        const gheList = await prisma.ghe.findMany({
            where: {
                maGhe: { in: danhSachMaGhe },
                maRap: lichChieu.maRap
            }
        });

        if (gheList.length !== danhSachMaGhe.length) {
            throw new BadrequestException("Một hoặc nhiều ghế không tồn tại trong rạp này");
        }

        // Kiểm tra ghế đã được đặt chưa
        const ghesDaDat = await prisma.datVe.findMany({
            where: {
                maLichChieu: parseInt(maLichChieu),
                maGhe: { in: danhSachMaGhe }
            }
        });

        if (ghesDaDat.length > 0) {
            const danhSachGheDaDat = ghesDaDat.map(ve => ve.maGhe);
            throw new BadrequestException(`Ghế ${danhSachGheDaDat.join(', ')} đã được đặt`);
        }

        // Tạo dữ liệu đặt vé
        const datVeData = danhSachVe.map(ve => ({
            taiKhoan: user.taiKhoan,
            maLichChieu: parseInt(maLichChieu),
            maGhe: parseInt(ve.maGhe)
        }));

        // Thực hiện đặt vé trong transaction
        const result = await prisma.$transaction(async (tx) => {
            // Tạo các bản ghi đặt vé
            await tx.datVe.createMany({
                data: datVeData
            });

            // Lấy thông tin chi tiết vé đã đặt
            const thongTinVeDaDat = await tx.datVe.findMany({
                where: {
                    taiKhoan: user.taiKhoan,
                    maLichChieu: parseInt(maLichChieu),
                    maGhe: { in: danhSachMaGhe }
                },
                include: {
                    Ghe: true,
                    LichChieu: {
                        include: {
                            Phim: true,
                            RapPhim: {
                                include: {
                                    CumRap: {
                                        include: {
                                            HeThongRap: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return thongTinVeDaDat;
        });

        // Format response tối ưu
        const danhSachVeDaDat = result.map(ve => ({
            maGhe: ve.maGhe,
            tenGhe: ve.Ghe.tenGhe,
            loaiGhe: ve.Ghe.loaiGhe,
            giaVe: ve.LichChieu.giaVe
        }));

        return {
            maLichChieu: parseInt(maLichChieu),
            danhSachVe: danhSachVeDaDat,
            tongTien: result.reduce((total, ve) => total + Number(ve.LichChieu.giaVe), 0),
            thongTinPhim: {
                maPhim: result[0].LichChieu.Phim.maPhim,
                tenPhim: result[0].LichChieu.Phim.tenPhim
            },
            thongTinRap: {
                tenHeThongRap: result[0].LichChieu.RapPhim.CumRap.HeThongRap.tenHeThongRap,
                tenCumRap: result[0].LichChieu.RapPhim.CumRap.tenCumRap,
                tenRap: result[0].LichChieu.RapPhim.tenRap
            }
        };
    },

    // Lấy danh sách phòng vé (thông tin rạp và ghế)
    layDanhSachPhongVe: async (req) => {
        const { maLichChieu } = req.query;

        if (!maLichChieu) {
            throw new BadrequestException("Mã lịch chiếu là bắt buộc");
        }

        // Lấy thông tin lịch chiếu
        const lichChieu = await prisma.lichChieu.findUnique({
            where: { maLichChieu: parseInt(maLichChieu) },
            include: {
                Phim: true,
                RapPhim: {
                    include: {
                        CumRap: {
                            include: {
                                HeThongRap: true
                            }
                        },
                        Ghe: {
                            orderBy: [
                                { tenGhe: 'asc' }
                            ]
                        }
                    }
                }
            }
        });

        if (!lichChieu) {
            throw new BadrequestException("Lịch chiếu không tồn tại");
        }

        // Lấy danh sách ghế đã đặt
        const danhSachGheDaDat = await prisma.datVe.findMany({
            where: { maLichChieu: parseInt(maLichChieu) },
            include: {
                NguoiDung: {
                    select: {
                        taiKhoan: true,
                        hoTen: true
                    }
                }
            }
        });

        // Tạo map ghế đã đặt
        const mapGheDaDat = {};
        danhSachGheDaDat.forEach(ve => {
            mapGheDaDat[ve.maGhe] = {
                taiKhoan: ve.NguoiDung.taiKhoan,
                hoTen: ve.NguoiDung.hoTen
            };
        });

        // Chuẩn bị thông tin ghế
        const danhSachGhe = lichChieu.RapPhim.Ghe.map(ghe => ({
            maGhe: ghe.maGhe,
            tenGhe: ghe.tenGhe,
            loaiGhe: ghe.loaiGhe,
            daDat: !!mapGheDaDat[ghe.maGhe],
            taiKhoanNguoiDat: mapGheDaDat[ghe.maGhe]?.taiKhoan || null
        }));

        return {
            thongTinPhim: {
                maPhim: lichChieu.Phim.maPhim,
                tenPhim: lichChieu.Phim.tenPhim,
                hinhAnh: lichChieu.Phim.hinhAnh,
                ngayKhoiChieu: lichChieu.Phim.ngayKhoiChieu,
                danhGia: lichChieu.Phim.danhGia
            },
            thongTinRap: {
                maHeThongRap: lichChieu.RapPhim.CumRap.HeThongRap.maHeThongRap,
                tenHeThongRap: lichChieu.RapPhim.CumRap.HeThongRap.tenHeThongRap,
                maCumRap: lichChieu.RapPhim.CumRap.maCumRap,
                tenCumRap: lichChieu.RapPhim.CumRap.tenCumRap,
                maRap: lichChieu.RapPhim.maRap,
                tenRap: lichChieu.RapPhim.tenRap,
                diaChi: lichChieu.RapPhim.CumRap.diaChi
            },
            thongTinLichChieu: {
                maLichChieu: lichChieu.maLichChieu,
                ngayGioChieu: lichChieu.ngayGioChieu,
                giaVe: lichChieu.giaVe
            },
            danhSachGhe: danhSachGhe
        };
    },

    // Tạo lịch chiếu
    taoLichChieu: async (req) => {
        const { maPhim, maRap, ngayGioChieu, giaVe } = req.body;
        const user = req.user;

        // Kiểm tra quyền admin (có thể thêm middleware check permission)
        if (user.maLoaiNguoiDung !== 'QuanTri') {
            throw new BadrequestException("Chỉ có quản trị viên mới có thể tạo lịch chiếu");
        }

        if (!maPhim || !maRap || !ngayGioChieu || !giaVe) {
            throw new BadrequestException("Thiếu thông tin bắt buộc");
        }

        // Kiểm tra phim tồn tại
        const phim = await prisma.phim.findUnique({
            where: { maPhim: parseInt(maPhim) }
        });

        if (!phim) {
            throw new BadrequestException("Phim không tồn tại");
        }

        // Kiểm tra rạp tồn tại
        const rap = await prisma.rapPhim.findUnique({
            where: { maRap: parseInt(maRap) },
            include: {
                CumRap: {
                    include: {
                        HeThongRap: true
                    }
                }
            }
        });

        if (!rap) {
            throw new BadrequestException("Rạp không tồn tại");
        }

        // Kiểm tra ngày giờ chiếu hợp lệ
        const ngayChieu = new Date(ngayGioChieu);
        const now = new Date();
        
        if (ngayChieu <= now) {
            throw new BadrequestException("Ngày giờ chiếu phải sau thời điểm hiện tại");
        }

        // Kiểm tra trùng lịch chiếu (cùng rạp, cùng thời gian)
        const lichChieuTrung = await prisma.lichChieu.findFirst({
            where: {
                maRap: parseInt(maRap),
                ngayGioChieu: ngayChieu
            }
        });

        if (lichChieuTrung) {
            throw new BadrequestException("Đã có lịch chiếu vào thời gian này tại rạp này");
        }

        // Tạo lịch chiếu mới
        const lichChieuMoi = await prisma.lichChieu.create({
            data: {
                maPhim: parseInt(maPhim),
                maRap: parseInt(maRap),
                ngayGioChieu: ngayChieu,
                giaVe: parseFloat(giaVe)
            },
            include: {
                Phim: true,
                RapPhim: {
                    include: {
                        CumRap: {
                            include: {
                                HeThongRap: true
                            }
                        }
                    }
                }
            }
        });

        return {
            maLichChieu: lichChieuMoi.maLichChieu,
            thongTinPhim: {
                maPhim: lichChieuMoi.Phim.maPhim,
                tenPhim: lichChieuMoi.Phim.tenPhim
            },
            thongTinRap: {
                tenHeThongRap: lichChieuMoi.RapPhim.CumRap.HeThongRap.tenHeThongRap,
                tenCumRap: lichChieuMoi.RapPhim.CumRap.tenCumRap,
                tenRap: lichChieuMoi.RapPhim.tenRap
            },
            ngayGioChieu: lichChieuMoi.ngayGioChieu,
            giaVe: lichChieuMoi.giaVe
        };
    }
};

export default datVeService;
