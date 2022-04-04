const req = require('express/lib/request');
const jwt = require('jsonwebtoken');
const { Project, Response, Question, Survey } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;

const createSurveyController = async (req, res) => {
  var orgId = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET).org;
  var projectId = req.params.projectId;
  var {surveyName, questions} = req.body;
  console.log(surveyName, questions);
  try {
    // Create the survey
      // Check if there are similarly named surveys
      var result = await Survey.exists({name: surveyName});
      if (result != null) return res.status(403).json({message: "Survey exisits"});
      // Insert survey
      var result = await Survey.insertMany({
        _id: new ObjectId(),
        name: surveyName,
        questions: [],
        responses: [],
      })
      var surveyId = result[0]._id;
    // Insert the question
    // Add the Ids of the question in the survey
    // Insert the survey Id in the surveylist in Projects
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error!"});
  }
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
// *** NEEDS TO BE TESTED HARD ****
const deleteSurveyController = async (req, res, next) => {
  const Projectid = req.params.pid;
  const SurveyId = req.params.sid;
  // Check if SurveyId is in Project
  var project = await Project.findById(Projectid);
  if (!project.surveysId.includes(SurveyId)) return res.status(403).json({message: "Survey not found"});
  var survey = await Survey.findById(SurveyId);
  var resIds = survey.responses; var quesIds = survey.questions;
  // Delete Responses
  var dr = await Response.deleteMany({_id: {$in: resIds}});
  // Delete Questions
  var dq = await Question.deleteMany({_id: {$in: quesIds}});
  // Remove from surveysId list
  var dfp = await Project.updateOne({_id: Projectid}, {$pull: {surveysId: survey._id}})
  // Remove from survey collection
  var ds = await Survey.findOneAndDelete({_id: SurveyId});
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
