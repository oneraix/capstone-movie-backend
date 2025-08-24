import { BadrequestException } from "../common/helpers/exception.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import cloudinary from "../common/cloudinary/init.cloudinary.js";

const phimService = {
    // GET /api/QuanLyPhim/LayDanhSachBanner
    layDanhSachBanner: async (req) => {
        const { maNhom } = req.query;

        // Lấy danh sách banner với thông tin phim cơ bản
        const bannerList = await prisma.banner.findMany({
            include: {
                Phim: {
                    select: {
                        maPhim: true,
                        tenPhim: true,
                        hinhAnh: true,
                        ngayKhoiChieu: true,
                        danhGia: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format response với Cloudinary URLs
        const bannersWithCloudinary = bannerList.map(banner => ({
            maBanner: banner.maBanner,
            maPhim: banner.maPhim,
            hinhAnh: banner.hinhAnh ? 
                (banner.hinhAnh.startsWith('http') ? 
                    banner.hinhAnh : 
                    cloudinary.url(banner.hinhAnh, { 
                        transformation: [
                            { width: 1200, height: 600, crop: "fill" },
                            { quality: "auto", fetch_format: "auto" }
                        ]
                    })
                ) : null,
            phim: {
                maPhim: banner.Phim.maPhim,
                tenPhim: banner.Phim.tenPhim,
                hinhAnh: banner.Phim.hinhAnh ? 
                    (banner.Phim.hinhAnh.startsWith('http') ? 
                        banner.Phim.hinhAnh : 
                        cloudinary.url(banner.Phim.hinhAnh, { 
                            transformation: [
                                { width: 300, height: 450, crop: "fill" },
                                { quality: "auto", fetch_format: "auto" }
                            ]
                        })
                    ) : null,
                ngayKhoiChieu: banner.Phim.ngayKhoiChieu,
                danhGia: banner.Phim.danhGia
            }
        }));

        return bannersWithCloudinary;
    },

    // GET /api/QuanLyPhim/LayDanhSachPhim
    layDanhSachPhim: async (req) => {
        const { maNhom, tenPhim } = req.query;

        // Build where condition
        const whereCondition = {};
        
        if (tenPhim) {
            whereCondition.tenPhim = {
                contains: tenPhim
            };
        }

        const phimList = await prisma.phim.findMany({
            where: whereCondition,
            select: {
                maPhim: true,
                tenPhim: true,
                trailer: true,
                hinhAnh: true,
                moTa: true,
                ngayKhoiChieu: true,
                danhGia: true,
                hot: true,
                dangChieu: true,
                sapChieu: true
            },
            orderBy: [
                { hot: 'desc' },
                { ngayKhoiChieu: 'desc' }
            ]
        });

        // Format response với Cloudinary URLs
        const phimListWithCloudinary = phimList.map(phim => ({
            ...phim,
            hinhAnh: phim.hinhAnh ? 
                (phim.hinhAnh.startsWith('http') ? 
                    phim.hinhAnh : 
                    cloudinary.url(phim.hinhAnh, { 
                        transformation: [
                            { width: 300, height: 450, crop: "fill" },
                            { quality: "auto", fetch_format: "auto" }
                        ]
                    })
                ) : null
        }));

        return phimListWithCloudinary;
    },

    // GET /api/QuanLyPhim/LayDanhSachPhimPhanTrang
    layDanhSachPhimPhanTrang: async (req) => {
        let { page, pageSize, maNhom, tenPhim } = req.query;
        page = +page > 0 ? +page : 1;
        pageSize = +pageSize > 0 ? +pageSize : 10;

        // Build where condition
        const whereCondition = {};
        
        if (tenPhim) {
            whereCondition.tenPhim = {
                contains: tenPhim
            };
        }

        const skip = (page - 1) * pageSize;

        // Lấy danh sách phim với phân trang
        const phimList = await prisma.phim.findMany({
            where: whereCondition,
            select: {
                maPhim: true,
                tenPhim: true,
                trailer: true,
                hinhAnh: true,
                moTa: true,
                ngayKhoiChieu: true,
                danhGia: true,
                hot: true,
                dangChieu: true,
                sapChieu: true,
                createdAt: true,
                updatedAt: true
            },
            take: pageSize,
            skip: skip,
            orderBy: [
                { hot: 'desc' },
                { ngayKhoiChieu: 'desc' }
            ]
        });

        // Đếm tổng số phim
        const totalCount = await prisma.phim.count({
            where: whereCondition
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        // Format response với Cloudinary URLs
        const phimListWithCloudinary = phimList.map(phim => ({
            ...phim,
            hinhAnh: phim.hinhAnh ? 
                (phim.hinhAnh.startsWith('http') ? 
                    phim.hinhAnh : 
                    cloudinary.url(phim.hinhAnh, { 
                        transformation: [
                            { width: 300, height: 450, crop: "fill" },
                            { quality: "auto", fetch_format: "auto" }
                        ]
                    })
                ) : null
        }));

        return {
            currentPage: page,
            count: pageSize,
            totalCount: totalCount,
            totalPages: totalPages,
            items: phimListWithCloudinary
        };
    },

    // GET /api/QuanLyPhim/LayDanhSachPhimTheoNgay
    layDanhSachPhimTheoNgay: async (req) => {
        const { maNhom, soTrang, soPhanTuTrenTrang, tuNgay, denNgay } = req.query;
        
        const page = +soTrang > 0 ? +soTrang : 1;
        const pageSize = +soPhanTuTrenTrang > 0 ? +soPhanTuTrenTrang : 10;

        // Build where condition
        const whereCondition = {};

        // Lọc theo khoảng ngày khởi chiếu
        if (tuNgay || denNgay) {
            whereCondition.ngayKhoiChieu = {};
            
            if (tuNgay) {
                const fromDate = new Date(tuNgay);
                if (!isNaN(fromDate.getTime())) {
                    whereCondition.ngayKhoiChieu.gte = fromDate;
                }
            }
            
            if (denNgay) {
                const toDate = new Date(denNgay);
                if (!isNaN(toDate.getTime())) {
                    // Set to end of day
                    toDate.setHours(23, 59, 59, 999);
                    whereCondition.ngayKhoiChieu.lte = toDate;
                }
            }
        }

        const skip = (page - 1) * pageSize;

        // Lấy phim theo ngày với lịch chiếu
        const phimList = await prisma.phim.findMany({
            where: whereCondition,
            select: {
                maPhim: true,
                tenPhim: true,
                hinhAnh: true,
                ngayKhoiChieu: true,
                danhGia: true,
                hot: true,
                dangChieu: true,
                sapChieu: true,
                LichChieu: {
                    where: {
                        ngayGioChieu: {
                            gte: new Date() // Chỉ lấy lịch chiếu từ hiện tại trở đi
                        }
                    },
                    select: {
                        maLichChieu: true,
                        ngayGioChieu: true,
                        giaVe: true,
                        RapPhim: {
                            select: {
                                maRap: true,
                                tenRap: true,
                                CumRap: {
                                    select: {
                                        maCumRap: true,
                                        tenCumRap: true,
                                        HeThongRap: {
                                            select: {
                                                maHeThongRap: true,
                                                tenHeThongRap: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    take: 5, // Giới hạn số lượng lịch chiếu hiển thị
                    orderBy: {
                        ngayGioChieu: 'asc'
                    }
                }
            },
            take: pageSize,
            skip: skip,
            orderBy: [
                { ngayKhoiChieu: 'desc' },
                { hot: 'desc' }
            ]
        });

        // Đếm tổng số phim
        const totalCount = await prisma.phim.count({
            where: whereCondition
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        // Format response với Cloudinary URLs và group lịch chiếu
        const phimListFormatted = phimList.map(phim => {
            // Group lịch chiếu theo hệ thống rạp
            const heThongRapMap = new Map();
            
            phim.LichChieu.forEach(lichChieu => {
                const heThongRap = lichChieu.RapPhim.CumRap.HeThongRap;
                const cumRap = lichChieu.RapPhim.CumRap;
                const rap = lichChieu.RapPhim;

                const heThongKey = heThongRap.maHeThongRap;

                if (!heThongRapMap.has(heThongKey)) {
                    heThongRapMap.set(heThongKey, {
                        maHeThongRap: heThongRap.maHeThongRap,
                        tenHeThongRap: heThongRap.tenHeThongRap,
                        cumRapList: new Map()
                    });
                }

                const heThongData = heThongRapMap.get(heThongKey);
                const cumRapKey = cumRap.maCumRap;

                if (!heThongData.cumRapList.has(cumRapKey)) {
                    heThongData.cumRapList.set(cumRapKey, {
                        maCumRap: cumRap.maCumRap,
                        tenCumRap: cumRap.tenCumRap,
                        rapList: new Map()
                    });
                }

                const cumRapData = heThongData.cumRapList.get(cumRapKey);
                const rapKey = rap.maRap;

                if (!cumRapData.rapList.has(rapKey)) {
                    cumRapData.rapList.set(rapKey, {
                        maRap: rap.maRap,
                        tenRap: rap.tenRap,
                        lichChieuList: []
                    });
                }

                const rapData = cumRapData.rapList.get(rapKey);
                rapData.lichChieuList.push({
                    maLichChieu: lichChieu.maLichChieu,
                    ngayGioChieu: lichChieu.ngayGioChieu,
                    giaVe: lichChieu.giaVe
                });
            });

            // Convert Maps to Arrays
            const lstLichChieuTheoHeThongRap = Array.from(heThongRapMap.values()).map(heThong => ({
                ...heThong,
                lstCumRap: Array.from(heThong.cumRapList.values()).map(cumRap => ({
                    ...cumRap,
                    lstRap: Array.from(cumRap.rapList.values())
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
                                { quality: "auto", fetch_format: "auto" }
                            ]
                        })
                    ) : null,
                moTa: phim.moTa,
                ngayKhoiChieu: phim.ngayKhoiChieu,
                danhGia: phim.danhGia,
                hot: phim.hot,
                dangChieu: phim.dangChieu,
                sapChieu: phim.sapChieu,
                lstLichChieuTheoHeThongRap: lstLichChieuTheoHeThongRap
            };
        });

                 return {
             currentPage: page,
             count: pageSize,
             totalCount: totalCount,
             totalPages: totalPages,
             items: phimListFormatted
         };
     },

     // POST /api/QuanLyPhim/ThemPhimUploadHinh
     themPhimUploadHinh: async (req) => {
         const { tenPhim, trailer, moTa, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu } = req.body;
         const user = req.user;

         // Kiểm tra quyền admin
         if (user.maLoaiNguoiDung !== 'QuanTri') {
             throw new BadrequestException("Chỉ có quản trị viên mới có thể thêm phim");
         }

         // Validate required fields
         if (!tenPhim || !ngayKhoiChieu) {
             throw new BadrequestException("Tên phim và ngày khởi chiếu là bắt buộc");
         }

         // Validate ngày khởi chiếu
         const ngayKhoiChieuDate = new Date(ngayKhoiChieu);
         if (isNaN(ngayKhoiChieuDate.getTime())) {
             throw new BadrequestException("Ngày khởi chiếu không hợp lệ");
         }

         // Upload hình ảnh lên Cloudinary nếu có
         let hinhAnhUrl = null;
         if (req.file) {
             const uploadResult = await new Promise((resolve) => {
                 cloudinary.uploader
                     .upload_stream(
                         { 
                             folder: "movies",
                             transformation: [
                                 { width: 300, height: 450, crop: "fill" },
                                 { quality: "auto", fetch_format: "auto" }
                             ]
                         }, 
                         (error, uploadResult) => {
                             return resolve(uploadResult);
                         }
                     )
                     .end(req.file.buffer);
             });

             if (uploadResult) {
                 hinhAnhUrl = uploadResult.public_id;
             }
         }

         // Tạo phim mới
         const newPhim = await prisma.phim.create({
             data: {
                 tenPhim: tenPhim,
                 trailer: trailer || null,
                 hinhAnh: hinhAnhUrl,
                 moTa: moTa || null,
                 ngayKhoiChieu: ngayKhoiChieuDate,
                 danhGia: danhGia ? parseFloat(danhGia) : 0.0,
                 hot: hot === 'true' || hot === true,
                 dangChieu: dangChieu === 'true' || dangChieu === true,
                 sapChieu: sapChieu === 'true' || sapChieu === false
             }
         });

         return {
             ...newPhim,
             hinhAnh: hinhAnhUrl ? 
                 cloudinary.url(hinhAnhUrl, { 
                     transformation: [
                         { width: 300, height: 450, crop: "fill" },
                         { quality: "auto", fetch_format: "auto" }
                     ]
                 }) : null
         };
     },

     // POST /api/QuanLyPhim/CapNhatPhimUpload
     capNhatPhimUpload: async (req) => {
         const { maPhim, tenPhim, trailer, moTa, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu } = req.body;
         const user = req.user;

         // Kiểm tra quyền admin
         if (user.maLoaiNguoiDung !== 'QuanTri') {
             throw new BadrequestException("Chỉ có quản trị viên mới có thể cập nhật phim");
         }

         if (!maPhim) {
             throw new BadrequestException("Mã phim là bắt buộc");
         }

         // Kiểm tra phim tồn tại
         const phimExist = await prisma.phim.findUnique({
             where: { maPhim: parseInt(maPhim) }
         });

         if (!phimExist) {
             throw new BadrequestException("Phim không tồn tại");
         }

         // Prepare update data
         const updateData = {};

         if (tenPhim) updateData.tenPhim = tenPhim;
         if (trailer !== undefined) updateData.trailer = trailer;
         if (moTa !== undefined) updateData.moTa = moTa;
         if (ngayKhoiChieu) {
             const ngayKhoiChieuDate = new Date(ngayKhoiChieu);
             if (isNaN(ngayKhoiChieuDate.getTime())) {
                 throw new BadrequestException("Ngày khởi chiếu không hợp lệ");
             }
             updateData.ngayKhoiChieu = ngayKhoiChieuDate;
         }
         if (danhGia !== undefined) updateData.danhGia = parseFloat(danhGia);
         if (hot !== undefined) updateData.hot = hot === 'true' || hot === true;
         if (dangChieu !== undefined) updateData.dangChieu = dangChieu === 'true' || dangChieu === true;
         if (sapChieu !== undefined) updateData.sapChieu = sapChieu === 'true' || sapChieu === true;

         // Upload hình ảnh mới nếu có
         if (req.file) {
             // Xóa hình ảnh cũ nếu có
             if (phimExist.hinhAnh && !phimExist.hinhAnh.startsWith('http')) {
                 try {
                     await cloudinary.uploader.destroy(phimExist.hinhAnh);
                 } catch (error) {
                     console.log("Lỗi xóa hình ảnh cũ:", error);
                 }
             }

             // Upload hình ảnh mới
             const uploadResult = await new Promise((resolve) => {
                 cloudinary.uploader
                     .upload_stream(
                         { 
                             folder: "movies",
                             transformation: [
                                 { width: 300, height: 450, crop: "fill" },
                                 { quality: "auto", fetch_format: "auto" }
                             ]
                         }, 
                         (error, uploadResult) => {
                             return resolve(uploadResult);
                         }
                     )
                     .end(req.file.buffer);
             });

             if (uploadResult) {
                 updateData.hinhAnh = uploadResult.public_id;
             }
         }

         updateData.updatedAt = new Date();

         // Cập nhật phim
         const updatedPhim = await prisma.phim.update({
             where: { maPhim: parseInt(maPhim) },
             data: updateData
         });

         return {
             ...updatedPhim,
             hinhAnh: updatedPhim.hinhAnh ? 
                 (updatedPhim.hinhAnh.startsWith('http') ? 
                     updatedPhim.hinhAnh : 
                     cloudinary.url(updatedPhim.hinhAnh, { 
                         transformation: [
                             { width: 300, height: 450, crop: "fill" },
                             { quality: "auto", fetch_format: "auto" }
                         ]
                     })
                 ) : null
         };
     },

     // POST /api/QuanLyPhim
     themPhim: async (req) => {
         const { tenPhim, trailer, hinhAnh, moTa, ngayKhoiChieu, danhGia, hot, dangChieu, sapChieu } = req.body;
         const user = req.user;

         // Kiểm tra quyền admin
         if (user.maLoaiNguoiDung !== 'QuanTri') {
             throw new BadrequestException("Chỉ có quản trị viên mới có thể thêm phim");
         }

         // Validate required fields
         if (!tenPhim || !ngayKhoiChieu) {
             throw new BadrequestException("Tên phim và ngày khởi chiếu là bắt buộc");
         }

         // Validate ngày khởi chiếu
         const ngayKhoiChieuDate = new Date(ngayKhoiChieu);
         if (isNaN(ngayKhoiChieuDate.getTime())) {
             throw new BadrequestException("Ngày khởi chiếu không hợp lệ");
         }

         // Tạo phim mới
         const newPhim = await prisma.phim.create({
             data: {
                 tenPhim: tenPhim,
                 trailer: trailer || null,
                 hinhAnh: hinhAnh || null,
                 moTa: moTa || null,
                 ngayKhoiChieu: ngayKhoiChieuDate,
                 danhGia: danhGia ? parseFloat(danhGia) : 0.0,
                 hot: hot === 'true' || hot === true,
                 dangChieu: dangChieu === 'true' || dangChieu === true,
                 sapChieu: sapChieu === 'true' || sapChieu === false
             }
         });

         return {
             ...newPhim,
             hinhAnh: newPhim.hinhAnh ? 
                 (newPhim.hinhAnh.startsWith('http') ? 
                     newPhim.hinhAnh : 
                     cloudinary.url(newPhim.hinhAnh, { 
                         transformation: [
                             { width: 300, height: 450, crop: "fill" },
                             { quality: "auto", fetch_format: "auto" }
                         ]
                     })
                 ) : null
         };
     },

     // DELETE /api/QuanLyPhim/XP
     xoaPhimXP: async (req) => {
         const { maPhim } = req.query;
         const user = req.user;

         // Kiểm tra quyền admin
         if (user.maLoaiNguoiDung !== 'QuanTri') {
             throw new BadrequestException("Chỉ có quản trị viên mới có thể xóa phim");
         }

         if (!maPhim) {
             throw new BadrequestException("Mã phim là bắt buộc");
         }

         // Kiểm tra phim tồn tại
         const phimExist = await prisma.phim.findUnique({
             where: { maPhim: parseInt(maPhim) }
         });

         if (!phimExist) {
             throw new BadrequestException("Phim không tồn tại");
         }

         // Kiểm tra phim có lịch chiếu nào không
         const lichChieuCount = await prisma.lichChieu.count({
             where: { maPhim: parseInt(maPhim) }
         });

         if (lichChieuCount > 0) {
             throw new BadrequestException("Không thể xóa phim đã có lịch chiếu");
         }

         // Xóa hình ảnh từ Cloudinary nếu có
         if (phimExist.hinhAnh && !phimExist.hinhAnh.startsWith('http')) {
             try {
                 await cloudinary.uploader.destroy(phimExist.hinhAnh);
             } catch (error) {
                 console.log("Lỗi xóa hình ảnh:", error);
             }
         }

         // Xóa phim
         await prisma.phim.delete({
             where: { maPhim: parseInt(maPhim) }
         });

         return { message: "Xóa phim thành công" };
     },

     // DELETE /api/QuanLyPhim/XoaPhim
     xoaPhim: async (req) => {
         const { maPhim } = req.query;
         const user = req.user;

         // Kiểm tra quyền admin
         if (user.maLoaiNguoiDung !== 'QuanTri') {
             throw new BadrequestException("Chỉ có quản trị viên mới có thể xóa phim");
         }

         if (!maPhim) {
             throw new BadrequestException("Mã phim là bắt buộc");
         }

         // Kiểm tra phim tồn tại
         const phimExist = await prisma.phim.findUnique({
             where: { maPhim: parseInt(maPhim) }
         });

         if (!phimExist) {
             throw new BadrequestException("Phim không tồn tại");
         }

         // Kiểm tra phim có lịch chiếu nào không
         const lichChieuCount = await prisma.lichChieu.count({
             where: { maPhim: parseInt(maPhim) }
         });

         if (lichChieuCount > 0) {
             throw new BadrequestException("Không thể xóa phim đã có lịch chiếu");
         }

         // Xóa banner liên quan
         await prisma.banner.deleteMany({
             where: { maPhim: parseInt(maPhim) }
         });

         // Xóa hình ảnh từ Cloudinary nếu có
         if (phimExist.hinhAnh && !phimExist.hinhAnh.startsWith('http')) {
             try {
                 await cloudinary.uploader.destroy(phimExist.hinhAnh);
             } catch (error) {
                 console.log("Lỗi xóa hình ảnh:", error);
             }
         }

         // Xóa phim
         await prisma.phim.delete({
             where: { maPhim: parseInt(maPhim) }
         });

         return { message: "Xóa phim thành công" };
     },

     // GET /api/QuanLyPhim/LayThongTinPhim
     layThongTinPhim: async (req) => {
         const { maPhim } = req.query;

         if (!maPhim) {
             throw new BadrequestException("Mã phim là bắt buộc");
         }

         // Lấy thông tin phim với lịch chiếu
         const phim = await prisma.phim.findUnique({
             where: { maPhim: parseInt(maPhim) },
             include: {
                 LichChieu: {
                     where: {
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
                 },
                 Banner: {
                     select: {
                         maBanner: true,
                         hinhAnh: true
                     }
                 }
             }
         });

         if (!phim) {
             throw new BadrequestException("Phim không tồn tại");
         }

         // Group lịch chiếu theo hệ thống rạp
         const heThongRapMap = new Map();
         
         phim.LichChieu.forEach(lichChieu => {
             const heThongRap = lichChieu.RapPhim.CumRap.HeThongRap;
             const cumRap = lichChieu.RapPhim.CumRap;
             const rap = lichChieu.RapPhim;

             const heThongKey = heThongRap.maHeThongRap;

             if (!heThongRapMap.has(heThongKey)) {
                 heThongRapMap.set(heThongKey, {
                     maHeThongRap: heThongRap.maHeThongRap,
                     tenHeThongRap: heThongRap.tenHeThongRap,
                     cumRapList: new Map()
                 });
             }

             const heThongData = heThongRapMap.get(heThongKey);
             const cumRapKey = cumRap.maCumRap;

             if (!heThongData.cumRapList.has(cumRapKey)) {
                 heThongData.cumRapList.set(cumRapKey, {
                     maCumRap: cumRap.maCumRap,
                     tenCumRap: cumRap.tenCumRap,
                     rapList: new Map()
                 });
             }

             const cumRapData = heThongData.cumRapList.get(cumRapKey);
             const rapKey = rap.maRap;

             if (!cumRapData.rapList.has(rapKey)) {
                 cumRapData.rapList.set(rapKey, {
                     maRap: rap.maRap,
                     tenRap: rap.tenRap,
                     lichChieuList: []
                 });
             }

             const rapData = cumRapData.rapList.get(rapKey);
             rapData.lichChieuList.push({
                 maLichChieu: lichChieu.maLichChieu,
                 ngayGioChieu: lichChieu.ngayGioChieu,
                 giaVe: lichChieu.giaVe
             });
         });

         // Convert Maps to Arrays
         const lstLichChieuTheoHeThongRap = Array.from(heThongRapMap.values()).map(heThong => ({
             ...heThong,
             lstCumRap: Array.from(heThong.cumRapList.values()).map(cumRap => ({
                 ...cumRap,
                 lstRap: Array.from(cumRap.rapList.values())
             }))
         }));

         // Format banner với Cloudinary URLs
         const bannersWithCloudinary = phim.Banner.map(banner => ({
             ...banner,
             hinhAnh: banner.hinhAnh ? 
                 (banner.hinhAnh.startsWith('http') ? 
                     banner.hinhAnh : 
                     cloudinary.url(banner.hinhAnh, { 
                         transformation: [
                             { width: 1200, height: 600, crop: "fill" },
                             { quality: "auto", fetch_format: "auto" }
                         ]
                     })
                 ) : null
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
                             { quality: "auto", fetch_format: "auto" }
                         ]
                     })
                 ) : null,
             moTa: phim.moTa,
             ngayKhoiChieu: phim.ngayKhoiChieu,
             danhGia: phim.danhGia,
             hot: phim.hot,
             dangChieu: phim.dangChieu,
             sapChieu: phim.sapChieu,
             createdAt: phim.createdAt,
             updatedAt: phim.updatedAt,
             lstLichChieuTheoHeThongRap: lstLichChieuTheoHeThongRap,
             lstBanner: bannersWithCloudinary
         };
     }
 };

export default phimService;
