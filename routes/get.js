const router = require('express').Router();
const {
  getMemberController,
  getMemberListController,
  getSurveyListController,
  getRegularSurveyController,
  getProjectListController,
  getRecentResponseController,
  getSurveyController,
  getResponsesController,
} = require('../controllers');
const accessControl = require('../utils/accessControl');

router.get('/memberlist/:orgId', accessControl(5), getMemberListController);
router.get('/surveylist/:projectId', accessControl(5), getSurveyListController);
router.get('/projectlist/:orgId', accessControl(5), getProjectListController);
router.get('/member/:id', accessControl(5), getMemberController)
router.get('/recentresponse/:orgId', accessControl(5), getRecentResponseController)
router.get('/survey/:id', accessControl(5), getSurveyController)
router.get('/regularSurvey/:id', accessControl(5), getRegularSurveyController)
router.get('/responselist/:surveyId', getResponsesController);

module.exports = router;