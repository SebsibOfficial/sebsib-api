const router = require('express').Router();
const accessControl = require('../utils/accessControl');
const { 
  editSettingsController, 
  editMemberController, 
  addMemberController, 
  removeMemberController, 
  changePasswordController
} = require('../controllers');

router.patch('/editsettings/:orgId', accessControl(3), editSettingsController);
router.patch('/editmember/:id',accessControl(3), editMemberController)
router.patch('/addmembers/:pid',accessControl(4), addMemberController);
router.patch('/removemember/:pid/:id',accessControl(4), removeMemberController);
router.patch('/changepass',accessControl(3), changePasswordController);

module.exports = router;