const { default: mongoose } = require("mongoose")
const Mongoose = require("mongoose")

const userSchema = Mongoose.Schema(
    {
        name: {
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role: { type: String,
             default: "employee"
             },
    
    }
)

var userModel = Mongoose.model("users",userSchema)
module.exports=userModel