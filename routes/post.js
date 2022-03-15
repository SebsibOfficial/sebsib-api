const router = require('express').Router();
const { createMemberController, createSurveyController} = require('../controllers');

router.post('/createmember', createMemberController);
router.post('/createsurvey', createSurveyController);

module.exports = router;