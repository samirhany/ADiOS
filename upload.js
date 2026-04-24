const multer = require('multer');
const path = require('path');

// 🔹 تحديد مجلد الرفع حسب نوع الملف
const getUploadFolder = (file) => {
    if (file.fieldname === "profile_image") return "uploads/profile";
    if (file.fieldname === "project_file") return "uploads/projects";
    return "uploads/other";
};

// 🔹 إعداد التخزين
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadFolder(file));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// 🔹 أنواع الملفات المسموحة حسب الحقل
const allowedTypes = {
    profile_image: /jpeg|jpg|png|gif/,
    project_file: /pdf|zip|rar/,
    file: /jpeg|jpg|png|gif|pdf/
};

// 🔹 فلتر التحقق من نوع الملف
const fileFilter = (req, file, cb) => {
    const field = file.fieldname;
    const allowed = allowedTypes[field] || allowedTypes.file;

    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    // منع رفع ملفات خطيرة حتى لو غيّر الامتداد
    const forbidden = /(exe|sh|bat|cmd|js|msi|dll)$/;
    if (forbidden.test(file.originalname.toLowerCase())) {
        return cb(new Error("❌ ملف خطير — غير مسموح برفعه"));
    }

    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("❌ نوع الملف غير مسموح به"));
    }
};

// 🔹 إعدادات multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

module.exports = upload;
