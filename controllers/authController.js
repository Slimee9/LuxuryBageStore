const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken")
const flash = require('connect-flash')

module.exports.registerUser = async (req,res) => {
    try{
        let {email, password, fullname} = req.body;

        let user = await userModel.findOne({email: email});
        if (user) return res.status(401).send("User with is email already exists, Please login")

        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(password,salt,async(err,hash) => {
                if(err) return res.send(err.message);
                else{
                        let user = await userModel.create({
                            email,
                            password: hash,
                            fullname,
                         });
                         
                        let token = generateToken(user);
                        res.cookie("token",token);
                        
                        let success = req.flash("success")
                        res.flash(success ,"User created successfully");
                    };
            });
        });
    }catch(err){
        res.status(500).send({error:"error creating user: "+err.message})
    }
    
};

module.exports.loginUser = async (req,res) => {
    let {email,password} = req.body;

    let user = await userModel.findOne({ email: email })
    if(!user) return res.send("Email or Password Incorrect");

    bcrypt.compare(password, user.password, (err,result) => {
       if(result){
        let token = generateToken(user)
        res.cookie("token", token)
        
        let success = req.flash("success")
        req.flash(success ,"  Login Successfully");
        res.redirect("/shop");

       }
       else{
        return res.send("Email or Password Incorrect");
       }
    })
}

module.exports.logout = async (req,res) => {
    res.cookie("token","")
    res.redirect("/")
}