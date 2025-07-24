import multer from "multer";

const storage = multer.diskStorage({
    destination : (req, file, cd) => {
        cb(null, "uploads");
    },
    filename : (req, file, cd) => {
        cd(null, Date.now() + "-" + file.originalname);
    }
})

const upload = multer({storage : storage});

export {upload}