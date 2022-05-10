const { Organization, User } = require("../models");
const jwt = require('jsonwebtoken');
const validator = require("validator");
const bcrypt = require('bcrypt');

const editSettingsController = async (req, res) => {
  var orgId = req.params.orgId;
  var userID = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET)._id;
  var {name, email, Opassword, Npassword} = req.body;
  try {
    var user = await User.findById(userID);

    // Check if string is an email
    if (!validator.isEmail(email)) {
      return res.status(400).json({message: 'Invalid Email'});
    }
    // Check if username exists
    if (await Organization.exists({name: name, _id: { $ne: orgId}}) || await User.exists({email: email, _id: { $ne: userID}})) {
      return res.status(400).json({message: 'Name or Email Exists'});
    }

    if (Opassword == '') {
      // Edit Organization
      var ro = await Organization.updateOne({_id: orgId},{
        name: name,
      });
      // Edit the Owner
      var ru = await User.updateOne({_id: userID},{
        email: email,
      });
      // Generate new token
      const token = jwt.sign({_id: user._id, role: user.roleId, org: orgId, org_name: name, email: email}, process.env.TOKEN_SECRET, {expiresIn: '1d'});
      res.status(200).send({token: token, orgId: orgId});
    } else {
      // Check if last password is okay
      bcrypt.compare(Opassword, user.password, async function(err, result) {
        if (result) {
          // Encrypt password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(Npassword, salt);
          // Edit Organization
          var ro = await Organization.updateOne({_id: orgId},{
            name: name,
          });
          // Edit the Owner
          var ru = await User.updateOne({_id: userID},{
            email: email,
            password: hash,
          });
          // Generate new token
          const token = jwt.sign({_id: user._id, role: user.roleId, org: orgId, org_name: name, email: email}, process.env.TOKEN_SECRET, {expiresIn: '1d'});
          res.status(200).send({token: token, orgId: orgId});
        } else res.status(401).json({message: "Wrong password"})
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  editSettingsController
}