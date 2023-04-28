const router = require('express').Router();
const {
  getMemberController,
  getMemberListController,
  getSurveyListFromProjectIdController,
  getSurveyListFromOrgIdController,
  getRegularSurveyController,
  getProjectListController,
  getRecentResponseController,
  getSurveyController,
  getResponsesController,
  getSurveyQuestionsController,
  getSurveyListFromUserIdController,
  getStandardSurveyListFromProjectIdController
} = require('../controllers');
const accessControl = require('../utils/accessControl');

router.get('/memberlist/:orgId', accessControl(5), getMemberListController);
router.get('/surveylist/project/:projectId', accessControl(5), getSurveyListFromProjectIdController);
router.get('/standardsurveylist/project/:projectId', accessControl(5), getStandardSurveyListFromProjectIdController);
router.get('/surveylist/organization/:orgId', accessControl(5), getSurveyListFromOrgIdController);
router.get('/surveylist/user/:userId', accessControl(6), getSurveyListFromUserIdController);
router.get('/projectlist/:orgId', accessControl(5), getProjectListController);
router.get('/member/:id', accessControl(5), getMemberController)
router.get('/recentresponse/:orgId', accessControl(5), getRecentResponseController)
router.get('/survey/:id', accessControl(6), getSurveyController)
router.get('/surveyquestions/:id', accessControl(5), getSurveyQuestionsController)
router.get('/regularSurvey/:id', accessControl(5), getRegularSurveyController)
router.get('/responselist/:surveyId', getResponsesController);

module.exports = router;