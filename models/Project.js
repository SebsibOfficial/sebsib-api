const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surveysId: {
    type: [mongoose.Types.ObjectId],
    default: []
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

module.exports = mongoose.model('project', projectSchema);