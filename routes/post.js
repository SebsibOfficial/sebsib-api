const router = require('express').Router();
const { createMemberController, createSurveyController, createProjectController, sendResponseController} = require('../controllers');
const enums = require('../utils/enums');
const packageControl = require('../utils/packageControl');

router.post('/createmember', packageControl(enums.CHECK.MEMBER), createMemberController);
router.post('/createsurvey/:projectId', packageControl(enums.CHECK.MEMBER), createSurveyController);
router.post('/createproject', packageControl(enums.CHECK.PROJECT), createProjectController)
router.post('/sendresponse', packageControl(enums.CHECK.PROJECT), sendResponseController)

module.exports = router;