const router = require('express').Router();
const {deleteMemberController, deleteProjectController, deleteSurveyController} = require('../controllers');
const accessControl = require('../utils/accessControl');

router.delete('/member/:id', accessControl(3), deleteMemberController)
router.delete('/project/:id', accessControl(3), deleteProjectController)
router.delete('/survey/:pid/:sid',accessControl(3), deleteSurveyController)

module.exports = router;