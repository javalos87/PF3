import { fileURLToPath } from "url";
import { dirname } from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

export default __dirname;

import multer from "multer";

// Antes de instanciar multer, debemos configurar donde se almacenaran los archivos
const storage = multer.diskStorage({
  //destination hara referencia a la carpeta donde se va a guardar el archivo
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/img"); //Especificamos la carpeta en este punto
  },
  //filename hara referencia al nombre final que contendra el archivo
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // originalname indica que se conserva el nombre inicial
  },
});

export const uploader = multer({ storage });
