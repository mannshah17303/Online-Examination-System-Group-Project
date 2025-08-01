import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file: ", file);
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname.split(".")[0]}-${Date.now()}.${
        file.mimetype.split("/")[1]
      }`
    );
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype == "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("File Type Error!"));
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, )
  }
})

export const videoUpload = multer({
  storage: storage
})