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
  }
})

module.exports = mongoose.model('survey', surveySchema);