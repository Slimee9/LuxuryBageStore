const jwt = require('jsonwebtoken')
const userModel = require("../models/user-model");
const { model } = require('mongoose');

module.exports = async (req,res,next) => {
    if (!req.cookies.token) {
        req.flash("error","you need to login First");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
        .findOne({ email: decoded.email })
        .select("-password"); // with - this field will not be selected
       
        req.user = user;
    
        next();
        
    } catch (err) {
        req.flash("error","Something went wrong")
        res.redirect("/")
    }
}