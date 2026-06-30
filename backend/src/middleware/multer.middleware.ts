import multer from "multer";
import path from "path";
import fs from "fs";
import slug from "slug";
import config from "../configs/constant.config.js";

export const upload = (subfolder: string, nameField?: string) => {
    const storage = multer.diskStorage({
        destination: (_req, file, cb) => {
            // 1. Resolve dynamic path placeholders
            const now = new Date();
            const monthYear = now.toLocaleString('default', { month: 'short' }) + "-" + now.getFullYear();

            const resolvedSubfolder = subfolder.replace("{uploadmonth}", monthYear);
            let targetPath = path.join(config.UPLOADS_PATH, resolvedSubfolder);

            // 2. Handle sub-categorization for 'subimages' field
            if (file.fieldname === "subimages" || file.fieldname.toLowerCase().includes("subimage")) {
                targetPath = path.join(targetPath, "subimages");
            }

            // 3. Ensure directory exists
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath, { recursive: true });
            }

            cb(null, targetPath);
        },
        filename: (req, file, cb) => {
            // Determine which field from req.body to use for the base name
            const fieldToRead = nameField || "name";
            // Get the value from req.body, fallback to original originalname (without extension) if not provided
            const rawBaseName = req.body[fieldToRead] || path.parse(file.originalname).name;
            const formattedName = slug(rawBaseName, { lower: true });
            
            const extension = path.extname(file.originalname);
            const isSubImage = file.fieldname.toLowerCase().includes("sub");

            if (isSubImage) {
                // For multiple files like sub-images, we MUST append a unique suffix so they don't overwrite each other
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
                cb(null, `${formattedName}_${file.fieldname}_${uniqueSuffix}${extension}`);
            } else {
                // For a main image, we can just use the base name directly (e.g., productname.jpg)
                // Appending a short timestamp ensures cache busting if the image is updated later
                cb(null, `${formattedName}_${Date.now()}${extension}`);
            }
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
