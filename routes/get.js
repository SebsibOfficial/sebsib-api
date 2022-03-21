const router = require('express').Router();
const authorizeToken = require('../utils/authorizeToken');
const { getMemberController, getMemberListController, getSurveyListController, getProjectListController, getRecentSurveyController, getSurveyController } = require('../controllers');

router.get('/memberlist', authorizeToken, getMemberListController);
router.get('/surveylist', getSurveyListController);
router.get('/projectlist', getProjectListController);
router.get('/member/:id', getMemberController)
router.get('/recentsurveys', getRecentSurveyController)
router.get('/survey/:id', getSurveyController)

module.exports = router;