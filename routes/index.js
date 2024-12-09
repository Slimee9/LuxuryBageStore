const express = require("express");
const router = express.Router()
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require('../models/product-model');
const { registerUser,
    loginUser,
    logout
 } = require("../controllers/authController");
const userModel = require("../models/user-model");

router.get("/", (req,res) => {
    let error = req.flash("error");
    res.render("index", {error, loggedin : false});
});

router.get("/shop", isLoggedIn, async (req,res) => {
    let products = await productModel.find()
    let success = req.flash("success")
    // req.flash("success","Login Succesfully")
    res.render("shop", { products, success });
})
router.get("/cart", isLoggedIn, async (req,res) => {
    let user = await userModel
    .findOne({email: req.user.email})
    .populate("cart");
    // console.log(user.cart[0]) 
    
    const bill = (Number(user.cart[0].price) + 20) - Number(user.cart[0].discount)
    res.render("cart", { user, bill});
    
})
router.get("/addtocart/:productid", isLoggedIn, async (req,res) => {
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save() ;
    req.flash("success","Added to cart")
    res.redirect( "/shop" )
})
router.get("/logout", isLoggedIn, (req,res) => {
    res.render("shop");
})
// router.get("/account", isLoggedIn, async (req,res) => {
//     let user = await 

// })

router.get("/admin", isLoggedIn, (req,res) => {
    res.render("admin");
})
router.get("/owner/login", isLoggedIn, (req,res) => {
    res.render("owner-login")
} )

module.exports = router;