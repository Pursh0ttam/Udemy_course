// const mongoose = require('mongoose');

// let connectDB = async()=>{    
//     try{

//         await mongoose.connect('mongodb://localhost:27017/Products',{useNewUrlParser:true,useUnifiedTopology: true})
//         console.log('connection successful');
//     }
//     catch(error){
//         console.log(error);
//     }
// }
// connectDB()



let jwt = require('jsonwebtoken')

let token = jwt.sign({_id:"abc123"},"helloworld",{expiresIn:" seconds"})
setTimeout(()=>{
    let data = jwt.verify(token,"helloworld")
    console.log(data);  
},3000)
console.log(token);
// let stu ={
//     sname:"viky",
//     age:{
//         school:"kv"
//     }
// }
// stu.age.school="dps"

// console.log(stu);