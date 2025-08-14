import multer from "multer";
import path from "path"
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/")
  },
  filename: function (req, file, cb) {
   const extName = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, "local" + '-' + uniqueSuffix + extName);
  }
})

const uploadLocal = multer({ 
    storage: storage ,
    limits:{
        fileSize: 1 * 1024 *1024//giới hạn 1 mb nên phải để 1*
    }
});

export default uploadLocal;
