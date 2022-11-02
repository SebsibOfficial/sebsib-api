const router = require('express').Router();
const { 
  createMemberController, 
  createSurveyController, 
  createProjectController, 
  sendResponseController, 
} = require('../controllers');
const enums = require('../utils/enums');
const packageControl = require('../utils/packageControl');
const accessControl = require('../utils/accessControl');

router.post('/createmember', accessControl(4), packageControl(enums.CHECK.MEMBER), createMemberController);
router.post('/createsurvey/:projectId', accessControl(4), packageControl(enums.CHECK.SURVEY), createSurveyController);
router.post('/createproject', accessControl(4), packageControl(enums.CHECK.PROJECT), createProjectController)
router.post('/sendresponse', sendResponseController)

module.exports = router;
