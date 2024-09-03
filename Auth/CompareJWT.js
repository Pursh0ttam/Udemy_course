let jwt = require('jsonwebtoken')

let jwtAutherization=(token,secretKey)=>{
  return jwt.verify(token,secretKey)

}
module.exports=jwtAutherization