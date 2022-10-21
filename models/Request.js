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
  orgId: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  packageId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    default: 'PENDING',
  },
  bank: {
    type: String,
    default: '',
  },
  transactionNo: {
    type: String,
    default: '',
  },
  subType: {
    type: String,
    default: ''
  },
  requestDate: {
    type: Date,
    required: true
  },
  responseDate: {
    type: Date,
    required: false
  }
})

module.exports = mongoose.model('Request', requestSchema);