let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = "http://localhost:3000";
const {User} = require('../models');
chai.use(chaiHttp);

describe('/post/createmember', function () {
    let token = '';
    // This executes before every test
    this.beforeEach('Giving Token for Tests', (done) => {
        chai.request(server)
        .post('/auth/login')
        .send({email: process.env.TEST_EMAIL, password: process.env.TEST_PASS})
        .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            done();
        })
    })

    it('Responds', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .end((err, res) => {
            res.should.not.have.status(500);
            done();
        })
    })
    
    it('Discards the wrong Token', (done) => {
        var wr_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        chai.request(server)
            .post('/post/createmember')
            .set('Authorization', wr_token)
            .send({})
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('message', 'Invalid Token')
                done()
        })
    })

    it('Discards the request, If required fields not met', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('Authorization', token)
        .send({})
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.have.property('message', 'Bad Input')
            done()
        })
    })

    it('Discards short passwords', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('Authorization', token)
        .send({email: 'bogusemail', password: '1212', projectsId: []})
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.have.property('message', 'Password too short')
            done()
        })
    })

    it('Discards invalid email', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('Authorization', token)
        .send({email: 'bogusemail', password: '1212222222', projectsId: []})
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.have.property('message', 'Invalid Email')
            done()
        })
    })

    it('Checks for duplicate email', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('Authorization', token)
        .send({email: 'samplemember@sebsib.com', password: '1212222222', projectsId: []})
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.have.property('message', 'Email Exists')
            done()
        })
    })

    it('Discards if projectId is not found', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('Authorization', token)
        .send({email: 'member_that@doesnt.exist', password: '1212222222', projectsId: ['6cb59d0b3257e8ba4a251053']})
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.have.property('message', 'Project doesn\'t Exist')
            done()
        })
    })

    it('Add member to DB', async () => {
        chai.request(server)
        .post('/post/createmember')
        .set('Authorization', token)
        .send({email: 'newmember@to.add', password: '12345678', projectsId: [], firstname: 'NewTest', lastname: 'member', phone: '0912345678'})
        .end(async (err, res) => {
            res.should.have.status(200)
            res.body.should.have.lengthOf(1)
            res.body[0].should.have.property('email', 'newmember@to.add')
            res.body[0].should.have.property('password', '*')
            res.body[0].should.have.property('firstName', 'NewTest')
            res.body[0].should.have.property('lastName', 'member')
            res.body[0].should.have.property('phone', '0912345678')
            done()
        })
    })

    after((done) => {
        User.findOneAndDelete({'email':'newmember@to.add'})
        done()
    })
})

describe('/post/createsurvey', () => {
    it('Responds', (done) => {
        chai.request(server)
        .post('/post/createsurvey')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        })
    })
    // Check for missing pieces
    // Check for duplicate survey names
    // Adds into DB
    // Adds the question in the DB
    // Inserts the question Ids in the Survey
    // Inserts the survey Id in the Project
    // Responds with correct Data
    // Removes Survey, questions (TearDown)
})
