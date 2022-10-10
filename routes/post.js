const router = require('express').Router();
const { 
  createMemberController, 
  createSurveyController, 
  createProjectController, 
  sendResponseController, 
  sendRequestController
} = require('../controllers');
const enums = require('../utils/enums');
const packageControl = require('../utils/packageControl');

router.post('/createmember', packageControl(enums.CHECK.MEMBER), createMemberController);
router.post('/createsurvey/:projectId', packageControl(enums.CHECK.SURVEY), createSurveyController);
router.post('/createproject', packageControl(enums.CHECK.PROJECT), createProjectController)
router.post('/sendresponse', sendResponseController)
router.post('/sendrequest', sendRequestController)

module.exports = router;
