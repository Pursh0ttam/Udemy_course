let {compare} = require('bcryptjs')

let decryptFun=async(password,hashpassword)=>{
// console.log(password,hashpassword);
    return await compare(password,hashpassword)
}

module.exports = decryptFun