const router = require('express').Router();
const { editSettingsController, editMemberController } = require('../controllers');

router.patch('/editsettings', editSettingsController);
router.patch('/editmember/:id', editMemberController)

module.exports = router;