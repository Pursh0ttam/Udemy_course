let {genSalt,hash} = require('bcryptjs')
require("dotenv").config()

let encryptionFun=async(password)=>{
    let salt = await genSalt(Number(process.env.salt_length));
    // console.log(salt);
    return await hash(password,salt);

}
module.exports=encryptionFun