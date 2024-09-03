const validator = require('validator');
const mongoose = require('mongoose');
const { Schema, model } = require("mongoose")
let UserSchema = new Schema({
    sname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true

    },
    Email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value) {
            try {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('passowrd string should not set as password')
                }

                if (!validator.isStrongPassword(value))
                    console.log("password error");

            } catch (error) {
                console.log(error);
            }
        }
    },
    mobile_num: {
        type: Number,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isNumeric(value.toString())) {
                throw new Error('mobile ')
            }
        }
    },
    complete:{
        type:Boolean,
        required:true
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        validate(value) {
            if (value < 0) {
                console.log("age must be positive");
                throw new error('age is not valid')
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{timestamps:true})

//to hide data sending to user

// UserSchema.methods.toJSON = function () {
//     const userObject = this.toObject(); 
//     delete userObject.password;
//     delete userObject.tokens;
  
//     return userObject;
//   };





module.exports = UserSchema