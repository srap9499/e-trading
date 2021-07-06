'use strict';

const { BadRequest } = require('http-errors');
const multer = require('multer');

const {
    ERROR_MESSAGES: {
        FILE_IS_CSV_ERROR
    },
    PUBLIC_FORDER_NAME,
    PRODUCTS_IMAGE_PATH,
    BULK_ADD_FILES_PATH,
    REQUEST_PROPERTIES: {
        REQUEST_USERDATA,
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

const add_bulk_file_engine = multer.diskStorage({
    destination: function (req, file, cb) {
        let error = null;
        if (file.mimetype !== 'application/vnd.ms-excel') {
            error = new BadRequest(FILE_IS_CSV_ERROR);
        }
        cb(error, PUBLIC_FORDER_NAME + BULK_ADD_FILES_PATH);     //  public/bulk_add_files/
    },
    filename: function(req, file, cb) {
        let error = null;
        if (file.mimetype !== 'application/vnd.ms-excel') {
            error = new BadRequest(FILE_IS_CSV_ERROR);
        }
        const { id: user_part } = req[REQUEST_USERDATA];
        const file_extension = file.originalname.split('.').reverse()[0].toLocaleLowerCase();
        const fileName = file.fieldname + '_' + user_part  + '.' + file_extension;

        req[REQUEST_FILENAME] = fileName;
        cb(error, fileName);
    }
});

const upload_add_bulk_file = multer({ storage: add_bulk_file_engine});

module.exports = {
    upload_product_image,
    upload_add_bulk_file
};