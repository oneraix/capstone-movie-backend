import tokenService from "../../services/token.service";
import { ACCESS_TOKEN_SECRET } from "../constant/app.constant";
import { BadrequestException, UnauthorizedException } from "../helpers/exception.helper"
import jwt from "jsonwebtoken";
import prisma from "../prisma/init.prisma";

const protect = async (req, res, next) =>{
    req.isProtect = true;
    const authHeader =req.headers?.authorization || "";
    const [type, token] = authHeader.split(" ");
    if(!token){
        throw new UnauthorizedException("Người dùng chưa đăng nhập");
    }
    if(type !== `Bearer`){
        throw new UnauthorizedException("Kiểu token không hợp lệ");
    }
 
    //kiểm tra token
    //nếu chạy quaa là token hợp lệ
    //nếu có lỗi thì tự throw (jwt.verify), chúng ta không cần throw
    console.log({token});
    const decode = tokenService.verifyAccessToken(token)
    const user = await prisma.nguoiDung.findUnique({
        where:{
            taiKhoan: decode.userId,
        }
    })
    req.user = user

    console.log(
        {
            token, 
            type,
            decode,
            user
        }
    )

    next()
}
export default protect