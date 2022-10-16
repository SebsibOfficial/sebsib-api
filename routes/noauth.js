const router = require('express').Router();
const {  
  sendRequestController,
  resetPasswordController,
  getOrgStatusController
} = require('../controllers');

router.post('/sendrequest/:type', sendRequestController)
router.patch('/resetpass', resetPasswordController);
router.get('/orgstatus/:shortorgId', getOrgStatusController);

module.exports = router;
