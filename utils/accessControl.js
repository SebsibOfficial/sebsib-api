const authorizeRoleFor = require('./authorizeRoleFor');
const enums = require('./enums');

/* 

Middleware to check the access of the users in the system

TLDR;
accessControl(1) -> only SUPER_ADMIN
accessControl(2) -> only SUPER_ADMIN and ADMIN
accessControl(3) -> only SUPER_ADMIN, ADMIN and OWNER
accessControl(4) -> All users
*/


module.exports = accessControl = (level) => {
  // The reason for the `accessControl[level] || (accessControl[level]` is to stop memory leaks 
  // by stopping the creation of inner functions with out closure.
  return accessControl[level] || (accessControl[level] = async function(req, res, next) {
    const token = req.header('auth-token');
    switch (level) {
      case 1:
        await authorizeRoleFor(token, enums.ROLES.SUPER_ADMIN) ? 
        next() : 
        res.json({messsage: 'You don\'t have access'})
        break;
      case 2:
        await authorizeRoleFor(token, enums.ROLES.SUPER_ADMIN) || await authorizeRoleFor(token, enums.ROLES.ADMIN) ? 
        next() : 
        res.json({messsage: 'You don\'t have access'})
        break;
      case 3:
        await authorizeRoleFor(token, enums.ROLES.SUPER_ADMIN) || await authorizeRoleFor(token, enums.ROLES.ADMIN) || await authorizeRoleFor(token, enums.ROLES.OWNER) ? 
        next() : 
        res.json({messsage: 'You don\'t have access'})
        break;
      case 4:
        await authorizeRoleFor(token, enums.ROLES.SUPER_ADMIN) || await authorizeRoleFor(token, enums.ROLES.ADMIN) || await authorizeRoleFor(token, enums.ROLES.OWNER) || authorizeRoleFor(token, enums.ROLES.MEMBER)? 
        next() : 
        res.json({messsage: 'You don\'t have access'})
        break;
      default:
        res.json({messsage: 'You don\'t have access'})
        break;
    }
  })
}