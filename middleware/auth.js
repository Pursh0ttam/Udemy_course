let jwt = require("jsonwebtoken");
let UserSchema = require("../Schema/Schema");
const { model } = require("mongoose");
const jwtAutherization = require("../Auth/CompareJWT");
let items = model("User", UserSchema);


let auth = async (req, res, next) => {
    try {
        let token = req.header("Authorization").replace('Bearer ', "")
        console.log("this is 5token",token);
        let decoder = jwt.verify(token, "helloworld")
        const user = await items.findOne({ _id: decoder.id, 'tokens.token': token })
        // console.log("this is user", user);
        if (!user) {
            return res.status(200).send("this token is no longer exist in database")
        }
        req.token = token
        req.user = user
        // console.log("this is from auth",req.user); 

        next()

    } catch (error) {
        res.status(401).send({ error: true, message: error.message })
    }

};
module.exports = auth;
