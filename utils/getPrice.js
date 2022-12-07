var PKG = require('./price.json');

module.exports = (pkgId, subType) => {
  var multiplier = 0.8;
  var p;
  PRICE.forEach(PKG => {
    if (pkgId == PKG._id) {
      if (subType == 'ONE_YEAR'){
        console.log(PKG.price)
        p = (PKG.price * multiplier * 12).toString()
      }
      else
        p = PKG.price.toString()
    }
    else
      return "NO PKG"
  })
  return p;
}