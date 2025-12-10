// import { Router } from "express";
// import multer from 'multer'
// import { uploadMaterialWithPriceController } from '../controllers/Admin.controller.js'

// const adminRouter = Router()
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });
// const upload = multer({ storage });

// adminRouter.post("/upload", upload.single("file"), uploadMaterialWithPriceController);

// export default adminRouter;

import { Router } from "express";
import multer from 'multer';
import fs from 'fs';
import { uploadMaterialWithPriceController, updateRate } from '../controllers/Admin.controller.js';

const adminRouter = Router();

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

adminRouter.post("/upload", upload.single("file"), uploadMaterialWithPriceController);
adminRouter.post('/updateRateWithSingleButton',updateRate)

export default adminRouter;
