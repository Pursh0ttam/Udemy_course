const express = require("express");
let UserSchema = require("./Schema/Schema.js");
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

// let items = model("User", UserSchema);
let router = require("./router/route.js");
const auth = require("./middleware/Auth.js");
let app = express();

app.use((req, res, next) => {
  if (req.method === "GEy") {
    res.send("this request is not allowed")
  } else {

    next()
  }
})
app.use(express.json());
app.use(router);

let port = process.env.PORT || 3000;
let connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Products");
    console.log("connection successful");
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  } catch (error) {
    console.log(error);
  }
};
connectDB();

// let demo =async()=>{
//   let passowrd = "125478525"
//   // let hashpassword = await bycrypt.hash(passowrd,8)
//   // console.log(passowrd);
//   // console.log(hashpassword);
//  let hashpassword = await encryptionFun(passowrd);
// console.log(hashpassword);
//   // let ismatched = await bycrypt.compare("175478525",hashpassword)
//   // console.log(ismatched);
// }
// demo()
