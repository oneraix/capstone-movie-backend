import multer from "multer";


const storage = multer.memoryStorage();
const uploadcloud = multer({storage:storage});


export default uploadcloud;
