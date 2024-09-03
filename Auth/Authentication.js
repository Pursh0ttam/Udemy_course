let jwt = require("jsonwebtoken");
let UserSchema = require("../Schema/Schema");
const { model } = require("mongoose");
let items = model("User", UserSchema);

let AuthToken = async (user) => {
  // console.log(user);
  let token = jwt.sign(user, "helloworld",{ expiresIn: '1 hour'});
  return token;
};
module.exports = AuthToken;
