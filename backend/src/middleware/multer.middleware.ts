import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../configs/constant.config.js";


export const upload = (subfolder: string) => {
    const storage = multer.diskStorage({
        destination: (_req, file, cb) => {
            // 1. Resolve dynamic path placeholders
            const now = new Date();
            const monthYear = now.toLocaleString('default', { month: 'short' }) + "-" + now.getFullYear();

            const resolvedSubfolder = subfolder.replace("{uploadmonth}", monthYear);
            let targetPath = path.join(config.UPLOADS_PATH, resolvedSubfolder);

            // 2. Handle sub-categorization for 'subimages' field
            if (file.fieldname === "subimages") {
                targetPath = path.join(targetPath, "subimages");
            }

            // 3. Ensure directory exists
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath, { recursive: true });
            }

            cb(null, targetPath);
        },
        filename: (_req, file, cb) => {
            // 3. Generate unique filename to avoid overwriting
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const extension = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
    });

    // 4. Configure Multer instance
    return multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        },
        fileFilter: (_req, file, cb) => {
            const allowedFileTypes = /jpeg|jpg|png|webp/;
            const isExtValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
            const isMimeValid = allowedFileTypes.test(file.mimetype);

            if (isExtValid && isMimeValid) {
                return cb(null, true);
            }
            cb(new Error("Error: Only image files (jpeg, jpg, png, webp) are allowed!"));
        }
    });
};

export default upload;
