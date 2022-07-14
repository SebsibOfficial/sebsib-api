const CryptoJS = require('crypto-js');

module.exports = getToken = (auth) => {
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(auth, process.env.PRIVATE_KEY);
    try {
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var auth_object = JSON.parse(originalText);
        if (auth_object.JWT != null || auth_object.JWT != null) {
            return auth_object.JWT;
        }
        else
            return null;
    } catch (error) {
        return res.status(403).json({message: "Access Denied"});
    } 
}