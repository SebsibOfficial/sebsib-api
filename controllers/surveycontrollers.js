const { Project } = require("../models");

const createSurveyController = (req, res) => {
  res.json({message: "Hey from createSurveyController"})
}

const getSurveyListController = async (req, res) => {
  var projectId = req.params.projectId;
  try {
    var projects = await Project.aggregate([
      {$lookup: { from: 'surveys', localField: 'surveysId', foreignField: '_id', as: 'survey_docs'}}
    ]);
    var surveys = projects.filter(project => project._id == projectId);
    if (surveys.length == 0) return res.status(403).json({message: 'Bad Input'});
    res.status(200).send(surveys[0].survey_docs);
  } catch (error) {
    console.log(error);
  }
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
