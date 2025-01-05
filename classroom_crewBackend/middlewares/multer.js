const multer = require('multer');

// Configure Multer for memory storage
const fileStorage = multer.memoryStorage();

const fileUpload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF is allowed'));
        }
    },
});

module.exports = fileUpload;
