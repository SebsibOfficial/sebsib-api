const router = require('express').Router();
const { 
  editSettingsController, 
  editMemberController, 
  addMemberController, 
  removeMemberController, 
  changePasswordController,
  resetPasswordController
} = require('../controllers');

router.patch('/editsettings/:orgId', editSettingsController);
router.patch('/editmember/:id', editMemberController)
router.patch('/addmembers/:pid', addMemberController);
router.patch('/removemember/:pid/:id', removeMemberController);
router.patch('/changepass', changePasswordController);
router.patch('/resetpass', resetPasswordController);

module.exports = router;