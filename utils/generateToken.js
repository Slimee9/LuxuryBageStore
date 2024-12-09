const jwt = require("jsonwebtoken")

const generateToken = (user) => {
    
    return jwt.sign({email: user.email, id: user._id}, process.env.JWT_KEY)// detailed info of verified user after login which will be needed(i,e save info that we will get after decoding token   )
}

module.exports.generateToken = generateToken;