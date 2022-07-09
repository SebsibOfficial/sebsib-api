const CryptoJS = require('crypto-js');
const enums = require('./enums');
// Middleware to check auth headers
// Checks the Platform ID and Ip whitelist from .env
// The Authorization header must include the AES-256 encryption of a stringified object with the form of 
// {"PLATFORM_ID" : string, "JWT" : string [optional]}
module.exports = authorizeKey = (req, res, next) => {
  const auth = req.get('Authorization') ?? 'U2FsdGVkX1+bD+9s4KlUZ6OaOAJX95CtYtyHs7XLZyasvrkeUmVBB3YvhfFbGtdf';
  const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').pop();
  // Decrypt
  var bytes  = CryptoJS.AES.decrypt(auth, process.env.PRIVATE_KEY);
  try {
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    var auth_object = JSON.parse(originalText);
    if (!enums.PLATFORMS.includes(auth_object.PLATFORM_ID) || !JSON.parse(process.env.IP_WHITELIST).includes(ip)){
      return res.status(401).json({message: "Access Denied"});
    }
  } catch (error) {
    return res.status(403).json({message: "Access Denied"});
  } 
  next();
}
// {
//   "PLATFORM_ID":"SEBSIB_OFFICE_1",
//   "JWT":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
// }

  // var ciphertext = CryptoJS.AES.encrypt('{"PLATFORM_ID":"SEBSIB_OFFICE_1"}', process.env.PRIVATE_KEY).toString();
//U2FsdGVkX18bcH7i83u+KR/08rTGm7SERWaiZqDX6oBMy1lAJkZTGWvj1H9oWbaS4afTYV+hWSSgwX+NzzIq+cZ3efELDJA/TETOkhu9N5Mhi3xqrdOI5PJ0zT5Ltu5uR6I47DEeh3owFpzeEw0MhzdpKnzna8vepKf1XrJ9qXwPvqL680fI5HRSNFCAMP17uwdM0WSHh+/xK26sJSqVNZ6QX2JoxZBwGwWWe+TMWT/XtALHLiBWxlJBTX1l31aEQZRqqQIcZIHgF+o8JgozB4iE+RLkE2q+O2szcujwC/M=