const phimSwagger = {
   "/api/QuanLyPhim/LayDanhSachBanner": {
      get: {
         tags: ["Quản lý phim"],
         summary: "Lấy danh sách banner",
         responses: {
            200: {
               description: "Lấy danh sách thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              maBanner: { type: "integer" },
                              maPhim: { type: "integer" },
                              hinhAnh: { type: "string" },
                              phim: {
                                 type: "object",
                                 properties: {
                                    maPhim: { type: "integer" },
                                    tenPhim: { type: "string" },
                                    hinhAnh: { type: "string" },
                                    ngayKhoiChieu: { type: "string" },
                                    danhGia: { type: "integer" }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyPhim/LayDanhSachPhim": {
      get: {
         tags: ["Quản lý phim"],
         summary: "Lấy danh sách tất cả phim",
         responses: {
            200: {
               description: "Lấy danh sách thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              maPhim: { type: "integer" },
                              tenPhim: { type: "string" },
                              biDanh: { type: "string" },
                              trailer: { type: "string" },
                              hinhAnh: { type: "string" },
                              moTa: { type: "string" },
                              ngayKhoiChieu: { type: "string" },
                              danhGia: { type: "integer" },
                              hot: { type: "boolean" },
                              dangChieu: { type: "boolean" },
                              sapChieu: { type: "boolean" }
                           }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyPhim/LayDanhSachPhimPhanTrang": {
      get: {
         tags: ["Quản lý phim"],
         summary: "Lấy danh sách phim có phân trang",
         parameters: [
            {
               name: "soTrang",
               in: "query",
               description: "Số trang",
               required: false,
               schema: { type: "integer", default: 1 }
            },
            {
               name: "soPhanTuTrenTrang",
               in: "query",
               description: "Số phần tử trên mỗi trang",
               required: false,
               schema: { type: "integer", default: 10 }
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
                           currentPage: { type: "integer" },
                           count: { type: "integer" },
                           totalPages: { type: "integer" },
                           totalCount: { type: "integer" },
                           items: {
                              type: "array",
                              items: {
                                 type: "object",
                                 properties: {
                                    maPhim: { type: "integer" },
                                    tenPhim: { type: "string" },
                                    biDanh: { type: "string" },
                                    trailer: { type: "string" },
                                    hinhAnh: { type: "string" },
                                    moTa: { type: "string" },
                                    ngayKhoiChieu: { type: "string" },
                                    danhGia: { type: "integer" },
                                    hot: { type: "boolean" },
                                    dangChieu: { type: "boolean" },
                                    sapChieu: { type: "boolean" }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyPhim/LayDanhSachPhimTheoNgay": {
      get: {
         tags: ["Quản lý phim"],
         summary: "Lấy danh sách phim theo ngày",
         parameters: [
            {
               name: "tuNgay",
               in: "query",
               description: "Từ ngày (YYYY-MM-DD)",
               required: false,
               schema: { type: "string", example: "2024-01-01" }
            },
            {
               name: "denNgay",
               in: "query",
               description: "Đến ngày (YYYY-MM-DD)",
               required: false,
               schema: { type: "string", example: "2024-12-31" }
            }
         ],
         responses: {
            200: {
               description: "Lấy danh sách thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              maPhim: { type: "integer" },
                              tenPhim: { type: "string" },
                              biDanh: { type: "string" },
                              hinhAnh: { type: "string" },
                              ngayKhoiChieu: { type: "string" },
                              danhGia: { type: "integer" },
                              hot: { type: "boolean" },
                              dangChieu: { type: "boolean" },
                              sapChieu: { type: "boolean" }
                           }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyPhim/ThemPhimUploadHinh": {
      post: {
         tags: ["Quản lý phim"],
         summary: "Thêm phim với upload hình ảnh",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "multipart/form-data": {
                  schema: {
                     type: "object",
                     required: ["tenPhim", "biDanh", "trailer", "moTa", "ngayKhoiChieu", "danhGia", "hot", "dangChieu", "sapChieu"],
                     properties: {
                        tenPhim: { 
                           type: "string", 
                           example: "Avengers: Endgame",
                           description: "Tên phim"
                        },
                        biDanh: { 
                           type: "string", 
                           example: "avengers-endgame",
                           description: "Bí danh phim"
                        },
                        trailer: { 
                           type: "string", 
                           example: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
                           description: "Link trailer"
                        },
                        moTa: { 
                           type: "string", 
                           example: "Phim siêu anh hùng Marvel",
                           description: "Mô tả phim"
                        },
                        ngayKhoiChieu: { 
                           type: "string", 
                           example: "2024-01-15",
                           description: "Ngày khởi chiếu"
                        },
                        danhGia: { 
                           type: "integer", 
                           example: 9,
                           description: "Đánh giá (1-10)"
                        },
                        hot: { 
                           type: "boolean", 
                           example: true,
                           description: "Phim hot"
                        },
                        dangChieu: { 
                           type: "boolean", 
                           example: true,
                           description: "Đang chiếu"
                        },
                        sapChieu: { 
                           type: "boolean", 
                           example: false,
                           description: "Sắp chiếu"
                        },
                        hinhAnh: { 
                           type: "string", 
                           format: "binary",
                           description: "Hình ảnh phim"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: "Thêm phim thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Thêm phim thành công" },
                           data: {
                              type: "object",
                              properties: {
                                 maPhim: { type: "integer" },
                                 tenPhim: { type: "string" },
                                 hinhAnh: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Dữ liệu không hợp lệ"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyPhim/CapNhatPhimUpload": {
      post: {
         tags: ["Quản lý phim"],
         summary: "Cập nhật phim với upload hình ảnh",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "multipart/form-data": {
                  schema: {
                     type: "object",
                     required: ["maPhim"],
                     properties: {
                        maPhim: { 
                           type: "integer", 
                           example: 1,
                           description: "Mã phim cần cập nhật"
                        },
                        tenPhim: { 
                           type: "string", 
                           example: "Avengers: Endgame Updated",
                           description: "Tên phim mới"
                        },
                        biDanh: { 
                           type: "string", 
                           example: "avengers-endgame-updated",
                           description: "Bí danh phim mới"
                        },
                        trailer: { 
                           type: "string", 
                           example: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
                           description: "Link trailer mới"
                        },
                        moTa: { 
                           type: "string", 
                           example: "Phim siêu anh hùng Marvel - Phiên bản cập nhật",
                           description: "Mô tả phim mới"
                        },
                        ngayKhoiChieu: { 
                           type: "string", 
                           example: "2024-01-20",
                           description: "Ngày khởi chiếu mới"
                        },
                        danhGia: { 
                           type: "integer", 
                           example: 10,
                           description: "Đánh giá mới (1-10)"
                        },
                        hot: { 
                           type: "boolean", 
                           example: true,
                           description: "Phim hot"
                        },
                        dangChieu: { 
                           type: "boolean", 
                           example: true,
                           description: "Đang chiếu"
                        },
                        sapChieu: { 
                           type: "boolean", 
                           example: false,
                           description: "Sắp chiếu"
                        },
                        hinhAnh: { 
                           type: "string", 
                           format: "binary",
                           description: "Hình ảnh phim mới"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: "Cập nhật phim thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Cập nhật phim thành công" },
                           data: {
                              type: "object",
                              properties: {
                                 maPhim: { type: "integer" },
                                 tenPhim: { type: "string" },
                                 hinhAnh: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Dữ liệu không hợp lệ hoặc phim không tồn tại"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyPhim": {
      post: {
         tags: ["Quản lý phim"],
         summary: "Thêm phim mới (không upload hình)",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["tenPhim", "biDanh", "trailer", "moTa", "ngayKhoiChieu", "danhGia", "hot", "dangChieu", "sapChieu"],
                     properties: {
                        tenPhim: { 
                           type: "string", 
                           example: "Avengers: Endgame",
                           description: "Tên phim"
                        },
                        biDanh: { 
                           type: "string", 
                           example: "avengers-endgame",
                           description: "Bí danh phim"
                        },
                        trailer: { 
                           type: "string", 
                           example: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
                           description: "Link trailer"
                        },
                        moTa: { 
                           type: "string", 
                           example: "Phim siêu anh hùng Marvel",
                           description: "Mô tả phim"
                        },
                        ngayKhoiChieu: { 
                           type: "string", 
                           example: "2024-01-15",
                           description: "Ngày khởi chiếu"
                        },
                        danhGia: { 
                           type: "integer", 
                           example: 9,
                           description: "Đánh giá (1-10)"
                        },
                        hot: { 
                           type: "boolean", 
                           example: true,
                           description: "Phim hot"
                        },
                        dangChieu: { 
                           type: "boolean", 
                           example: true,
                           description: "Đang chiếu"
                        },
                        sapChieu: { 
                           type: "boolean", 
                           example: false,
                           description: "Sắp chiếu"
                        },
                        hinhAnh: { 
                           type: "string", 
                           example: "https://example.com/image.jpg",
                           description: "Link hình ảnh"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: "Thêm phim thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Thêm phim thành công" },
                           data: {
                              type: "object",
                              properties: {
                                 maPhim: { type: "integer" },
                                 tenPhim: { type: "string" },
                                 hinhAnh: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Dữ liệu không hợp lệ"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyPhim/XP": {
      delete: {
         tags: ["Quản lý phim"],
         summary: "Xóa phim theo mã phim",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["maPhim"],
                     properties: {
                        maPhim: { 
                           type: "integer", 
                           example: 1,
                           description: "Mã phim cần xóa"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: "Xóa phim thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Xóa phim thành công" }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Phim không tồn tại"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyPhim/XoaPhim": {
      delete: {
         tags: ["Quản lý phim"],
         summary: "Xóa phim (alias của XP)",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["maPhim"],
                     properties: {
                        maPhim: { 
                           type: "integer", 
                           example: 1,
                           description: "Mã phim cần xóa"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: "Xóa phim thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Xóa phim thành công" }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Phim không tồn tại"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyPhim/LayThongTinPhim": {
      get: {
         tags: ["Quản lý phim"],
         summary: "Lấy thông tin chi tiết phim",
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
                           maPhim: { type: "integer" },
                           tenPhim: { type: "string" },
                           biDanh: { type: "string" },
                           trailer: { type: "string" },
                           hinhAnh: { type: "string" },
                           moTa: { type: "string" },
                           ngayKhoiChieu: { type: "string" },
                           danhGia: { type: "integer" },
                           hot: { type: "boolean" },
                           dangChieu: { type: "boolean" },
                           sapChieu: { type: "boolean" }
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

export default phimSwagger;
