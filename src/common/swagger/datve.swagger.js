const datveSwagger = {
   "/api/QuanLyDatVe/DatVe": {
      post: {
         tags: ["Quản lý đặt vé"],
         summary: "Đặt vé xem phim",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["maLichChieu", "danhSachVe"],
                     properties: {
                        maLichChieu: { 
                           type: "integer", 
                           example: 1,
                           description: "Mã lịch chiếu"
                        },
                        danhSachVe: { 
                           type: "array",
                           items: {
                              type: "object",
                              required: ["maGhe"],
                              properties: {
                                 maGhe: { 
                                    type: "integer", 
                                    example: 1,
                                    description: "Mã ghế"
                                 }
                              }
                           },
                           description: "Danh sách ghế muốn đặt"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: "Đặt vé thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           maLichChieu: { type: "integer" },
                           danhSachVe: {
                              type: "array",
                              items: {
                                 type: "object",
                                 properties: {
                                    maGhe: { type: "integer" },
                                    tenGhe: { type: "string" },
                                    loaiGhe: { type: "string" },
                                    giaVe: { type: "number" }
                                 }
                              }
                           },
                           tongTien: { type: "number" },
                           thongTinPhim: {
                              type: "object",
                              properties: {
                                 maPhim: { type: "integer" },
                                 tenPhim: { type: "string" }
                              }
                           },
                           thongTinRap: {
                              type: "object",
                              properties: {
                                 tenHeThongRap: { type: "string" },
                                 tenCumRap: { type: "string" },
                                 tenRap: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Dữ liệu không hợp lệ hoặc ghế đã được đặt",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Ghế đã được đặt hoặc lịch chiếu không tồn tại" }
                        }
                     }
                  }
               }
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyDatVe/LayDanhSachPhongVe": {
      get: {
         tags: ["Quản lý đặt vé"],
         summary: "Lấy danh sách phòng vé theo lịch chiếu",
         parameters: [
            {
               name: "MaLichChieu",
               in: "query",
               description: "Mã lịch chiếu",
               required: true,
               schema: { type: "integer", example: 1 }
            }
         ],
         responses: {
            200: {
               description: "Lấy danh sách thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           thongTinPhim: {
                              type: "object",
                              properties: {
                                 maPhim: { type: "integer" },
                                 tenPhim: { type: "string" },
                                 hinhAnh: { type: "string" },
                                 ngayKhoiChieu: { type: "string" },
                                 danhGia: { type: "integer" }
                              }
                           },
                           danhSachGhe: {
                              type: "array",
                              items: {
                                 type: "object",
                                 properties: {
                                    maGhe: { type: "integer" },
                                    tenGhe: { type: "string" },
                                    loaiGhe: { type: "string" },
                                    giaVe: { type: "number" },
                                    daDat: { type: "boolean" },
                                    taiKhoanNguoiDat: { type: "string" }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Mã lịch chiếu không hợp lệ",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Lịch chiếu không tồn tại" }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyDatVe/TaoLichChieu": {
      post: {
         tags: ["Quản lý đặt vé"],
         summary: "Tạo lịch chiếu mới",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["maPhim", "maRap", "ngayChieu", "giaVe"],
                     properties: {
                        maPhim: { 
                           type: "integer", 
                           example: 1,
                           description: "Mã phim"
                        },
                        maRap: { 
                           type: "integer", 
                           example: 1,
                           description: "Mã rạp"
                        },
                        ngayChieu: { 
                           type: "string", 
                           example: "2024-01-15T14:00:00.000Z",
                           description: "Ngày giờ chiếu (ISO string)"
                        },
                        giaVe: { 
                           type: "number", 
                           example: 75000,
                           description: "Giá vé"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: "Tạo lịch chiếu thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           maLichChieu: { type: "integer" },
                           thongTinPhim: {
                              type: "object",
                              properties: {
                                 maPhim: { type: "integer" },
                                 tenPhim: { type: "string" }
                              }
                           },
                           thongTinRap: {
                              type: "object",
                              properties: {
                                 tenHeThongRap: { type: "string" },
                                 tenCumRap: { type: "string" },
                                 tenRap: { type: "string" }
                              }
                           },
                           ngayGioChieu: { type: "string" },
                           giaVe: { type: "number" }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Dữ liệu không hợp lệ",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Phim hoặc rạp không tồn tại" }
                        }
                     }
                  }
               }
            },
            401: {
               description: "Không có quyền truy cập"
            },
            403: {
               description: "Không có quyền tạo lịch chiếu"
            }
         },
      },
   }
};

export default datveSwagger;
