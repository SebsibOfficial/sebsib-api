const router = require('express').Router();
const {deleteMemberController, deleteProjectController, deleteSurveyController} = require('../controllers')
router.delete('/member/:id', deleteMemberController)
router.delete('/project/:id', deleteProjectController)
router.delete('/survey/:id', deleteSurveyController)

module.exports = router;