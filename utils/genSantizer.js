
var xss = require('xss');

module.exports = function sanitizeAll (input) {
    if (typeof(input) === 'string') {
        var SInput = xss(input.replace(/[:{}";\s]/g, ' '));
        return SInput;
    } else return input;
}
