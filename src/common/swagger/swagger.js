import authSwagger from "./auth.swagger.js";
import datveSwagger from "./datve.swagger.js";
import rapSwagger from "./rap.swagger.js";
import phimSwagger from "./phim.swagger.js";

const swaggerDocument = {
  openapi: "3.1.1", 
  info: {
    title: "Movie Booking API",
    version: "1.0.0",
    description: "API hệ thống đặt vé xem phim",
    contact: {
      name: "API Support",
      email: "support@moviebooking.com"
    }
  },
  servers: [
    {
      url: "/",
      description: "Local Server",
    },
    {
      url: "/",
      description: "Product Server",
    },
  ],
  components: {
    securitySchemes: {
      Minh_Hieu_BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token để xác thực người dùng"
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Thông báo lỗi"
          }
        }
      },
      Success: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Thông báo thành công"
          },
          data: {
            type: "object",
            description: "Dữ liệu trả về"
          }
        }
      }
    }
  },
  tags: [
    {
      name: "Quản lý người dùng",
      description: "Các API liên quan đến quản lý người dùng, đăng ký, đăng nhập"
    },
    {
      name: "Quản lý đặt vé",
      description: "Các API liên quan đến đặt vé và quản lý lịch chiếu"
    },
    {
      name: "Quản lý rạp",
      description: "Các API liên quan đến thông tin rạp chiếu phim"
    },
    {
      name: "Quản lý phim",
      description: "Các API liên quan đến quản lý phim và banner"
    }
  ],
  paths:{
    ...authSwagger,
    ...datveSwagger,
    ...rapSwagger,
    ...phimSwagger,
  }
};

export default swaggerDocument;

