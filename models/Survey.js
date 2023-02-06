const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  shortSurveyId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  responses: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  pic: {
    type: String,
    default: ''
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('survey', surveySchema);