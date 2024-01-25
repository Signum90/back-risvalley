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
            limits: { fileSize: 5 * 1024 * 1024 },
        });
    }
}

module.exports = new MulterConfig();