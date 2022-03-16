const createSurveyController = (req, res) => {
  res.json({message: "Hey from createSurveyController"})
}

const getSurveyListController = (req, res) => {
  res.json({message: "Hey from getSurveyListController"})
}

const getSurveyController = (req, res) => {
  res.json({message: "Hey from getSurveyController"})
}

const getRecentSurveyController = (req, res, next) => {
  res.json({message: "Hey from getRecentSurveyController"})
}

const sendResponseController = (req, res) => {
  res.json({message: "Hey from sendResponseController"})
}
module.exports = {
  createSurveyController,
  getSurveyListController,
  getRecentSurveyController,
  getSurveyController,
  sendResponseController
}
