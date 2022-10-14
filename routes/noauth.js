const router = require('express').Router();
const {  
  sendRequestController,
  resetPasswordController
} = require('../controllers');

router.post('/sendrequest/:type', sendRequestController)
router.patch('/resetpass', resetPasswordController);

module.exports = router;
