const sgMail = require('@sendgrid/mail')
const fetch = require('node-fetch')
const { reset } = require('nodemon')
//REGISTERATION
// {
//   "packageName": "Standard",
//   "firstName": "Yoseph",
//   "email": "yosephten@gmail.com",
//   "password":"5R76TGYUIH",
//   "days": "30 days"
// }
// RENEWAL
// {
//   "package":"Standard",
//   "amount":"2,000",
//   "date": "6/12/2022"
// }
// RESET
// {
//   "NewPassword":"Standard",
//   "firstName":"Yoseph",
//   "date": "6/12/2022"
// }
module.exports = async (type, data, to) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  var temp_id = ''
  var msg
  switch (type) {
    case 'REGISTRATION':
      temp_id = 'd-b3059af26a9847c8913b05671cd24c8a';
      break;
    case 'RENEWAL':
      temp_id = 'd-81276002d81b477ea0e7c7231b5f08a7';
      break;
    case 'PASS_RESET':
      temp_id = 'd-ba5789fbeb8747ef976ac0c68b10cd10';
    break;  
    default:
      break;
  }
  if (type == 'PLAIN') {
    msg = {
      to: to,
      from: { email: 'info@sebsib.com', name: 'Sebsib' },
      subject: "New Request form "+data.from,
      html: '<strong>Approve or Deny</strong> <br><a href="www.sebsib.com">Sebsib</a>',
    }
  } else {
    msg = {
      to: to,
      from: { email: 'info@sebsib.com', name: 'Sebsib' },
      templateId: temp_id,
      dynamicTemplateData: data    
    }
  }

  try {
    var result = await sgMail.send(msg);
    return result[0].statusCode;
  } catch (error) {
    console.log(error)
    return -1 
  }
}