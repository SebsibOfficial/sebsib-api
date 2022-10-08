const router = require('express').Router();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { User, Organization } = require('../models');
const verifyPackage = require('../utils/verifyPackage');
const sanitizeAll = require('../utils/genSantizer');

router.post('/login', async (req, res) => {
  var { email, password } = req.body;
  email = sanitizeAll(email); password = sanitizeAll(password);
  if (email != undefined && password != undefined && validator.isEmail(email)) {
    try {
      const user = await User.findOne({ email: email });
      if (user != null) {
        bcrypt.compare(password, user.password, async function (err, result) {
          if (result) {
            var org = await Organization.findOne({ ownerId: user._id });
            if (org != null && user.roleId == '623cc24a8b7ab06011bd1e60') {
              const token = jwt.sign({ _id: user._id, role: user.roleId, org: org._id, org_name: org.name, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
              var package = await verifyPackage(token, '');
              if (package == 'expired') res.status(401).json({ message: "Package has Expired!" })
              user.password = "*";
              res.status(200).json({ token: token, user: user, orgId: org });
            } else res.status(401).json({ message: "Wrong credentials" })
          } else res.status(401).json({ message: "Wrong credentials" })
        });
      } else res.status(401).json({ message: "Wrong credentials" })
    } catch (error) { console.log(error); res.status(500).send("Server Error") }
  } else {
    res.status(400).json({ message: "Bad Input" })
  }
})


router.post('/fillsettings', async (req, res) => {
  var { email, password, org } = req.body;
  email = sanitizeAll(email); password = sanitizeAll(password); org = sanitizeAll(org);
  try {
    var org_obj = await Organization.findOne({ name: org });
    var org_id = org_obj._id;
  } catch (error) {
    return res.status(401).json({ message: "Wrong credentials" });
  }
  if (email != undefined && password != undefined && validator.isEmail(email)) {
    try {
      const user = await User.findOne({ email: email, organizationid: org_id });
      if (user != null) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            const token = jwt.sign({ _id: user._id, role: user.roleId, org: org_id, username: user.username }, process.env.TOKEN_SECRET);
            res.status(200).json({ token: token });
          } else res.status(401).json({ message: "Wrong credentials" })
        });
      } else res.status(401).json({ message: "Wrong credentials" })
    } catch (error) { console.log(error); res.status(500).send("Server Error") }
  } else {
    res.status(400).json({ message: "Bad Input" })
  }
})

router.post('/adminlogin', async (req, res) => {
  var { email, password } = req.body;
  email = sanitizeAll(email); password = sanitizeAll(password);
  if (email != undefined && password != undefined && validator.isEmail(email)) {
    try {
      const user = await User.findOne({ email: email });
      if (user != null) {
        bcrypt.compare(password, user.password, async function (err, result) {
          if (result) {
            var org = await Organization.findOne({ _id: user.organizationId });
            if (org != null && (user.roleId == '623cc24a8b7ab06011bd1e61' || user.roleId == '623cc24a8b7ab06011bd1e62')) {
              const token = jwt.sign({ _id: user._id, role: user.roleId, org: org._id, org_name: org.name, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
              user.password = "*";
              res.status(200).json({ token: token, user: user, orgId: org });
            } else res.status(401).json({ message: "Wrong credentials" })
          } else res.status(401).json({ message: "Wrong credentials" })
        });
      } else res.status(401).json({ message: "Wrong credentials" })
    } catch (error) { console.log(error); res.status(500).send("Server Error") }
  } else {
    res.status(400).json({ message: "Bad Input" })
  }
})

module.exports = router;
