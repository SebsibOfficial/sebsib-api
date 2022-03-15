const router = require('express').Router();
const { getMemberListController, getSurveyListController, getProjectListController } = require('../controllers');

router.get('/memberlist', getMemberListController);
router.get('/surveylist', getSurveyListController);
router.get('/projectlist', getProjectListController);

module.exports = router;