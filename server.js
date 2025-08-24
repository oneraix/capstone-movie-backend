import express from "express";
import rootRouter from "./src/routers/root.router.js";
import { DATABASE_URL } from "./src/common/constant/app.constant.js";
import handleError from "./src/common/helpers/handleError.helper.js";
import morgan from "morgan";
import logApi from "./src/common/morgan/init.morgan.js";
import prisma from "./src/common/prisma/init.prisma.js";
import cors from "cors"
import { ruruHTML } from "ruru/server";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./src/common/swagger/swagger.js";

const app = express()

//middleware
app.use(express.json());// chuyển dữ liệu từ JSON sang dôi tượng javascript
app.use(cors({origin:'*'}));
app.use(logApi);
app.use(express.static("."));

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get(
   "/api-docs",
   swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
         persistAuthorization: true,
      },
   })
);

app.use("/api",rootRouter)
app.use(handleError)

//socket
import { createServer } from "http";
import initSocket from "./src/common/socket/init.socket.js";
const httpServer = createServer(app);// đặt app ở đây và gọi httpServer ở listen để dùng cả socket và app
initSocket(httpServer)// truyền httpServer vào init.socket.js



httpServer.listen(3069, () =>{
    console.log(`Server is running on port http://localhost:3069`);
    console.log(`Swagger UI available at http://localhost:3069/api-docs`);
});

/**
 * express: lõi để xây dựng BE -> API
 * nodemon: reload lại server khi có code thay
 * mysql2: để tương tác với DB bằng CÂU LỆNH SQL
 * sequelize: ORM giúp tương tác với DB bằng function
 * sequelize-auto: Tự động tạo code model cho sequelize từ database có sẵn
 */