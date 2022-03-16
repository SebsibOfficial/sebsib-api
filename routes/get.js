const router = require('express').Router();
const { getMemberController, getMemberListController, getSurveyListController, getProjectListController, getRecentSurveyController, getSurveyController } = require('../controllers');

router.get('/memberlist', getMemberListController);
router.get('/surveylist', getSurveyListController);
router.get('/projectlist', getProjectListController);
router.get('/member/:id', getMemberController)
router.get('/recentsurveys', getRecentSurveyController)
router.get('/survey/:id', getSurveyController)

module.exports = router;