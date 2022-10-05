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

router.get('/getdashstat', accessControl(2), getDashStatController);
router.get('/getallaccountanfo', accessControl(2), getAllAccountInfoController);
router.get('/getrequests', accessControl(2), getRequestsController);
router.get('/getinfobrief/:limit', accessControl(2), getInfoBriefController);

module.exports = router;