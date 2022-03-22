const router = require('express').Router();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const {User, Organization} = require('../models');

router.post('/login', async (req, res) => {
  var {email, password} = req.body;
  if (email != undefined && password != undefined && validator.isEmail(email)) {
    try {
      const user = await User.findOne({email: email});
      if (user != null) {
        bcrypt.compare(password, user.password, function(err, result) {
          if (result) {
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
            res.status(200).json({token: token});
          } else res.status(401).json({message: "Wrong credentials"})
        });
      } else res.status(401).json({message: "Wrong credentials"})
    } catch (error) { res.status(500).send(error) }
  } else {
    res.status(400).json({message: "Bad Input"})
  }
})


router.post('/fillsettings', async (req, res) => {
  var {email, password, org} = req.body;
  try {
    var org_obj = await Organization.findOne({name: org});
    var org_id = org_obj._id;
  } catch (error) {
    return res.status(401).json({message: "Wrong credentials"});
  }
  if (email != undefined && password != undefined && validator.isEmail(email)) {
    try {
      const user = await User.findOne({email: email, organizationid: org_id});
      if (user != null) {
        bcrypt.compare(password, user.password, function(err, result) {
          if (result) {
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
            res.status(200).json({token: token});
          } else res.status(401).json({message: "Wrong credentials"})
        });
      } else res.status(401).json({message: "Wrong credentials"})
    } catch (error) { res.status(500).send(error) }
  } else {
    res.status(400).json({message: "Bad Input"})
  }
})

module.exports = router;