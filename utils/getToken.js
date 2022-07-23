const CryptoJS = require('crypto-js');

module.exports = getToken = (auth) => {
    
    const cryptkey = CryptoJS.enc.Utf8.parse(process.env.PRIVATE_KEY);
    const cryptiv = CryptoJS.enc.Utf8.parse(process.env.IV);
    // Decryption
    const crypted = CryptoJS.enc.Base64.parse(auth);
    var bytes = CryptoJS.AES.decrypt({ ciphertext: crypted }, cryptkey, {
        iv: cryptiv,
        mode: CryptoJS.mode.CTR,
    });

    try {
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var auth_object = JSON.parse(originalText);
        if (auth_object.JWT != null || auth_object.JWT != null) {
            return auth_object.JWT;
        }
        else
            return null;
    } catch (error) {
        console.log(error);
        return false;
    } 
}