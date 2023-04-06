var TYPES = require('./id-text.json');

module.exports = (from, inp) => {
  if (from == 'id' || from == "ID") {
    for (let index = 0; index < TYPES.length; index++) {
      const element = TYPES[index];
      if (element._id == inp){
        return element.text;
      }
    }
  } else {
    for (let index = 0; index < TYPES.length; index++) {
      const element = TYPES[index];
      if (element.text == inp){
        return element._id;
      }
    }
  }
}