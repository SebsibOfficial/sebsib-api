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
        bcrypt.compare(password, user.password, async function(err, result) {
          if (result) {
            var orgId = await Organization.exists({owner: user._id});
            if (orgId != null) {
              const token = jwt.sign({_id: user._id, role: user.roleId, org: orgId._id}, process.env.TOKEN_SECRET);
              user.password = "*";
              res.status(200).json({token: token, user: user, orgId: orgId});
            } else res.status(401).json({message: "Wrong credentials"})
          } else res.status(401).json({message: "Wrong credentials"})
        });
      } else res.status(401).json({message: "Wrong credentials"})
    } catch (error) { console.log(error); res.status(500).send("Server Error") }
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
            const token = jwt.sign({_id: user._id, role: user.roleId, org: org_id}, process.env.TOKEN_SECRET);
            res.status(200).json({token: token});
          } else res.status(401).json({message: "Wrong credentials"})
        });
      } else res.status(401).json({message: "Wrong credentials"})
    } catch (error) { console.log(error); res.status(500).send("Server Error") }
  } else {
    res.status(400).json({message: "Bad Input"})
  }
})

module.exports = router;