const multer = require('multer');
const path = require('path');

class MulterConfig {
  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/files');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname);
      },
    });

    this.upload = multer({
      storage: this.storage,
      //limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4', 'video/mpeg', 'application/pdf'];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo no permitido.'));
        }
      },
    });
  }
}

module.exports = new MulterConfig();