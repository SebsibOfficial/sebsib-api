const mongoose = require('mongoose');


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
<<<<<<< HEAD
/*  answer: {
    type: String,
    required: true,
  }*/
=======
>>>>>>> 9d4da854b6d8e52de389e4141af4c34402c02f2e
  answer: mongoose.SchemaTypes.Mixed
}, {strict: false})

const responseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  surveyId: {
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
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('response', responseSchema)
