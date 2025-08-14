const rapSwagger = {
   "/api/QuanLyRap/LayThongTinHeThongRap": {
      get: {
         tags: ["Quản lý rạp"],
         summary: "Lấy thông tin hệ thống rạp",
         responses: {
            200: {
               description: "Lấy thông tin thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              maHeThongRap: { type: "string" },
                              tenHeThongRap: { type: "string" },
                              logo: { type: "string" },
                              biDanh: { type: "string" }
                           }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyRap/LayThongTinCumRapTheoHeThong": {
      get: {
         tags: ["Quản lý rạp"],
         summary: "Lấy thông tin cụm rạp theo hệ thống",
         parameters: [
            {
               name: "maHeThongRap",
               in: "query",
               description: "Mã hệ thống rạp",
               required: true,
               schema: { type: "string", example: "BHDStar" }
            }
         ],
         responses: {
            200: {
               description: "Lấy thông tin thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              maCumRap: { type: "string" },
                              tenCumRap: { type: "string" },
                              hinhAnh: { type: "string" },
                              diaChi: { type: "string" },
                              danhSachRap: {
                                 type: "array",
                                 items: {
                                    type: "object",
                                    properties: {
                                       maRap: { type: "integer" },
                                       tenRap: { type: "string" }
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Mã hệ thống rạp không hợp lệ",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Hệ thống rạp không tồn tại" }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyRap/LayThongTinLichChieuHeThongRap": {
      get: {
         tags: ["Quản lý rạp"],
         summary: "Lấy thông tin lịch chiếu theo hệ thống rạp",
         parameters: [
            {
               name: "maHeThongRap",
               in: "query",
               description: "Mã hệ thống rạp",
               required: true,
               schema: { type: "string", example: "BHDStar" }
            }
         ],
         responses: {
            200: {
               description: "Lấy thông tin thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              maCumRap: { type: "string" },
                              tenCumRap: { type: "string" },
                              hinhAnh: { type: "string" },
                              diaChi: { type: "string" },
                              danhSachRap: {
                                 type: "array",
                                 items: {
                                    type: "object",
                                    properties: {
                                       maRap: { type: "integer" },
                                       tenRap: { type: "string" },
                                       lichChieuPhim: {
                                          type: "array",
                                          items: {
                                             type: "object",
                                             properties: {
                                                maLichChieu: { type: "integer" },
                                                maPhim: { type: "integer" },
                                                tenPhim: { type: "string" },
                                                hinhAnh: { type: "string" },
                                                ngayGioChieu: { type: "string" },
                                                giaVe: { type: "number" }
                                             }
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Mã hệ thống rạp không hợp lệ",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Hệ thống rạp không tồn tại" }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyRap/LayThongTinLichChieuPhim": {
      get: {
         tags: ["Quản lý rạp"],
         summary: "Lấy thông tin lịch chiếu theo phim",
         parameters: [
            {
               name: "MaPhim",
               in: "query",
               description: "Mã phim",
               required: true,
               schema: { type: "integer", example: 1 }
            }
         ],
         responses: {
            200: {
               description: "Lấy thông tin thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           heThongRapChieu: {
                              type: "array",
                              items: {
                                 type: "object",
                                 properties: {
                                    maHeThongRap: { type: "string" },
                                    tenHeThongRap: { type: "string" },
                                    logo: { type: "string" },
                                    cumRapChieu: {
                                       type: "array",
                                       items: {
                                          type: "object",
                                          properties: {
                                             maCumRap: { type: "string" },
                                             tenCumRap: { type: "string" },
                                             hinhAnh: { type: "string" },
                                             diaChi: { type: "string" },
                                             lichChieuPhim: {
                                                type: "array",
                                                items: {
                                                   type: "object",
                                                   properties: {
                                                      maLichChieu: { type: "integer" },
                                                      maRap: { type: "integer" },
                                                      tenRap: { type: "string" },
                                                      ngayGioChieu: { type: "string" },
                                                      giaVe: { type: "number" }
                                                   }
                                                }
                                             }
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Mã phim không hợp lệ",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Phim không tồn tại" }
                        }
                     }
                  }
               }
            }
         },
      },
   }
};

export default rapSwagger;
