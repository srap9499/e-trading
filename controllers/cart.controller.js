'use strict';

const { sequelize } = require("../config/db-connection.config");

exports.addToCart = async (req, res, next) => {
    const { userData } = req;
    const userId = userData.id;
    const { productId, quantity } = req.body;
    try {
        await sequelize.query('CALL add_to_cart( :userId, :productId, :quantity )', {
            replacements: { userId, productId, quantity },
            logging: false
        });
        return res.status(200).send("SuccessFull!");
    } catch (e) {
        console.log(e.message);
        return res.status(500).send("Something went wrong!");
    }
};