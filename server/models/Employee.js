const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    count: { type: Number, default: 0 },
    caretakerId: { type: String, required: false }  
})

const EmployeeModel = mongoose.model("employees", EmployeeSchema)
module.exports = EmployeeModel
