const jwt = require('jsonwebtoken');
const { Role } = require('../models');

module.exports = authorizeRoleFor = async (token, role) => {
  var userRoleId = jwt.verify(token, process.env.TOKEN_SECRET).role;
  try {
    const roleObj = await Role.findOne({name: role});
    if (userRoleId == roleObj._id)
      return true;
    else return false;
    //next();
    //else return res.status(401).json({message: "You don't have access: "+userRoleId});
  } catch (error) {
    console.log(error);
  }    
}