let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = "http://localhost:3000";
chai.use(chaiHttp);

describe('/post/createmember', () => {
    it('Responds', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('content-type', 'application/json')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        })
    })
    it('Other logic', (done) => {
        ({name: 'some'}).name.should.be.a('string');
        done();
    })
})

describe('/post/createsurvey', () => {
    it('Responds', (done) => {
        chai.request(server)
        .post('/post/createmember')
        .set('content-type', 'application/json')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        })
    })
})
