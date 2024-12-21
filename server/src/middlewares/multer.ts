import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

// TODO
// change uploads from static folder to cloudinary

// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, "uploads");
//   },
//   filename(req, file, callback) {
//     const extension = file.originalname.split(".").pop();
//     callback(null, uuidv4().concat("." + extension));
//   },
// });

// export const singleUpload = multer({ storage }).single("photo");
