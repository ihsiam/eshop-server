// dependencies
const multer = require('multer');

// filename and location
const storage = multer.diskStorage({
    destination(req, res, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const originalName = file.originalname.split('.')[0];
        const fileName = `${originalName}-${uniqueSuffix}.png`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

module.exports = upload;
