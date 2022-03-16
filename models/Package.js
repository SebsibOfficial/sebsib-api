const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projects: {
    type: Number,
    required: true,
  },
  surveys: {
    type: Number,
    required: true,
  },
  members: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('package', packageSchema)