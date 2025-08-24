import { BadrequestException } from "../common/helpers/exception.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import cloudinary from "../common/cloudinary/init.cloudinary.js";

const rapService = {
    // GET /api/QuanLyRap/LayThongTinHeThongRap
    layThongTinHeThongRap: async (req) => {
        const { maNhom } = req.query;

        const whereCondition = {};
        if (maNhom) {
            whereCondition.maNhom = maNhom;
        }

        const heThongRapList = await prisma.heThongRap.findMany({
            select: {
                maHeThongRap: true,
                tenHeThongRap: true,
                logo: true
            },
            orderBy: {
                tenHeThongRap: 'asc'
            }
        });

        // Xử lý URL logo với Cloudinary nếu có
        const heThongRapWithLogo = heThongRapList.map(heThong => ({
            ...heThong,
            logo: heThong.logo ? 
                (heThong.logo.startsWith('http') ? 
                    heThong.logo : 
                    cloudinary.url(heThong.logo, { 
                        transformation: [
                            { width: 200, height: 200, crop: "fill" },
                            { quality: "auto" }
                        ]
                    })
                ) : null
        }));

        return heThongRapWithLogo;
    },

    // GET /api/QuanLyRap/LayThongTinCumRapTheoHeThong
    layThongTinCumRapTheoHeThong: async (req) => {
        const { maHeThongRap, maNhom } = req.query;

        if (!maHeThongRap) {
            throw new BadrequestException("Mã hệ thống rạp là bắt buộc");
        }

        // Kiểm tra hệ thống rạp tồn tại
        const heThongRap = await prisma.heThongRap.findUnique({
            where: { maHeThongRap: maHeThongRap }
        });

        if (!heThongRap) {
            throw new BadrequestException("Hệ thống rạp không tồn tại");
        }

        // Lấy danh sách cụm rạp theo hệ thống
        const cumRapList = await prisma.cumRap.findMany({
            where: {
                maHeThongRap: maHeThongRap
            },
            include: {
                RapPhim: {
                    select: {
                        maRap: true,
                        tenRap: true
                    },
                    orderBy: {
                        tenRap: 'asc'
                    }
                }
            },
            orderBy: {
                tenCumRap: 'asc'
            }
        });

        // Format response
        const result = cumRapList.map(cumRap => ({
            maCumRap: cumRap.maCumRap,
            tenCumRap: cumRap.tenCumRap,
            diaChi: cumRap.diaChi,
            danhSachRap: cumRap.RapPhim
        }));

        return {
            maHeThongRap: heThongRap.maHeThongRap,
            tenHeThongRap: heThongRap.tenHeThongRap,
            logo: heThongRap.logo ? 
                (heThongRap.logo.startsWith('http') ? 
                    heThongRap.logo : 
                    cloudinary.url(heThongRap.logo, { 
                        transformation: [
                            { width: 200, height: 200, crop: "fill" },
                            { quality: "auto" }
                        ]
                    })
                ) : null,
            lstCumRap: result
        };
    },

    // GET /api/QuanLyRap/LayThongTinLichChieuHeThongRap
    layThongTinLichChieuHeThongRap: async (req) => {
        const { maHeThongRap, maNhom } = req.query;

        if (!maHeThongRap) {
            throw new BadrequestException("Mã hệ thống rạp là bắt buộc");
        }

        // Kiểm tra hệ thống rạp tồn tại
        const heThongRap = await prisma.heThongRap.findUnique({
            where: { maHeThongRap: maHeThongRap }
        });

        if (!heThongRap) {
            throw new BadrequestException("Hệ thống rạp không tồn tại");
        }

        // Lấy danh sách cụm rạp và lịch chiếu
        const cumRapList = await prisma.cumRap.findMany({
            where: {
                maHeThongRap: maHeThongRap
            },
            include: {
                RapPhim: {
                    include: {
                        LichChieu: {
                            where: {
                                ngayGioChieu: {
                                    gte: new Date() // Chỉ lấy lịch chiếu từ hiện tại trở đi
                                }
                            },
                            include: {
                                Phim: {
                                    select: {
                                        maPhim: true,
                                        tenPhim: true,
                                        hinhAnh: true,
                                        trailer: true,
                                        moTa: true,
                                        ngayKhoiChieu: true,
                                        danhGia: true,
                                        hot: true,
                                        dangChieu: true,
                                        sapChieu: true
                                    }
                                }
                            },
                            orderBy: {
                                ngayGioChieu: 'asc'
                            }
                        }
                    }
                }
            },
            orderBy: {
                tenCumRap: 'asc'
            }
        });

        // Group lịch chiếu theo phim
        const phimMap = new Map();

        cumRapList.forEach(cumRap => {
            cumRap.RapPhim.forEach(rap => {
                rap.LichChieu.forEach(lichChieu => {
                    const phim = lichChieu.Phim;
                    const phimKey = phim.maPhim;

                    if (!phimMap.has(phimKey)) {
                        phimMap.set(phimKey, {
                            maPhim: phim.maPhim,
                            tenPhim: phim.tenPhim,
                            hinhAnh: phim.hinhAnh ? 
                                (phim.hinhAnh.startsWith('http') ? 
                                    phim.hinhAnh : 
                                    cloudinary.url(phim.hinhAnh, { 
                                        transformation: [
                                            { width: 300, height: 450, crop: "fill" },
                                            { quality: "auto" }
                                        ]
                                    })
                                ) : null,
                            trailer: phim.trailer,
                            moTa: phim.moTa,
                            ngayKhoiChieu: phim.ngayKhoiChieu,
                            danhGia: phim.danhGia,
                            hot: phim.hot,
                            dangChieu: phim.dangChieu,
                            sapChieu: phim.sapChieu,
                            lstLichChieuTheoPhim: []
                        });
                    }

                    const phimData = phimMap.get(phimKey);
                    
                    // Tìm cụm rạp trong lstLichChieuTheoPhim
                    let cumRapData = phimData.lstLichChieuTheoPhim.find(cr => cr.maCumRap === cumRap.maCumRap);
                    
                    if (!cumRapData) {
                        cumRapData = {
                            maCumRap: cumRap.maCumRap,
                            tenCumRap: cumRap.tenCumRap,
                            diaChi: cumRap.diaChi,
                            lstLichChieuTheoRap: []
                        };
                        phimData.lstLichChieuTheoPhim.push(cumRapData);
                    }

                    // Tìm rạp trong lstLichChieuTheoRap
                    let rapData = cumRapData.lstLichChieuTheoRap.find(r => r.maRap === rap.maRap);
                    
                    if (!rapData) {
                        rapData = {
                            maRap: rap.maRap,
                            tenRap: rap.tenRap,
                            lstLichChieu: []
                        };
                        cumRapData.lstLichChieuTheoRap.push(rapData);
                    }

                    // Thêm lịch chiếu
                    rapData.lstLichChieu.push({
                        maLichChieu: lichChieu.maLichChieu,
                        ngayGioChieu: lichChieu.ngayGioChieu,
                        giaVe: lichChieu.giaVe
                    });
                });
            });
        });

        return {
            maHeThongRap: heThongRap.maHeThongRap,
            tenHeThongRap: heThongRap.tenHeThongRap,
            logo: heThongRap.logo ? 
                (heThongRap.logo.startsWith('http') ? 
                    heThongRap.logo : 
                    cloudinary.url(heThongRap.logo, { 
                        transformation: [
                            { width: 200, height: 200, crop: "fill" },
                            { quality: "auto" }
                        ]
                    })
                ) : null,
            lstPhim: Array.from(phimMap.values())
        };
    },

    // GET /api/QuanLyRap/LayThongTinLichChieuPhim
    layThongTinLichChieuPhim: async (req) => {
        const { maPhim, maNhom } = req.query;

        if (!maPhim) {
            throw new BadrequestException("Mã phim là bắt buộc");
        }

        // Kiểm tra phim tồn tại
        const phim = await prisma.phim.findUnique({
            where: { maPhim: parseInt(maPhim) }
        });

        if (!phim) {
            throw new BadrequestException("Phim không tồn tại");
        }

        // Lấy lịch chiếu của phim theo hệ thống rạp
        const lichChieuList = await prisma.lichChieu.findMany({
            where: {
                maPhim: parseInt(maPhim),
                ngayGioChieu: {
                    gte: new Date() // Chỉ lấy lịch chiếu từ hiện tại trở đi
                }
            },
            include: {
                RapPhim: {
                    include: {
                        CumRap: {
                            include: {
                                HeThongRap: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                ngayGioChieu: 'asc'
            }
        });

        // Group theo hệ thống rạp
        const heThongRapMap = new Map();

        lichChieuList.forEach(lichChieu => {
            const heThongRap = lichChieu.RapPhim.CumRap.HeThongRap;
            const cumRap = lichChieu.RapPhim.CumRap;
            const rap = lichChieu.RapPhim;

            const heThongKey = heThongRap.maHeThongRap;

            if (!heThongRapMap.has(heThongKey)) {
                heThongRapMap.set(heThongKey, {
                    maHeThongRap: heThongRap.maHeThongRap,
                    tenHeThongRap: heThongRap.tenHeThongRap,
                    logo: heThongRap.logo ? 
                        (heThongRap.logo.startsWith('http') ? 
                            heThongRap.logo : 
                            cloudinary.url(heThongRap.logo, { 
                                transformation: [
                                    { width: 200, height: 200, crop: "fill" },
                                    { quality: "auto" }
                                ]
                            })
                        ) : null,
                    lstCumRap: new Map()
                });
            }

            const heThongData = heThongRapMap.get(heThongKey);
            const cumRapKey = cumRap.maCumRap;

            if (!heThongData.lstCumRap.has(cumRapKey)) {
                heThongData.lstCumRap.set(cumRapKey, {
                    maCumRap: cumRap.maCumRap,
                    tenCumRap: cumRap.tenCumRap,
                    diaChi: cumRap.diaChi,
                    lstRap: new Map()
                });
            }

            const cumRapData = heThongData.lstCumRap.get(cumRapKey);
            const rapKey = rap.maRap;

            if (!cumRapData.lstRap.has(rapKey)) {
                cumRapData.lstRap.set(rapKey, {
                    maRap: rap.maRap,
                    tenRap: rap.tenRap,
                    lstLichChieu: []
                });
            }

            const rapData = cumRapData.lstRap.get(rapKey);
            rapData.lstLichChieu.push({
                maLichChieu: lichChieu.maLichChieu,
                ngayGioChieu: lichChieu.ngayGioChieu,
                giaVe: lichChieu.giaVe
            });
        });

        // Convert Maps to Arrays
        const result = Array.from(heThongRapMap.values()).map(heThong => ({
            ...heThong,
            lstCumRap: Array.from(heThong.lstCumRap.values()).map(cumRap => ({
                ...cumRap,
                lstRap: Array.from(cumRap.lstRap.values())
            }))
        }));

        return {
            maPhim: phim.maPhim,
            tenPhim: phim.tenPhim,
            trailer: phim.trailer,
            hinhAnh: phim.hinhAnh ? 
                (phim.hinhAnh.startsWith('http') ? 
                    phim.hinhAnh : 
                    cloudinary.url(phim.hinhAnh, { 
                        transformation: [
                            { width: 300, height: 450, crop: "fill" },
                            { quality: "auto" }
                        ]
                    })
                ) : null,
            moTa: phim.moTa,
            ngayKhoiChieu: phim.ngayKhoiChieu,
            danhGia: phim.danhGia,
            hot: phim.hot,
            dangChieu: phim.dangChieu,
            sapChieu: phim.sapChieu,
            heThongRapChieu: result
        };
    }
};

export default rapService;
