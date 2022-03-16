const router = require('express').Router();

router.post('/authorize', (req, res) => {
  res.json({message: "Hey from Auth"})
})

router.post('/fillsettings', (req, res) => {
  res.json({message: "Hey from fill settings"})
})
module.exports = router;