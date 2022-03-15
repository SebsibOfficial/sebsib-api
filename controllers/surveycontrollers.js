const createSurveyController = (req, res) => {
  res.json({message: "Hey from createSurveyController"})
}

const getSurveyListController = (req, res) => {
  res.json({message: "Hey from getSurveyListController"})
}

module.exports = {
  createSurveyController,
  getSurveyListController
}
