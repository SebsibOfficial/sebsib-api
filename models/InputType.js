const mongoose = require('mongoose')

const inputTypeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  inputType: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('input-type', inputTypeSchema)