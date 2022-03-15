const router = require('express').Router();
const { editSettingsController } = require('../controllers');

router.patch('/editsettings', editSettingsController);

module.exports = router;