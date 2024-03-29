const router = require('express').Router();
const {
  createMemberController,
  createSurveyController,
  createOnlineSurveyController,
  createProjectController,
  sendResponseController,
  syncSurveysController
} = require('../controllers');
const enums = require('../utils/enums');
const packageControl = require('../utils/packageControl');
const accessControl = require('../utils/accessControl');

router.post('/createmember', accessControl(4), packageControl(enums.CHECK.MEMBER), createMemberController);
router.post('/createsurvey/:projectId', accessControl(4), packageControl(enums.CHECK.SURVEY), createSurveyController);
router.post('/createonlinesurvey/:projectId', accessControl(4), packageControl(enums.CHECK.SURVEY), createOnlineSurveyController);
router.post('/createproject', accessControl(4), packageControl(enums.CHECK.PROJECT), createProjectController)
router.post('/sendresponse', sendResponseController)
router.post('/syncsurveys', accessControl(5), syncSurveysController);
module.exports = router;
