const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  orgName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  transactionNo: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    required: true
  },
  responseDate: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Request', requestSchema);