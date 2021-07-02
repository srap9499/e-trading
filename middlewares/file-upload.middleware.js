'use strict';

const multer = require('multer');

const {
    PUBLIC_FORDER_NAME,
    PRODUCTS_IMAGE_PATH,
    REQUEST_PROPERTIES: {
        REQUEST_FILENAME
    }
} = require('../constants/main.constant');
const { fileNameDateString } = require('../helpers/date.helper');

const product_image_engine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PUBLIC_FORDER_NAME + PRODUCTS_IMAGE_PATH);     //  public/images/products/
    },
    filename: function(req, file, cb) {
        const product_name = req.body.name.replace(' ', '_');
        const date_part = fileNameDateString();
        const file_extension = file.originalname.split('.').reverse()[0];
        const fileName = product_name.slice(0, 30) + '_' + date_part + '.' + file_extension;

        req[REQUEST_FILENAME] = fileName;
        cb(null, fileName);
    }
});

const upload_product_image = multer({ storage: product_image_engine});

module.exports = { upload_product_image };