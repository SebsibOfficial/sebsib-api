const { Project, Response, Question, Survey } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;

const createSurveyController = (req, res) => {
  res.json({ message: "Hey from createSurveyController" })
}

const getSurveyListController = async (req, res) => {
  var projectId = req.params.projectId;
  try {
    var projects = await Project.aggregate([
      { $lookup: { from: 'surveys', localField: 'surveysId', foreignField: '_id', as: 'survey_docs' } }
    ]);
    var surveys = projects.filter(project => project._id == projectId);
    if (surveys.length == 0) return res.status(403).json({ message: 'Bad Input' });
    res.status(200).send(surveys[0].survey_docs);
  } catch (error) {
    console.log(error);
  }
}

const getSurveyController = (req, res) => {
  res.json({ message: "Hey from getSurveyController" })
}

const getRecentSurveyController = (req, res, next) => {
  res.json({ message: "Hey from getRecentSurveyController" })
}

const sendResponseController = async (req, res) => {

  var responseData = req.body;  // list of response data 
  try {
    // loop through list to create a response reference and find survey to modify
    for (let i = 0; i < responseData.length; i++) {
      var response = responseData[i];
      var responseId = response.id;

      await Response.insertMany([{
        _id: response.id,
        surveyId: response.surveyId,
        name: response.name,
        answers: response.answers,
        sentDate: response.sentDate,
        enumratorId: response.enumratorId,
      }]);

      // await Survey.updateOne({ _id: response.surveyId }, { $push: { "responses": responseId } }, (res, err) => res.status(200)).clone();
    }
    res.status(200).json({ message: "success" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}


// *** NEEDS TO BE TESTED HARD ****
const deleteSurveyController = async (req, res, next) => {
  const Projectid = req.params.pid;
  const SurveyId = req.params.sid;
  // Check if SurveyId is in Project
  var project = await Project.findById(Projectid);
  if (!project.surveysId.includes(SurveyId)) return res.status(403).json({ message: "Survey not found" });
  var survey = await Survey.findById(SurveyId);
  var resIds = survey.responses; var quesIds = survey.questions;
  // Delete Responses
  var dr = await Response.deleteMany({ _id: { $in: resIds } });
  // Delete Questions
  var dq = await Question.deleteMany({ _id: { $in: quesIds } });
  // Remove from surveysId list
  var dfp = await Project.updateOne({ _id: Projectid }, { $pull: { surveysId: survey._id } })
  // Remove from survey collection
  var ds = await Survey.findOneAndDelete({ _id: SurveyId });
  return res.status(200).json(ds);
}

module.exports = {
  createSurveyController,
  getSurveyListController,
  getRecentSurveyController,
  getSurveyController,
  sendResponseController,
  deleteSurveyController
}
