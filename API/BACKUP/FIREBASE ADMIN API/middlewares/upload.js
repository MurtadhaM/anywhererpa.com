const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require("path");




let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "./../uploads");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + "-" + path.extname(file.originalname));
    },


});

let upload = multer({
    storage: storage,

    limits: { fileSize: maxSize },

})

let uploadFileMiddleware = util.promisify(upload.single("file"));
exports.uploadFileMiddleware = uploadFileMiddleware;
exports.upload = upload;
module.exports = uploadFileMiddleware;
module.exports = upload;