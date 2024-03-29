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
router.get('/getallaccountinfo', accessControl(2), getAllAccountInfoController);
router.get('/getrequests', accessControl(2), getRequestsController);
router.get('/getinfobrief/:limit', accessControl(2), getInfoBriefController);
router.get('/getallinfo/:collection', accessControl(2), getAllInfoController);
router.get('/getaccountinfo/:id', accessControl(2), getAccountInfoController);
router.get('/getadmins', accessControl(2), getAdminsController);
router.post('/createaccount', accessControl(2), createAccountController);
router.post('/addadmin', accessControl(1), addAdminController);
router.post('/deciderequest', accessControl(2), decideRequestController);
router.patch('/editaccount/:id', accessControl(2), editAccountController);
router.delete('/deleteaccount/:id', accessControl(1), deleteAccountController);
router.delete('/deleteadmin/:id', accessControl(1), deleteAdminController);
module.exports = router;