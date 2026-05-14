# 📁 Multer File Upload Guide

This guide explains how to use the reusable Multer middleware located in `src/middleware/multer.middleware.ts`.

---

## 🚀 1. Core Features
- **Configurable Subfolders**: Pass any string as the destination folder.
- **Dynamic Placeholders**: Use `{uploadmonth}` to automatically sort uploads by month (e.g., `May-2026`).
- **Auto-Routing**: Files in the `subimages` field are automatically moved to a `/subimages` subfolder.
- **Auto-Directory Creation**: The middleware creates missing folders recursively.

---

## 🛠 2. Usage Examples

### A. Single File Upload (e.g., Profile Picture)
**Route:**
```typescript
import upload from "../../middleware/multer.middleware.js";

// Uploads to: uploads/profile/
router.post("/update-avatar", 
    upload("profile").single("avatar"), 
    userController.updateAvatar
);
```

**Controller:**
```typescript
const updateAvatar = async (req, res) => {
    if (!req.file) throw new Error("No file uploaded");
    
    const filePath = req.file.path; // The full path on disk
    const fileName = req.file.filename; // The unique name generated
    // ... save fileName to User model in DB
};
```

---

### B. Multiple Categories (e.g., Product Main + Gallery)
This handles the specific requirement for `mainimage` and `subimages` being sorted into nested folders.

**Route:**
```typescript
// Main images go to: uploads/products/May-2026/
// Sub-images go to:  uploads/products/May-2026/subimages/
router.post("/add-product", 
    upload("products/{uploadmonth}").fields([
        { name: "mainimage", maxCount: 1 },
        { name: "subimages", maxCount: 10 }
    ]), 
    productController.createProduct
);
```

**Controller:**
```typescript
const createProduct = async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const mainImage = files['mainimage'] ? files['mainimage'][0].filename : null;
    const gallery = files['subimages'] ? files['subimages'].map(file => file.filename) : [];
    
    // Save these strings/arrays to your Product model
};
```

---

### C. Simple Array Upload
**Route:**
```typescript
// Uploads to: uploads/banners/May-2026/
router.post("/banners", 
    upload("banners/{uploadmonth}").array("images", 5), 
    controller
);
```

---

## ⚠️ 3. Constraints & Validation
1. **File Size**: Maximum **5MB** per file (configured in middleware).
2. **File Extensions**: Only `.jpg`, `.jpeg`, `.png`, and `.webp` are permitted.
3. **Naming**: Files are automatically prefixed with their field name and a timestamp to ensure uniqueness.
   - Example: `subimages-1715694000-123456789.png`

---

## 🔧 4. Troubleshooting
- **Error: "Only image files are allowed"**: Check if your file has a supported extension.
- **Folder Permissions**: Ensure the Node.js process has write access to the `uploads/` directory defined in your `.env`.
- **Large Files**: If you need to upload larger files, adjust the `fileSize` limit in `multer.middleware.ts`.
