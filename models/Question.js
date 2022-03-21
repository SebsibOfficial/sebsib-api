const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  answerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  responseId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
})

const choiceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: true
  },
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
  showIf: showSchema,
  options: choiceSchema,
  questionText: {
    type: String,
    required: true
  },
  inputType: {
    type: mongoose.Types.ObjectId,
    required: true,
  }
})

module.exports = mongoose.model('question', questionSchema)