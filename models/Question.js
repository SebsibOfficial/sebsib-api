const mongoose = require('mongoose');

const showIfSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  answerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  }
})

const langSchema = new mongoose.Schema({
  langId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
}, { _id : false })

const choiceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  text: [langSchema],
})

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  hasShowPattern: {
    type: Boolean,
    required: true
  },
  ptrnCount: {
    type: String,
    required: true
  },
  showIf: [showIfSchema],
  options: [choiceSchema],
  questionText: [langSchema],
  inputType: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  mandatory: {
    type: Boolean,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  exp_min: {
    type: Number,
    required: false
  },
  exp_max: {
    type: Number,
    required: false
  },
  number: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('question', questionSchema)
