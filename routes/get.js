const router = require('express').Router();
const { getMemberController, getMemberListController, getSurveyListController, getProjectListController, getRecentSurveyController, getSurveyController } = require('../controllers');

router.get('/memberlist/:projectId', getMemberListController);
router.get('/memberlist', getMemberListController);
router.get('/surveylist/:projectId', getSurveyListController);
router.get('/surveylist', getSurveyListController);
router.get('/projectlist/:orgId', getProjectListController);
router.get('/projectlist', getProjectListController);
router.get('/member/:id', getMemberController)
router.get('/recentsurveys/:orgId', getRecentSurveyController)
router.get('/survey/:id', getSurveyController)

module.exports = router;