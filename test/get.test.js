let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = "http://localhost:3000";
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const {User, Request} = require('../models');
chai.use(chaiHttp);

describe("/noauth/orgstatus/:shortorgId", function () {
  // Has data
  it('Has required data', (done) => {
    chai.request(server)
    .get('/noauth/orgstatus/FRORSA65')
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })
})