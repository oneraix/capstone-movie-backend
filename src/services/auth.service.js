import { token } from "morgan";
import { BadrequestException, UnauthorizedException } from "../common/helpers/exception.helper";
import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";
import tokenService from "./token.service";
import { OAuth2Client } from "google-auth-library";
import jwt, { decode } from "jsonwebtoken";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../common/constant/app.constant";
import sendMail from "../common/nodemailer/init.nodemailer";

const authService = {
   register: async (req) => {
      const { taiKhoan, email, matKhau, hoTen, soDt} = req.body;

      // Validate required fields
      if (!taiKhoan || !email || !matKhau || !hoTen || !soDt) {
         throw new BadrequestException("Vui lòng nhập đầy đủ thông tin bắt buộc");
      }

      // Tìm kiếm tài khoản đã tồn tại hay chưa
      const userExistByTaiKhoan = await prisma.nguoiDung.findUnique({
         where: {
            taiKhoan: taiKhoan,
         },
      });

      if (userExistByTaiKhoan) {
         throw new BadrequestException("Tài khoản đã tồn tại");
      }

      // Tìm kiếm email đã tồn tại hay chưa
      const userExistByEmail = await prisma.nguoiDung.findUnique({
         where: {
            email: email,
         },
      });

      if (userExistByEmail) {
         throw new BadrequestException("Email đã được sử dụng");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         throw new BadrequestException("Email không hợp lệ");
      }

      // Validate phone number
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(soDt)) {
         throw new BadrequestException("Số điện thoại không hợp lệ");
      }

      const passwordHash = bcrypt.hashSync(matKhau, 10);

      const userNew = await prisma.nguoiDung.create({
         data: {
            taiKhoan: taiKhoan,
            email: email,
            matKhau: passwordHash,
            hoTen: hoTen,
            soDt: soDt,
         },
      });

      // Remove password from response
      const { matKhau: _, ...userResponse } = userNew;
      return userResponse;
   },

   login: async(req)=>{
      const { taiKhoan, matKhau } = req.body;

      // Validate required fields
      if (!taiKhoan || !matKhau) {
         throw new BadrequestException("Vui lòng nhập tài khoản và mật khẩu");
      }

      // Tìm user bằng tài khoản hoặc email
      const userExist = await prisma.nguoiDung.findFirst({
         where: {
            OR: [
               { taiKhoan: taiKhoan },
               { email: taiKhoan }
            ]
         }
      });

      if (!userExist) {
         throw new BadrequestException("Tài khoản không tồn tại");
      }

      // Kiểm tra mật khẩu
      const isPassword = bcrypt.compareSync(matKhau, userExist.matKhau);
      if (!isPassword) {
         throw new BadrequestException("Mật khẩu không chính xác");
      }

      // Tạo tokens với taiKhoan thay vì id
      const tokens = tokenService.createTokens(userExist.taiKhoan);

      // Trả về tokens và thông tin cơ bản của user
      const { matKhau: _, ...userInfo } = userExist;
      
      return {
         ...tokens,
         user: {
            taiKhoan: userInfo.taiKhoan,
            hoTen: userInfo.hoTen,
            email: userInfo.email,
            maLoaiNguoiDung: userInfo.maLoaiNguoiDung
         }
      };
   },

   getInfo: async(req)=>{
      const { matKhau, ...userInfo } = req.user;
      return {
         taiKhoan: userInfo.taiKhoan,
         hoTen: userInfo.hoTen,
         email: userInfo.email,
         soDt: userInfo.soDt,
         maLoaiNguoiDung: userInfo.maLoaiNguoiDung,
         maNhom: userInfo.maNhom
      };
   },

  googleLogin: async (req) => {
      const { code } = req.body;

      const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "postmessage");

      // Nếu vượt qua được dòng code này => google đã xác minh cho mình người dùng này hợp lệ
      const { tokens: tokensGoogle } = await oAuth2Client.getToken(code);

      const decode = jwt.decode(tokensGoogle.id_token);

      console.log({ code, id_token: tokensGoogle.id_token, decode });

      const { email, email_verified, name, picture } = decode;

      if (!email_verified) throw new BadrequestException("Email chưa được xác thực");

      let userExist = await prisma.nguoiDung.findUnique({
         where: {
            email: email,
         },
      });

      if (!userExist) {
         // Tạo tài khoản tự động từ email
         const taiKhoan = email.split('@')[0] + '_' + Date.now();
         
         userExist = await prisma.nguoiDung.create({
            data: {
               taiKhoan: taiKhoan,
               email: email,
               hoTen: name,
               soDt: "0000000000", // Số điện thoại mặc định
               matKhau: bcrypt.hashSync(Math.random().toString(36), 10), // Mật khẩu random
               maNhom: "GP01",
               maLoaiNguoiDung: "KhachHang"
            },
         });
      }

      const tokens = tokenService.createTokens(userExist.taiKhoan);

      console.log({ tokens });

      return tokens;
   },

   refreshToken: async (req) => {
      const { accessToken, refreshToken } = req.body;

      const decodeRefreshToken = tokenService.verifyRefreshToken(refreshToken);
      const decodeAccessToken = tokenService.verifyAccessToken(accessToken, true);

      if (decodeRefreshToken.userId !== decodeAccessToken.userId) {
         throw new UnauthorizedException("Refresh Token không thành công");
      }
      const tokens = tokenService.createTokens(decodeRefreshToken.userId);

      return tokens;
   },

   // GET /api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung
   layDanhSachLoaiNguoiDung: async (req) => {
      // Trả về danh sách các loại người dùng có sẵn
      return [
         { maLoaiNguoiDung: "KhachHang", tenLoaiNguoiDung: "Khách hàng" },
         { maLoaiNguoiDung: "QuanTri", tenLoaiNguoiDung: "Quản trị viên" }
      ];
   },

   // GET /api/QuanLyNguoiDung/LayDanhSachNguoiDung
   layDanhSachNguoiDung: async (req) => {
      const { maNhom } = req.query;

      const whereCondition = {};
      if (maNhom) {
         whereCondition.maNhom = maNhom;
      }

      const users = await prisma.nguoiDung.findMany({
         where: whereCondition,
         select: {
            taiKhoan: true,
            hoTen: true,
            email: true,
            soDt: true,
            maLoaiNguoiDung: true
         },
         orderBy: {
            createdAt: 'desc'
         }
      });

      return users;
   },

   // GET /api/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang
   layDanhSachNguoiDungPhanTrang: async (req) => {
      let { page, pageSize, maNhom } = req.query;
      page = +page > 0 ? +page : 1;
      pageSize = +pageSize > 0 ? +pageSize : 10;

      const whereCondition = {};
      if (maNhom) {
         whereCondition.maNhom = maNhom;
      }

      const skip = (page - 1) * pageSize;

      const users = await prisma.nguoiDung.findMany({
         where: whereCondition,
         select: {
            taiKhoan: true,
            hoTen: true,
            email: true,
            soDt: true,
            maLoaiNguoiDung: true
         },
         take: pageSize,
         skip: skip,
         orderBy: {
            createdAt: 'desc'
         }
      });

      const totalCount = await prisma.nguoiDung.count({
         where: whereCondition
      });

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
         currentPage: page,
         count: pageSize,
         totalCount: totalCount,
         totalPages: totalPages,
         items: users
      };
   },

   // GET /api/QuanLyNguoiDung/TimKiemNguoiDung
   timKiemNguoiDung: async (req) => {
      const { tuKhoa, maNhom } = req.query;

      if (!tuKhoa) {
         throw new BadrequestException("Từ khóa tìm kiếm là bắt buộc");
      }

      const whereCondition = {
         OR: [
            { taiKhoan: { contains: tuKhoa } },
            { hoTen: { contains: tuKhoa } },
            { email: { contains: tuKhoa } },
            { soDt: { contains: tuKhoa } }
         ]
      };

      if (maNhom) {
         whereCondition.maNhom = maNhom;
      }

      const users = await prisma.nguoiDung.findMany({
         where: whereCondition,
         select: {
            taiKhoan: true,
            hoTen: true,
            email: true,
            soDt: true,
            maLoaiNguoiDung: true
         },
         orderBy: {
            createdAt: 'desc'
         }
      });

      return users;
   },

   // GET /api/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang
   timKiemNguoiDungPhanTrang: async (req) => {
      let { page, pageSize, tuKhoa, maNhom } = req.query;
      page = +page > 0 ? +page : 1;
      pageSize = +pageSize > 0 ? +pageSize : 10;

      if (!tuKhoa) {
         throw new BadrequestException("Từ khóa tìm kiếm là bắt buộc");
      }

      const whereCondition = {
         OR: [
            { taiKhoan: { contains: tuKhoa } },
            { hoTen: { contains: tuKhoa } },
            { email: { contains: tuKhoa } },
            { soDt: { contains: tuKhoa } }
         ]
      };

      if (maNhom) {
         whereCondition.maNhom = maNhom;
      }

      const skip = (page - 1) * pageSize;

      const users = await prisma.nguoiDung.findMany({
         where: whereCondition,
         select: {
            taiKhoan: true,
            hoTen: true,
            email: true,
            soDt: true,
            maNhom: true,
            maLoaiNguoiDung: true,
            createdAt: true
         },
         take: pageSize,
         skip: skip,
         orderBy: {
            createdAt: 'desc'
         }
      });

      const totalCount = await prisma.nguoiDung.count({
         where: whereCondition
      });

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
         currentPage: page,
         count: pageSize,
         totalCount: totalCount,
         totalPages: totalPages,
         items: users
      };
   },

   // POST /api/QuanLyNguoiDung/ThongTinTaiKhoan
   thongTinTaiKhoan: async (req) => {
      const user = req.user;
      if (!user) {
         throw new BadrequestException("Người dùng chưa đăng nhập");
      }

      // Lấy thông tin lịch sử đặt vé của user
      const lichSuDatVe = await prisma.datVe.findMany({
         where: {
            taiKhoan: user.taiKhoan
         },
         include: {
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
            },
            Ghe: true
         },
         orderBy: {
            createdAt: 'desc'
         }
      });

      const { matKhau, ...userInfo } = user;

      return {
         thongTinNguoiDung: userInfo,
         thongTinDatVe: lichSuDatVe
      };
   },

   // POST /api/QuanLyNguoiDung/LayThongTinNguoiDung
   layThongTinNguoiDung: async (req) => {
      const { taiKhoan } = req.body;

      if (!taiKhoan) {
         throw new BadrequestException("Tài khoản là bắt buộc");
      }

      const user = await prisma.nguoiDung.findUnique({
         where: {
            taiKhoan: taiKhoan
         },
         select: {
            taiKhoan: true,
            hoTen: true,
            email: true,
            soDt: true,
            maNhom: true,
            maLoaiNguoiDung: true,
            createdAt: true,
            updatedAt: true
         }
      });

      if (!user) {
         throw new BadrequestException("Người dùng không tồn tại");
      }

      return user;
   },

   // POST /api/QuanLyNguoiDung/ThemNguoiDung
   themNguoiDung: async (req) => {
      const { taiKhoan, email, matKhau, hoTen, soDt, maNhom, maLoaiNguoiDung } = req.body;
      const user = req.user;

      // Kiểm tra quyền admin
      if (user.maLoaiNguoiDung !== 'QuanTri') {
         throw new BadrequestException("Chỉ có quản trị viên mới có thể thêm người dùng");
      }

      // Validate required fields
      if (!taiKhoan || !email || !matKhau || !hoTen || !soDt) {
         throw new BadrequestException("Vui lòng nhập đầy đủ thông tin bắt buộc");
      }

      // Kiểm tra tài khoản đã tồn tại
      const userExistByTaiKhoan = await prisma.nguoiDung.findUnique({
         where: { taiKhoan: taiKhoan }
      });

      if (userExistByTaiKhoan) {
         throw new BadrequestException("Tài khoản đã tồn tại");
      }

      // Kiểm tra email đã tồn tại
      const userExistByEmail = await prisma.nguoiDung.findUnique({
         where: { email: email }
      });

      if (userExistByEmail) {
         throw new BadrequestException("Email đã được sử dụng");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         throw new BadrequestException("Email không hợp lệ");
      }

      // Validate phone number
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(soDt)) {
         throw new BadrequestException("Số điện thoại không hợp lệ");
      }

      const passwordHash = bcrypt.hashSync(matKhau, 10);

      const newUser = await prisma.nguoiDung.create({
         data: {
            taiKhoan: taiKhoan,
            email: email,
            matKhau: passwordHash,
            hoTen: hoTen,
            soDt: soDt,
            maNhom: maNhom || "GP01",
            maLoaiNguoiDung: maLoaiNguoiDung || "KhachHang"
         }
      });

      const { matKhau: _, ...userResponse } = newUser;
      return userResponse;
   },

   // PUT & POST /api/QuanLyNguoiDung/CapNhatThongTinNguoiDung
   capNhatThongTinNguoiDung: async (req) => {
      const { taiKhoan, email, matKhau, hoTen, soDt, maNhom, maLoaiNguoiDung } = req.body;
      const currentUser = req.user;

      if (!taiKhoan) {
         throw new BadrequestException("Tài khoản là bắt buộc");
      }

      // Kiểm tra quyền: chỉ admin hoặc chính user đó mới được cập nhật
      if (currentUser.maLoaiNguoiDung !== 'QuanTri' && currentUser.taiKhoan !== taiKhoan) {
         throw new BadrequestException("Bạn không có quyền cập nhật thông tin người dùng này");
      }

      // Kiểm tra user tồn tại
      const userExist = await prisma.nguoiDung.findUnique({
         where: { taiKhoan: taiKhoan }
      });

      if (!userExist) {
         throw new BadrequestException("Người dùng không tồn tại");
      }

      // Prepare update data
      const updateData = {};

      if (email) {
         // Kiểm tra email mới có trùng với user khác không
         if (email !== userExist.email) {
            const emailExist = await prisma.nguoiDung.findUnique({
               where: { email: email }
            });
            if (emailExist) {
               throw new BadrequestException("Email đã được sử dụng");
            }
         }
         
         // Validate email format
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
            throw new BadrequestException("Email không hợp lệ");
         }
         updateData.email = email;
      }

      if (hoTen) updateData.hoTen = hoTen;
      
      if (soDt) {
         // Validate phone number
         const phoneRegex = /^[0-9]{10,11}$/;
         if (!phoneRegex.test(soDt)) {
            throw new BadrequestException("Số điện thoại không hợp lệ");
         }
         updateData.soDt = soDt;
      }

      if (matKhau) {
         updateData.matKhau = bcrypt.hashSync(matKhau, 10);
      }

      // Chỉ admin mới được thay đổi nhóm và loại người dùng
      if (currentUser.maLoaiNguoiDung === 'QuanTri') {
         if (maNhom) updateData.maNhom = maNhom;
         if (maLoaiNguoiDung) updateData.maLoaiNguoiDung = maLoaiNguoiDung;
      }

      updateData.updatedAt = new Date();

      const updatedUser = await prisma.nguoiDung.update({
         where: { taiKhoan: taiKhoan },
         data: updateData
      });

      const { matKhau: _, ...userResponse } = updatedUser;
      return userResponse;
   },

   // DELETE /api/QuanLyNguoiDung/XoaNguoiDung
   xoaNguoiDung: async (req) => {
      const { taiKhoan } = req.query;
      const currentUser = req.user;

      // Kiểm tra quyền admin
      if (currentUser.maLoaiNguoiDung !== 'QuanTri') {
         throw new BadrequestException("Chỉ có quản trị viên mới có thể xóa người dùng");
      }

      if (!taiKhoan) {
         throw new BadrequestException("Tài khoản là bắt buộc");
      }

      // Không cho phép xóa chính mình
      if (currentUser.taiKhoan === taiKhoan) {
         throw new BadrequestException("Không thể xóa chính tài khoản của mình");
      }

      // Kiểm tra user tồn tại
      const userExist = await prisma.nguoiDung.findUnique({
         where: { taiKhoan: taiKhoan }
      });

      if (!userExist) {
         throw new BadrequestException("Người dùng không tồn tại");
      }

      // Kiểm tra user có đặt vé nào không
      const bookingCount = await prisma.datVe.count({
         where: { taiKhoan: taiKhoan }
      });

      if (bookingCount > 0) {
         throw new BadrequestException("Không thể xóa người dùng đã có lịch sử đặt vé");
      }

      // Xóa user
      await prisma.nguoiDung.delete({
         where: { taiKhoan: taiKhoan }
      });

      return { message: "Xóa người dùng thành công" };
   },
};

export default authService;