'use strict';


exports.getHome = async (req, res, next) => {
    const user = req.userData;
    const title = "E-Trading";
    res.render('home', {
        title,
        user
    });
};