const router = require('express').Router();
const { createMemberController, createSurveyController, createProjectController, sendResponseController} = require('../controllers');

router.post('/createmember', createMemberController);
router.post('/createsurvey', createSurveyController);
router.post('/createproject', createProjectController)
router.post('/sendresponse', sendResponseController)

module.exports = router;