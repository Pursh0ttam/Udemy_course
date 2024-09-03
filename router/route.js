const express = require("express");
let bycrypt = require("bcryptjs");
const encryptionFun = require("../encryption/encryption");
const decryptFun = require("../encryption/decryption");
let UserSchema = require("../Schema/Schema");
const { model } = require("mongoose");
let items = model("User", UserSchema);
// const packageName = require('packageName');
let router = express.Router();
const AuthToken = require("../Auth/Authentication");
const auth = require("../middleware/Auth");
const { ltrim } = require("validator");
// console.log(auth);

// ^login routes
router.post("/User/login", async (req, res) => {
  let { Email, password, mobile_num } = req.body;
  console.log("users email and password", Email, password);
  try {
    let dbData = await items.findOne({ $or: [{ Email }, { mobile_num }] });
    console.log("this is dest password", password);
    console.log("this is dbData", dbData.password);
    if (dbData) {
      let loginPassword = await decryptFun(password, dbData.password);
      console.log(loginPassword);
      if (loginPassword) {

        // ^generating token 
        let payLoad = { id: dbData._id, sname: dbData.sname }
        // console.log(payLoad);

        let token = await AuthToken(payLoad);
        console.log("this is token", token);
        // console.log("this is token which is created",token);
        // console.log("this is id",dbData._id);

        //^putting token in database        
        dbData.tokens = dbData.tokens.concat({ token });
        // dbData.tokens.push(token)
        // console.log(db.id);
        let valueCome = await items.findByIdAndUpdate(dbData._id, { tokens: dbData.tokens })
        // console.log(dbData.tokens.token={token});
        // dbData.password=undefined
        // dbData.tokens=undefined
        return res.send({ dbData, token });
      }
    }
    return res.send("no user exits");
  } catch (error) {
    console.log(error.message);
    return res.send(error);
  }
});

// ^signUP route
router.post("/User", async (req, res) => {
  try {
    let token = await AuthToken(req.body);
    let { password } = req.body;
    let hashpassword = await encryptionFun(password);
    req.body.password = hashpassword;
    req.body.tokens = { token }
    let data = await items.create(req.body);
    data.password = undefined
    data.tokens = undefined
    res.status(201).send({ data, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ^single user logout route
router.post("/User/logout", auth, async (req, res) => {

  // console.log("this is array",req.user.tokens);
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    console.log("thisis users name", req.user._id);
    let Access_User = await items.findByIdAndUpdate(req.user._id, { tokens: req.user.tokens })
    res.send(Access_User)

  } catch (error) {
    res.status(500).send("no one is to logout")

  }
})
//^ all user logout
router.post('/User/allLogout', auth, async (req, res) => {
  try {
    let allDelete = await items.findByIdAndUpdate(req.user._id, { tokens: [] })
    res.send(allDelete)

  } catch (error) {
    res.status(500).send({ error: true, message: error.message })
  }

})

// router.get("/getdata", async (req, res) => {
//   try {
//     let data = await items.find({});
//     // res.send("data fetched successfully",data) x
//     res.status(201).send(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// ^find one data from database
router.get("/getdata/:id", auth, async (req, res) => {
  let _id = req.params.id;
  console.log(_id);
  try {
    let findValue = await items.findById(_id);
    console.log(findValue);

    if (!findValue) {
      return res.status(404).send("id not matched");
    }

    res.send(findValue);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

// ^find all values from data base
router.get("/filter", auth, async (req, res) => {
  console.log("this is query for sort", req.query);

  let { limit = 0, skip = 0, sort = "asc" } = req.query

  console.log("this are values", sort)
  try {
    if (limit || skip || sort) {
      let sort = {}
      if (req.query.sort) {
        const parts = req.query.sort.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
      }
      req.query = {}
      let filteredData = await items.find(req.query).skip(skip).limit(limit).sort()
      if (filteredData) {
        res.status(200).send(filteredData)
      }
    }
    else if (1) {
      console.log("from two");
      let filteredData2 = await items.find(req.query)
      // console.log(filteredData2);
      res.status(200).send(filteredData2)
    }
    else {
      res.send("there is no user")
    }

  } catch (error) {
    return res.status(500).send(error)
  }

});

//^ To update in data base
router.patch("/patchdata/me", auth, async (req, res) => {

  // ---------------------------------------------------
  // //^ password hashing
  // let { password } = req.body;
  // console.log("this is password",password);
  // let hashpassword = await encryptionFun(password);
  // req.body.password = hashpassword;
  //   ---------------------------------------------------
  let newValues = Object.keys(req.body);
  let existingValues = ["sname", "age", "mobile_num", "Email", "password"];

  let isValideUpdate = newValues.every((update) => {
    return existingValues.includes(update);
  });

  if (!isValideUpdate) {
    return res.status(404).send("key is not present in schema");
  }
  try {
    newValues.forEach((update) => req.user[update] = req.body[update])
    let { password } = req.user;
    console.log("this is hashedpassword", password);
    let hashpassword = await encryptionFun(password);
    console.log("this is hashed password", hashpassword);
    req.user.password = hashpassword;
    console.log("this is user with updated hasedpasswrd", req.user);
    let allupdated = await items.findByIdAndUpdate(req.user._id, req.user)
    res.send(allupdated)

  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
});

//^ To delete the user

router.delete("/deleteUser/me", auth, async (req, res) => {
  console.log("this is from delete", req.user._id);
  try {
    await req.user.deleteOne({ _id: req.user._id });
    res.send(req.user)
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

module.exports = router;
