const Mongoose = require("mongoose");

const attendenceSchema = Mongoose.Schema({
    userId: {
         type: Mongoose.Schema.Types.ObjectId,
          ref: "users" 
        },
    checkInTime: {
         type: Date 
        },
    checkOutTime: { 
        type: Date 
    },
    status: {
         type: String, enum: ["checked-in", "checked-out"],
         default: "checked-out" 
        }
})

var attendenceModel = Mongoose.model("attendence", attendenceSchema)
module.exports = attendenceModel
