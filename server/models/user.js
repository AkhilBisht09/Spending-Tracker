const mongoose=require('mongoose');
const validator=require('validator');
var userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
        validator:(value)=>{
            return validator.isEmail(value);
        },
        message:'{value} is not valid email'
        }
    },
    phone:{
        type:String,
        required:true,
        minlength:10,
        trim:true,
        unique:true,
        validate:{
        validator:(value)=>{
            return validator.isMobilePhone(value);
        },
        message:'{value} is not valid phone number'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
});

var User=mongoose.model("User",userSchema);
module.exports={User};