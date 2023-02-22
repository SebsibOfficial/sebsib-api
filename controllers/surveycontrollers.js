const jwt = require('jsonwebtoken');
const { Project, Response, Question, Survey, Organization, User } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;
const sanitizeAll = require('../utils/genSantizer');
const getToken = require('../utils/getToken');
const inputTranslate = require('../utils/translateIds');
const { customSurveyIdGenerator, customSurveyLinkGenerator } = require('../utils/surveyGenerators');

const createSurveyController = async (req, res) => {
  /*
 THE INTERFACE FOR THE REQUEST [would be cool if you could only accept this kind of request]
{
  "surveyName": string,
  "questions": [{
      "id": ObjectId,
      "question": string,
      "choices": [
        {
          "_id": ObjectId,
          "text": string
        }
      ],
      "inputType": "CHOICE" | "TEXT" | "MULTI-SELECT",
      "showPattern": {
        "hasShow": boolean,
        "showIfQues": ObjectId,
        "ansIs": ObjectId
      }
  }]
}
*/
  var projectId = sanitizeAll(req.params.projectId);
  var quesIds = []; var surveyId;
  var { surveyName, questions, type } = req.body;
  surveyName = sanitizeAll(surveyName);
  type = sanitizeAll(type);

  // Check package if number of questions is allowed
  var orgId = jwt.verify(getToken(req.header('Authorization')), process.env.TOKEN_SECRET).org;
  var org = await Organization.aggregate([
    {
      "$match": {
        "_id": new ObjectId(orgId)
      }
    },
    {
      "$lookup": { from: 'packages', localField: 'packageId', foreignField: '_id', as: 'package_doc' }
    }
  ]);

  if (questions.length > org[0].package_doc[0].questions) {
    return res.status(401).json({ message: "Exceeded Question Limit" });
  }

  if (type === null || type === undefined) return res.status(401).json({ message: "Type cannot be null" });

  if (type.toUpperCase() !== "ONLINE" && type.toUpperCase() !== "INCENTIVIZED" && type.toUpperCase() !== "REGULAR")
    return res.status(401).json({ message: "Invalid Survey Type" });

  try {
    // Create the survey
    // Check if there are similarly named surveys
    var result = await Survey.exists({ name: surveyName });
    if (result != null) return res.status(403).json({ message: "Survey exisits" });


    const trimmedName = surveyName.replaceAll(" ", "");
    const customSurveyId = await customSurveyIdGenerator(trimmedName);


    var link = '';
    if (type.toUpperCase() === "ONLINE" || type.toUpperCase() === "INCENTIVIZED") {

      link = await customSurveyLinkGenerator();
    }

    // Insert survey
    var result = await Survey.insertMany({
      _id: new ObjectId(),
      shortSurveyId: customSurveyId,
      name: surveyName,
      questions: [],
      responses: [],
      description: '',
      pic: '',
      createdOn: new Date(),
      type: type.toUpperCase(),
      link: link ?? "",
      status: 'STARTED'
    })
    surveyId = result[0]._id;

    // Get the question Id's
    for (let i = 0; i < questions.length; i++) {
      quesIds.push(questions[i].id);
    }

    // Insert the question
    for (let i = 0; i < questions.length; i++) {
      var question = questions[i];
      var iq = await Question.insertMany({
        _id: new ObjectId(question.id),
        hasShowPattern: question.showPattern.hasShow,
        showIf: question.showPattern.hasShow ? {
          questionId: question.showPattern.showIfQues,
          answerId: question.showPattern.ansIs
        } : null,
        options: question.choices,
        mandatory: question.mandatory,
        questionText: question.question,
        inputType: new ObjectId(inputTranslate('name', question.inputType)),
        createdOn: new Date()
      });
    }
    // Insert the Ids of the question and the generated link in the survey
    var iis = await Survey.updateOne({ _id: surveyId }, { $push: { questions: quesIds } })
    // Insert the survey Id in the surveylist in Projects
    var iip = await Project.updateOne({ _id: projectId }, { $push: { surveysId: surveyId } })


    return res.status(200).json({ iip, iis, iq });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error!" });
  }

}

const getSurveyListController = async (req, res) => {
  var projectId = sanitizeAll(req.params.projectId);
  try {
    var projects = await Project.aggregate([
      { $lookup: { from: 'surveys', localField: 'surveysId', foreignField: '_id', as: 'survey_docs' } }
    ]);
    var surveys = projects.filter(project => project._id == projectId);
    if (surveys.length == 0) return res.status(403).json({ message: 'Bad Input' });
    return res.status(200).send(surveys[0].survey_docs);
  } catch (error) {
    console.log(error);
  }
}

const getResponsesController = async (req, res) => {
  const surveyId = sanitizeAll(req.params.surveyId);
  try {
    const survey = await Survey.aggregate([
      {
        "$match": {
          "_id": new ObjectId(surveyId)
        }
      },
      {
        "$lookup": {
          "from": "questions",
          "localField": "questions",
          "foreignField": "_id",
          "as": "joined_questions"
        }
      },
      {
        "$lookup": {
          "from": "responses",
          "localField": "responses",
          "foreignField": "_id",
          "as": "joined_responses"
        }
      }
    ]);
    return res.status(200).json({ questions: survey[0].joined_questions.sort(function (x, y) { return x.createdOn - y.createdOn; }), responses: survey[0].joined_responses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }

}

const getSurveyController = async (req, res) => {
  const surveyId = sanitizeAll(req.params.id);

  try {
    var _survey = await Survey.aggregate([
      {
        "$match": {
          "_id": new ObjectId(surveyId)
        }
      },
      {
        "$lookup": {
          "from": "questions",
          "localField": "questions",
          "foreignField": "_id",
          "as": "joined_questions",
        }
      },
      {
        "$lookup": {
          "from": "responses",
          "localField": "responses",
          "foreignField": "_id",
          "as": "joined_responses",
        }
      }
    ]);

    var survey = _survey[0];
    return res.status(200).json({
      _id: survey._id,
      shortSurveyId: survey.shortSurveyId,
      name: survey.name,
      questions: survey.joined_questions.sort(function (x, y) { return x.createdOn - y.createdOn; }),
      responses: survey.joined_responses
      /*, description: survey.description, 
      picture: survey.picture, 
      createdOn: survey.createdOn */
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const getRegularSurveyController = async (req, res) => {
  const surveyId = sanitizeAll(req.params.id);

  try {
    var _survey = await Survey.aggregate([
      {
        "$match": {
          "_id": new ObjectId(surveyId)
        }
      },
      {
        "$lookup": {
          "from": "questions",
          "localField": "questions",
          "foreignField": "_id",
          "as": "joined_questions",
        }
      },
      {
        "$lookup": {
          "from": "responses",
          "localField": "responses",
          "foreignField": "_id",
          "as": "joined_responses",
        }
      }
    ]);

    var survey = _survey[0];

    if (survey.type == null || survey.type == undefined || survey.type.toUpperCase() == 'regular') {
      return res.status(200).json({
        _id: survey._id,
        shortSurveyId: survey.shortSurveyId,
        name: survey.name,
        questions: survey.joined_questions.sort(function (x, y) { return x.createdOn - y.createdOn; }),
        // no responses will be sent since this endpoint is only used from mobile
        // responses: survey.joined_responses
        /*, description: survey.description, 
        picture: survey.picture, 
        createdOn: survey.createdOn */
      });
    }

    return res.status(400).json({ "message": "Not a regular survey" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const getRecentResponseController = async (req, res, next) => {
  const orgId = sanitizeAll(req.params.orgId);
  var surveys = [];
  try {
    // get all the survey in the org
    var _orgs = await Organization.aggregate([
      {
        "$match": {
          "_id": new ObjectId(orgId)
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "projectsId",
          "foreignField": "_id",
          "as": "joined_projects",
        }
      },
    ]);

    var all_projects = _orgs[0].joined_projects;
    for (let index = 0; index < all_projects.length; index++) {
      const survey_arr = all_projects[index].surveysId;
      for (let j = 0; j < survey_arr.length; j++) {
        const element = survey_arr[j];
        surveys.push(element);
      }
    }

    // return all the response who have surveyId
    var _responses = await Response.aggregate([
      {
        "$match": {
          "surveyId": { "$in": surveys }
        }
      },
      {
        "$lookup": {
          "from": "surveys",
          "localField": "surveyId",
          "foreignField": "_id",
          "as": "survey_obj",
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "enumratorId",
          "foreignField": "_id",
          "as": "enum_obj",
        }
      },
    ]).sort({ sentDate: -1 });

    for (let index = 0; index < _responses.length; index++) {
      _responses[index].enum_obj[0].password = "*";
    }

    return res.status(200).json({ resp: _responses, proj: all_projects });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const sendResponseController = async (req, res) => {
  // list of response data 
  var responseData = req.body;

  try {
    // loop through list to create a response reference and find survey to modify
    for (let i = 0; i < responseData.length; i++) {
      var response = responseData[i];
      var responseId = response._id;

      // get enumerator id
      const enumeratorId = response.enumratorId;

      var survey = await Survey.findOne({ _id: new ObjectId(response.surveyId) });
      if (!survey) return res.status(403).json({ message: "Survey does not exist anymore" });

      // get the project where the surveys id is inside the surveysID array
      var project = await Project.findOne({ surveysId: { $in: [survey._id] } });
      if (!project) return res.status(403).json({ message: "Project does not exist anymore" });

      // check if the projectId is in the enumerator's project array
      var enumerator = await User.findOne({ _id: new ObjectId(enumeratorId) });
      if (!enumerator) return res.status(403).json({ message: "Enumerator does not exist anymore" });

      var enumeratorExists = await enumerator.projectsId.includes(new ObjectId(project._id));


      var enumeratorCondition = enumeratorExists || enumerator.role === "623cc24a8b7ab06011bd1e60";
      if (!enumeratorCondition) return res.status(403).json({ message: "Enumerator does not have access to this project" });

      await Response.insertMany([{
        _id: responseId,
        surveyId: response.surveyId,
        shortSurveyId: response.shortSurveyId,
        name: response.name,
        answers: response.answers ?? '',
        sentDate: response.sentDate,
        geoPoint: response.geoPoint,
        enumratorId: response.enumratorId,
        createdOn: new Date()
      }]);

      await Survey.updateOne({ _id: response.surveyId }, { $push: { "responses": responseId } }).clone();
    }
    return res.status(200).json({ message: "success" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

// *** NEEDS TO BE TESTED HARD ****
const deleteSurveyController = async (req, res, next) => {
  const Projectid = sanitizeAll(req.params.pid);
  const SurveyId = sanitizeAll(req.params.sid);
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const syncSurveysController = async (req, res, next) => {
  // accepts an array of surveyIds, check if the surveys are availiable in the database
  // return the ids that are not availiable.
  const { surveyIds } = req.body;
  try {
    var deletedSurveys = [];
    for (let index = 0; index < surveyIds.length; index++) {
      const surveyId = surveyIds[index];
      var survey = await Survey.findOne({ _id: new ObjectId(surveyId) });

      if (!survey) {
        deletedSurveys.push(surveyId);
      }
    }
    return res.status(200).json(deletedSurveys);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  createSurveyController,
  getSurveyListController,
  getRecentResponseController,
  getSurveyController,
  getRegularSurveyController,
  getResponsesController,
  sendResponseController,
  deleteSurveyController,
  syncSurveysController
}
