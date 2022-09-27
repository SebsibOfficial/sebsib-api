const jwt = require('jsonwebtoken');
const server = "http://localhost:3000";
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('/auth/login', () => {
    var token = '';
    it('Authenticates proper', (done) => {
        chai.request(server)
        .post('/auth/login')
        .send({email: process.env.TEST_EMAIL, password: process.env.TEST_PASS})
        .end((err, res) => {
            res.should.have.status(200);
            token = res.body.token;
            done();
        })
    })
    it('Rejects wrong credentials', (done) => {
        chai.request(server)
        .post('/auth/login')
        .send({email: 'incorrect@email.com', password: 'asdas8'})
        .end((err, res) => {
            res.should.have.status(401);
            done();
        })
    })
    it('Gave a token', (done) => {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        verified.should.have.property('_id')
        verified.should.have.property('org')
        verified.should.have.property('role')
        verified.should.have.property('email')
        verified.should.have.property('org_name')
        done();
    })
})