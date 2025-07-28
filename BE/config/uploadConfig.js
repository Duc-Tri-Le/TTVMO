import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "uploads/images/");
    } else if (file.fieldname === "document") {
      cb(null, "uploads/pdf/");
    } else if (file.fieldname === "video") {
      cb(null, "uploads/video");
    } else {
      cb(new Error("Loại file không hỗ trợ"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Lọc file theo mime-type
const fileFilter = (req, file, cb) => {
  const isImage =
    file.fieldname === "image" &&
    (file.mimetype === "image/jpeg" || file.mimetype === "image/png");
  const isPDF =
    file.fieldname === "document" && file.mimetype === "application/pdf";
  const isVideo = file.fieldname === "video" && file.mimetype === "video/mp3";
  if (isImage || isPDF || isVideo) cb(null, true);
  else cb(new Error("File không hợp lệ"), false);
};

const limits = {
  fileSize: 500 * 1024 * 1024, // 500MB
};
const upload = multer({ storage: storage, fileFilter, limits });

export { upload };
