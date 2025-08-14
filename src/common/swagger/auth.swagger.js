const authSwagger = {
   "/api/QuanLyNguoiDung/DangKy": {
      post: {
         tags: ["Quản lý người dùng"],
         summary: "Đăng ký tài khoản mới",
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["taiKhoan", "matKhau", "email", "hoTen", "soDt"],
                     properties: {
                        taiKhoan: { 
                           type: "string", 
                           example: "user123",
                           description: "Tên đăng nhập"
                        },
                        matKhau: { 
                           type: "string", 
                           example: "123456",
                           description: "Mật khẩu"
                        },
                        email: { 
                           type: "string", 
                           example: "user@example.com",
                           description: "Email"
                        },
                        hoTen: { 
                           type: "string", 
                           example: "Nguyễn Văn A",
                           description: "Họ và tên"
                        },
                        soDt: { 
                           type: "string", 
                           example: "0123456789",
                           description: "Số điện thoại"
                        },
                        maNhom: { 
                           type: "string", 
                           example: "GP01",
                           description: "Mã nhóm (tùy chọn)"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: "Đăng ký thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Đăng ký thành công" },
                           data: {
                              type: "object",
                              properties: {
                                 taiKhoan: { type: "string" },
                                 email: { type: "string" },
                                 hoTen: { type: "string" },
                                 soDt: { type: "string" },
                                 maLoaiNguoiDung: { type: "string" },
                                 maNhom: { type: "string" }
                              }
                           }
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
                           message: { type: "string", example: "Tài khoản đã tồn tại" }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyNguoiDung/DangNhap": {
      post: {
         tags: ["Quản lý người dùng"],
         summary: "Đăng nhập",
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["taiKhoan", "matKhau"],
                     properties: {
                        taiKhoan: { 
                           type: "string", 
                           example: "user123",
                           description: "Tên đăng nhập hoặc email"
                        },
                        matKhau: { 
                           type: "string", 
                           example: "123456",
                           description: "Mật khẩu"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: "Đăng nhập thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           accessToken: { type: "string" },
                           refreshToken: { type: "string" },
                           user: {
                              type: "object",
                              properties: {
                                 taiKhoan: { type: "string" },
                                 hoTen: { type: "string" },
                                 email: { type: "string" },
                                 maLoaiNguoiDung: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Thông tin đăng nhập không chính xác",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Tài khoản hoặc mật khẩu không chính xác" }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyNguoiDung/ThongTinTaiKhoan": {
      get: {
         tags: ["Quản lý người dùng"],
         summary: "Lấy thông tin tài khoản hiện tại",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         responses: {
            200: {
               description: "Lấy thông tin thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           taiKhoan: { type: "string" },
                           hoTen: { type: "string" },
                           email: { type: "string" },
                           soDt: { type: "string" },
                           maLoaiNguoiDung: { type: "string" },
                           maNhom: { type: "string" }
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
   "/api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung": {
      get: {
         tags: ["Quản lý người dùng"],
         summary: "Lấy danh sách loại người dùng",
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
                              maLoaiNguoiDung: { type: "string" },
                              tenLoai: { type: "string" }
                           }
                        }
                     }
                  }
               }
            }
         },
      },
   },
   "/api/QuanLyNguoiDung/LayDanhSachNguoiDung": {
      get: {
         tags: ["Quản lý người dùng"],
         summary: "Lấy danh sách tất cả người dùng",
         security: [{ Minh_Hieu_BearerAuth: [] }],
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
                              taiKhoan: { type: "string" },
                              hoTen: { type: "string" },
                              email: { type: "string" },
                              soDt: { type: "string" },
                              maLoaiNguoiDung: { type: "string" }
                           }
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
   "/api/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang": {
      get: {
         tags: ["Quản lý người dùng"],
         summary: "Lấy danh sách người dùng có phân trang",
         security: [{ Minh_Hieu_BearerAuth: [] }],
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
                                    taiKhoan: { type: "string" },
                                    hoTen: { type: "string" },
                                    email: { type: "string" },
                                    soDt: { type: "string" },
                                    maLoaiNguoiDung: { type: "string" }
                                 }
                              }
                           }
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
   "/api/QuanLyNguoiDung/TimKiemNguoiDung": {
      get: {
         tags: ["Quản lý người dùng"],
         summary: "Tìm kiếm người dùng",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         parameters: [
            {
               name: "tuKhoa",
               in: "query",
               description: "Từ khóa tìm kiếm",
               required: true,
               schema: { type: "string" }
            }
         ],
         responses: {
            200: {
               description: "Tìm kiếm thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "array",
                        items: {
                           type: "object",
                           properties: {
                              taiKhoan: { type: "string" },
                              hoTen: { type: "string" },
                              email: { type: "string" },
                              soDt: { type: "string" },
                              maLoaiNguoiDung: { type: "string" }
                           }
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
   "/api/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang": {
      get: {
         tags: ["Quản lý người dùng"],
         summary: "Tìm kiếm người dùng có phân trang",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         parameters: [
            {
               name: "tuKhoa",
               in: "query",
               description: "Từ khóa tìm kiếm",
               required: true,
               schema: { type: "string" }
            },
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
               description: "Tìm kiếm thành công",
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
                                    taiKhoan: { type: "string" },
                                    hoTen: { type: "string" },
                                    email: { type: "string" },
                                    soDt: { type: "string" },
                                    maLoaiNguoiDung: { type: "string" }
                                 }
                              }
                           }
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
   "/api/QuanLyNguoiDung/LayThongTinNguoiDung": {
      post: {
         tags: ["Quản lý người dùng"],
         summary: "Lấy thông tin chi tiết người dùng",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["taiKhoan"],
                     properties: {
                        taiKhoan: { 
                           type: "string", 
                           example: "user123",
                           description: "Tài khoản cần lấy thông tin"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: "Lấy thông tin thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           taiKhoan: { type: "string" },
                           hoTen: { type: "string" },
                           email: { type: "string" },
                           soDt: { type: "string" },
                           maLoaiNguoiDung: { type: "string" },
                           maNhom: { type: "string" }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Tài khoản không tồn tại"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyNguoiDung/ThemNguoiDung": {
      post: {
         tags: ["Quản lý người dùng"],
         summary: "Thêm người dùng mới",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["taiKhoan", "matKhau", "email", "hoTen", "soDt", "maLoaiNguoiDung"],
                     properties: {
                        taiKhoan: { 
                           type: "string", 
                           example: "user123",
                           description: "Tên đăng nhập"
                        },
                        matKhau: { 
                           type: "string", 
                           example: "123456",
                           description: "Mật khẩu"
                        },
                        email: { 
                           type: "string", 
                           example: "user@example.com",
                           description: "Email"
                        },
                        hoTen: { 
                           type: "string", 
                           example: "Nguyễn Văn A",
                           description: "Họ và tên"
                        },
                        soDt: { 
                           type: "string", 
                           example: "0123456789",
                           description: "Số điện thoại"
                        },
                        maLoaiNguoiDung: { 
                           type: "string", 
                           example: "KhachHang",
                           description: "Mã loại người dùng"
                        },
                        maNhom: { 
                           type: "string", 
                           example: "GP01",
                           description: "Mã nhóm (tùy chọn)"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: "Thêm người dùng thành công",
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                           message: { type: "string", example: "Thêm người dùng thành công" },
                           data: {
                              type: "object",
                              properties: {
                                 taiKhoan: { type: "string" },
                                 hoTen: { type: "string" },
                                 email: { type: "string" },
                                 soDt: { type: "string" },
                                 maLoaiNguoiDung: { type: "string" },
                                 maNhom: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung": {
      patch: {
         tags: ["Quản lý người dùng"],
         summary: "Cập nhật thông tin người dùng",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["taiKhoan"],
                     properties: {
                        taiKhoan: { 
                           type: "string", 
                           example: "user123",
                           description: "Tài khoản cần cập nhật"
                        },
                        email: { 
                           type: "string", 
                           example: "newemail@example.com",
                           description: "Email mới"
                        },
                        hoTen: { 
                           type: "string", 
                           example: "Nguyễn Văn B",
                           description: "Họ tên mới"
                        },
                        soDt: { 
                           type: "string", 
                           example: "0987654321",
                           description: "Số điện thoại mới"
                        },
                        maLoaiNguoiDung: { 
                           type: "string", 
                           example: "QuanTri",
                           description: "Mã loại người dùng mới"
                        },
                        maNhom: { 
                           type: "string", 
                           example: "GP02",
                           description: "Mã nhóm mới"
                        }
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: "Cập nhật thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Cập nhật thành công" },
                           data: {
                              type: "object",
                              properties: {
                                 taiKhoan: { type: "string" },
                                 hoTen: { type: "string" },
                                 email: { type: "string" },
                                 soDt: { type: "string" },
                                 maLoaiNguoiDung: { type: "string" },
                                 maNhom: { type: "string" }
                              }
                           }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Tài khoản không tồn tại hoặc dữ liệu không hợp lệ"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   },
   "/api/QuanLyNguoiDung/XoaNguoiDung": {
      delete: {
         tags: ["Quản lý người dùng"],
         summary: "Xóa người dùng",
         security: [{ Minh_Hieu_BearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     required: ["taiKhoan"],
                     properties: {
                        taiKhoan: { 
                           type: "string", 
                           example: "user123",
                           description: "Tài khoản cần xóa"
                        }
                     },
            },
         },
      },
   },
         responses: {
            200: {
               description: "Xóa thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           message: { type: "string", example: "Xóa người dùng thành công" }
                        }
                     }
                  }
               }
            },
            400: {
               description: "Tài khoản không tồn tại"
            },
            401: {
               description: "Không có quyền truy cập"
            }
         },
      },
   }
};

export default authSwagger;
