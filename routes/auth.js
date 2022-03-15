const router = require('express').Router();

router.post('/auth', (req, res) => {
  res.json({message: "Hey from Auth"})
})

module.exports = router;