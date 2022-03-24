const router = require('express').Router();
const { getMemberController, getMemberListController, getSurveyListController, getProjectListController, getRecentSurveyController, getSurveyController } = require('../controllers');
const accessControl = require('../utils/accessControl');

router.get('/memberlist/:orgId', accessControl(4) ,getMemberListController);
router.get('/surveylist/:projectId', accessControl(4) , getSurveyListController);
router.get('/projectlist/:orgId', accessControl(4) , getProjectListController);
router.get('/member/:id', accessControl(4) , getMemberController)
router.get('/recentsurveys/:orgId', accessControl(4) , getRecentSurveyController)
router.get('/survey/:id', accessControl(4) , getSurveyController)

module.exports = router;