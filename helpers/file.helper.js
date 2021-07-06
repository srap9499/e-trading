'use strict';

const fs = require('fs');
const csvParser = require('csv-parser');

exports.removeFile = async (path) => {
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(path);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

exports.readCsvFile = async (path) => {
    return new Promise((resolve, reject) => {
        try {
            let data = [];
            fs.createReadStream(path)
            .pipe(csvParser())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};