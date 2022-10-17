const { json } = require('body-parser');
const { Request, Organization, User } = require('../models');
const enums = require('../utils/enums');
const sanitizeAll = require('../utils/genSantizer');
const translateIds = require('../utils/translateIds');
const ObjectId = require('mongoose').Types.ObjectId;
const getToken = require('../utils/getToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

const sendRequestController = async (req, res, next) => {
  var type = sanitizeAll(req.params.type);

  try {
    if (type == 'REGISTER') {
      // Get body
      var {pkg, firstname, lastname, email, phone, orgname, bank, transno, subType} = req.body
      var RGreqObj = {pkg, firstname, lastname, email, phone, orgname, bank, transno, subType}
      // Santize
      for (var key in RGreqObj) {
        RGreqObj[key] = sanitizeAll(RGreqObj[key])
      }
      // Check values
      for (var key in RGreqObj) {
        if ((RGreqObj[key] == null || RGreqObj[key] == "") && key != 'bank' && key != 'transno' && key != 'subType'){
          return res.status(403).json({message:'Feilds missing'});
        }
      }
      if (![enums.PACKAGES.FREE_TRIAL, enums.PACKAGES.STANDARD].includes(RGreqObj.pkg)) {
        return res.status(403).json({message:'Package not found'});
      }
      // Check bank details
      if (RGreqObj.pkg != enums.PACKAGES.FREE_TRIAL && (RGreqObj.bank == null || RGreqObj.transno == null )) 
        return res.status(403).json({message:'Bank details missing'});
      // Add to DB
      var result = await Request.insertMany([{
        _id: new ObjectId(),
        firstName: RGreqObj.firstname,
        lastName: RGreqObj.lastname,
        phone: RGreqObj.phone,
        orgName: RGreqObj.orgname,
        email: RGreqObj.email,
        type: "REGISTER",
        packageId: translateIds('name', RGreqObj.pkg),
        subType: RGreqObj.subType ?? '',
        bank: RGreqObj.bank ?? '',
        transactionNo: RGreqObj.transno ?? '',
        requestDate: new Date(),
      }])

      return res.status(200).json(result[0])
    }
    else if (type == 'RENEWAL') {
      // Get body
      var {pkg, firstname, lastname, email, phone, orgname, bank, transno, orgId, subType} = req.body
      var RNreqObj = {pkg, firstname, lastname, email, phone, orgname, bank, transno, orgId, subType}
      // Santize
      for (var key in RNreqObj) {
        RNreqObj[key] = sanitizeAll(RNreqObj[key])
      }
      // Check values
      for (var key in RNreqObj) {
        if ((RNreqObj[key] == null || RNreqObj[key] == ""))
          return res.status(403).json({message:'Feilds missing'});
      }
      // Check for packages
      if (![enums.PACKAGES.STANDARD].includes(RNreqObj.pkg)) {
        return res.status(403).json({message:'Package not found'});
      }
      // Check for orgId
      var ren_org = await Organization.findOne({orgId: orgId});
      if (ren_org == null)
        return res.status(403).json({message:'Org not found'});
      // Add to DB
      var result = await Request.insertMany([{
        _id: new ObjectId(),
        firstName: RNreqObj.firstname,
        lastName: RNreqObj.lastname,
        phone: RNreqObj.phone,
        orgName: RNreqObj.orgname,
        email: RNreqObj.email,
        type: "RENEWAL",
        packageId: translateIds('name', RNreqObj.pkg),
        subType: subType,
        bank: RNreqObj.bank,
        transactionNo: RNreqObj.transno,
        requestDate: new Date(),
      }])

      return res.status(200).json(result[0])
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Server Error'})
  }
  
}

const getOrgStatusController = async (req, res, next) => {
  var shortOrgId = sanitizeAll(req.params.shortorgId);
  try {
    const org = await Organization.aggregate([
      {
        "$match": {
          "orgId": shortOrgId
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "ownerId",
          "foreignField": "_id",
          "as": "owner"
        }
      }
    ])

    if (org.length != 0) {
      org[0].owner[0].password = '*'
      return res.status(200).json(org[0])
    }
    else 
      return res.status(403).json({message:'ORGID not found'})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Server Error'})
  }
}

const changePasswordController = async (req, res, next) => {
  // Get body
  var {initialpass, newpass, confirmpass} = req.body;
  // Check input
  if (newpass == null || confirmpass == null) return res.status(403).json({message: "Feilds missing"})
  try {
    // Get Token
    var userId = jwt.verify(getToken(req.header('Authorization')), process.env.TOKEN_SECRET)._id;
    var orgId = jwt.verify(getToken(req.header('Authorization')), process.env.TOKEN_SECRET).org;
    // Get user details
    const user = await User.findOne({ _id: userId });
    if (user != null && user.roleId == '623cc24a8b7ab06011bd1e60') {
      if (initialpass == null) {
        // Check password confirmation
        if (newpass === confirmpass) {
          // Encrypt password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(newpass, salt);
          // Update Owner Password
          await User.findOneAndUpdate({_id: userId}, {
            password: hash,
          })
          // Update Org haspasschanged
          await Organization.findOneAndUpdate({ _id: orgId}, {
            hasPassChange: true
          })
          return res.status(200).json({message: 'Completed'})
        }
        else return res.status(403).json({message: "Input Mismatch"})
      }
      // Check old pass
      bcrypt.compare(initialpass, user.password, async function (err, result) {
        if (result) {
          // Check password confirmation
          if (newpass === confirmpass) {
            // Encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newpass, salt);
            // Update Owner Password
            await User.findOneAndUpdate({_id: userId}, {
              password: hash,
            })
            // Update Org haspasschanged
            await Organization.findOneAndUpdate({ _id: orgId}, {
              hasPassChange: true
            })
            return res.status(200).json({message: 'Completed'})
          }
          else return res.status(403).json({message: "Input Mismatch"})
        }
        else return res.status(401).json({message: "Wrong Credentials"})
      })
    }
    else return res.status(401).json({message: "Wrong Credentials"})  
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Server Error'})
  }
}

const resetPasswordController = async (req, res, next) => {
  // Get body
  var {email, shortOrgId} = req.body;
  email = sanitizeAll(email); shortOrgId = sanitizeAll(shortOrgId);
  // Check input
  if (email == null || shortOrgId == null) return res.status(403).json({message: "Feilds missing"})
  // Get User
  const user = await User.findOne({email: email})
  if (user != null && user.roleId == '623cc24a8b7ab06011bd1e60') {
    // Get Org
    const org = await Organization.findOne({orgId: shortOrgId})
    if (org != null) {
      // Generate Password
      const _unique8DigitVal = Math.floor(Math
      .random() * (99999999 - 10000000 + 1)) + 10000000;
      // Send to user
      var data = {
        service_id: process.env.SERVICE_ID,
        template_id: "template_4iixwcb",
        user_id: process.env.USER_ID,
        template_params: {to_name: user.firstName, request_date: new Date().toDateString().slice(0,19), password: _unique8DigitVal, to_email: user.email},
      };

      if (process.env.NODE_ENV == 'test'){
        // Set password
          // Encrypt password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(_unique8DigitVal.toString(), salt);
          // Update Owner Password
          await User.findOneAndUpdate({_id: user._id}, {
            password: hash,
          })
        // Set haspasschange to false
        await Organization.findOneAndUpdate({orgId: shortOrgId}, {
          hasPassChange: false
        })
        return res.status(200).json({message: 'Completed'})
      } else {
        // If .env is DEV or PROD
        var resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        });

        if (resp.status == 200) {
          // Set password
            // Encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(_unique8DigitVal.toString(), salt);
            // Update Owner Password
            await User.findOneAndUpdate({_id: user._id}, {
              password: hash,
            })
          // Set haspasschange to false
          await Organization.findOneAndUpdate({orgId: shortOrgId}, {
            hasPassChange: false
          })
          return res.status(200).json({message: 'Completed'})
        }
        else {
          return res.status(500).json({message: resp.body})}
      }
    }
    else return res.status(401).json({message: 'Wrong Credentials'})
  }
  else return res.status(401).json({message: 'Wrong Credentials'})
}

module.exports = {
  sendRequestController,
  getOrgStatusController,
  changePasswordController,
  resetPasswordController
}