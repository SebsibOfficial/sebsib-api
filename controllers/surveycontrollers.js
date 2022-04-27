const jwt = require('jsonwebtoken');
const { Project, Response, Question, Survey, Organization } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;

const inputTranslate = require('../utils/translateIds');

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
  var projectId = req.params.projectId;
  var quesIds = []; var surveyId;
  var { surveyName, questions } = req.body;
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
        description: '',
        pic: '',
        createdOn: new Date()
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
        questionText: question.question,
        inputType: new ObjectId(inputTranslate('name', question.inputType)),
        createdOn: new Date()
      });         
    }
    // Insert the Ids of the question in the survey
    var iis = await Survey.updateOne({ _id: surveyId }, { $push: { questions: quesIds } })
    // Insert the survey Id in the surveylist in Projects
    var iip = await Project.updateOne({ _id: projectId }, { $push: { surveysId: surveyId } })
    res.status(200).json({ iip, iis, iq });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error!" });
  }

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

const getResponsesController = async (req, res) => {
  const surveyId = req.params.surveyId;
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
    res.status(200).json({ questions: survey[0].joined_questions, responses: survey[0].joined_responses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }

}

const getSurveyController = async (req, res) => {
  const surveyId = req.params.id;

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
    console.log(survey);
    res.status(200).json({ 
      _id: survey._id, 
      name: survey.name, 
      questions: survey.joined_questions, 
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

const getRecentResponseController = async (req, res, next) => {
  const orgId = req.params.orgId;
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
          "surveyId": {"$in": surveys}
        }
      },
      {
        "$lookup": {
          "from": "surveys",
          "localField": "surveyId",
          "foreignField": "_id",
          "as": "survey_name",
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "enumratorId",
          "foreignField": "_id",
          "as": "enum_username",
        }
      },
    ]).sort({sentDate: -1});

    return res.status(200).json({resp: _responses, proj: all_projects});

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"});
  }
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
        createdOn: new Date()
      }]);

      await Survey.updateOne({ _id: response.surveyId }, { $push: { "responses": responseId } }).clone();
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
  getRecentResponseController,
  getSurveyController,
  getResponsesController,
  sendResponseController,
  deleteSurveyController
}
