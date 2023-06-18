const util = require('util');
const multer = require('multer');

const fileImage = __dirname + 'public/images';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileImage.replace('src/services', ''));
    },

    filename: (req, file, cb) => {
        const arrFileName = file.originalname.split('.');
        const randomString = Math.random().toString(36).slice(-10);

        cb(null, Date.now() + randomString + '.' + arrFileName[1]);
    },
});

const fileImageMessage = __dirname + 'public/imagesOfMessages';

const storageMultifile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileImageMessage.replace('src/services', ''));
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const fileFilter2 = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadMultiImage = multer({
    storage: storageMultifile,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter2,
}).array('images', 5);

const singleImage = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter,
}).single('avatar');

const singleAvatar = util.promisify(singleImage);

const multiImage = util.promisify(uploadMultiImage);

module.exports = { multiImage, singleAvatar };
