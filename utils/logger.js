const fs = require('fs');
const path = require('path');

module.exports = log = fs.createWriteStream(
  path.join(__dirname, "..", "logs", "api.log"), { flags: "a" }
);
