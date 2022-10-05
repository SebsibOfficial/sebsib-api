const router = require('express').Router();

const { getDashStatController, getAllAccountInfoController,
  getRequestsController,
  getInfoBriefController,
  getAllInfoController,
  getAccountInfoController,
  getAdminsController,
  createAccountController,
  addAdminController,
  decideRequestController,
  editAccountController,
  deleteAccountController,
  deleteAdminController, } = require('../controllers');

const accessControl = require('../utils/accessControl');

router.get('/getDashStat', accessControl(4), getDashStatController);


module.exports = router;