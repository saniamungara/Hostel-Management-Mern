const mongoose = require('mongoose')
const CaretakerSchema = new mongoose.Schema({
    ctId: String,
    password: String
})

const CaretakerModel = mongoose.model("caretakers", CaretakerSchema)
module.exports = CaretakerModel