const router = require('express').Router();
const { editSettingsController, editMemberController, addMemberController, removeMemberController } = require('../controllers');

router.patch('/editsettings/:orgId', editSettingsController);
router.patch('/editmember/:id', editMemberController)
router.patch('/addmember/:pid/:id', addMemberController);
router.patch('/removemember/:pid/:id', removeMemberController);

module.exports = router;