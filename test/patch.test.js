let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = "http://localhost:3000";
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const {User, Request} = require('../models');
chai.use(chaiHttp);

describe('/patch/changepass', function () {
  let token = '';
    // Connect to DB before doing tests
    before('connect', function(){
      return mongoose.connect('mongodb://localhost/sebsib')
    })
    // This executes before every test
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
    // Change Pass
    it('changes the password', (done) => {
      chai.request(server)
      .patch('/patch/changepass')
      .set('Authorization', token)
      .send({initialpass: process.env.TEST_PASS, newpass:"DummyPass", confirmpass:"DummyPass"})
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
    })
    // Tear Down
    it('Tear Down', () => {
      this.timeout(0);
      var old_pass = "$2a$10$43pkR195.PgfQNpUnk4R9eYfYMl0FMt/F3L/Mid6aR3VpMyf//na.";
      // Update Owner Password
      User.findOneAndUpdate({email: process.env.TEST_EMAIL}, {
        password: old_pass,
      }).catch(err => {
        console.log(err)
      })
    })
  
})