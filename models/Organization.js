const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  orgId: {
    type: String,
    required: true
  },
  hasPassChange: {
    type: Boolean,
    required: true
  },
  packageId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  projectsId: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: '',
  },
  expires: {
    type: Date,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('organization', orgSchema);