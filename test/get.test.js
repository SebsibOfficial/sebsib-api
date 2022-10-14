let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = "http://localhost:3000";
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const {User, Request} = require('../models');
chai.use(chaiHttp);

describe("/get/orgstatus/:shortorgId", function () {
  // This executes before tests
  this.beforeAll('Giving Token for Tests', (done) => {
    chai.request(server)
    .post('/auth/login')
    .send({email: process.env.TEST_EMAIL, password: process.env.TEST_PASS})
    .end((err, res) => {
      res.should.have.status(200);
      token = res.body.token;
      done();
    })
  })
  // Has data
  it('Has required data', (done) => {
    chai.request(server)
    .get('/get/orgstatus/FRORSA65')
    .set('Authorization', token)
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })
})