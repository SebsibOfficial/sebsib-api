const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  answers: {
    type: [answerScheme],
    required: true
  },
  sentDate: {
    type: Date,
    required: true
  },
  enumratorId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
})

const answerScheme = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  inputType: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  questionId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  answer: {
    type: mongoose.Types.ObjectId | String | Number,
    required: true,
  }
})

module.exports = mongoose.model('response', responseSchema)