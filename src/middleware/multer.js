import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __filename and __dirname are not available in ES modules, so we need to construct them
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/temp"));
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });