const router = require('express').Router();
const { createMemberController, createSurveyController, createProjectController, sendResponseController} = require('../controllers');
const packageControl = require('../utils/packageControl');

router.post('/createmember', packageControl('survey'), createMemberController);
router.post('/createsurvey', createSurveyController);
router.post('/createproject', createProjectController)
router.post('/sendresponse', sendResponseController)

module.exports = router;