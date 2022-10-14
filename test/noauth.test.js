let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = "http://localhost:3000";
const mongoose = require('mongoose');
const {User, Request, Organization} = require('../models');
chai.use(chaiHttp);

describe('/noauth/sendrequest', function () {
  // Connect to DB before doing tests
  before('connect', function(){
    return mongoose.connect('mongodb://localhost/sebsib')
  })

  it('Sends proper register request', (done) => {
    chai.request(server)
    .post('/noauth/sendrequest/REGISTER')
    .send({
      "pkg": "FREE TRAIL",
      "firstname": "firsttest",
      "lastname": "lasttest",
      "email": "testemail",
      "phone": "0912345678",
      "orgname": "testorgan"
    })
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })

  // Send renew request properly to Database
  it('Send proper renew request', () => {
    chai.request(server)
    .post('/noauth/sendrequest/RENEW')
    .send({
      "pkg": "STANDARD",
      "firstname": "firsttest",
      "lastname": "lasttest",
      "email": "testemail",
      "phone": "0912345678",
      "orgname": "testorgan",
      "bank": "DASHEN",
      "transno": "987IUYJHG3WEDT",
      "orgId": "FRORSA65"
    })
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })

  it('Tear Down', () => {
    this.timeout(0);
    Request.deleteMany({email: 'testemail'}).catch((err) => {
      console.log(err)
    })
  })
})

describe('/noauth/resetpassword', function () {
  var old_pass = "$2a$10$43pkR195.PgfQNpUnk4R9eYfYMl0FMt/F3L/Mid6aR3VpMyf//na.";
  // Connect to DB before doing tests
  before('connect', function(){
    return mongoose.connect('mongodb://localhost/sebsib')
  })
  // Reset changes the password
  it('reset password', (done) => {
    chai.request(server)
    .patch('/noauth/resetpass')
    .send({email: process.env.TEST_EMAIL, shortOrgId: 'FRORSA65'})
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })
  // Clean up
  it('Tear down', () => {
    this.timeout(0);
    // Update Owner Password
    User.findOneAndUpdate({email: process.env.TEST_EMAIL}, {
      password: old_pass,
    }).catch(err => {
      console.log(err)
    })
    // Revert
    Organization.findOneAndUpdate({orgId: 'FRORSA65'}, {
      hasPassChange: true
    }).catch(err => {
      console.log(err)
    })
  })
})