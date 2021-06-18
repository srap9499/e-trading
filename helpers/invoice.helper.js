const fs = require('fs');
var path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const { resolve } = require('path');

 
exports.invoiceGenerator = async (order) => {
    const invoicePath = path.resolve(__dirname, '../public/Invoices', `Invoice_${order.userId}_${order.id}.pdf`);
    const data = {
        soldBy: "E-Trading Pvt. Ltd.",
        order
    };
    try {
        
        const filePathName = path.resolve(__dirname, '../views', 'invoice.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();
        let  options = { format: 'Letter' };
        const ejsData = ejs.render(htmlString, data);
        return new Promise((resolve, reject) => {
            pdf.create(ejsData, options).toFile(invoicePath ,(err, response) => {
                if (err) return reject(err);
                return resolve(response);
            });
        });       
    } catch (err) {
        console.log("Error processing request: " + err);
        return Promise.reject(err);
    }
};