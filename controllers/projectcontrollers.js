const { Organization, Project, User, Survey, Response, Question } = require("../models");
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

const createProjectController = async (req, res) => {
  var {projectName, enumrators} = req.body;
  var orgId = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET).org;
  try {
    
    // Check if enumurators(members) exist in the organization
    for (var i = 0; i < enumrators.length; i++) {
      if(await User.exists({_id: enumrators[i]}) == null){
        return res.status(400).json({message: 'User doesn\'t Exist'});
      }
    }

    // Create Project
    var Projectresult = await Project.insertMany([{
      _id: new ObjectId(),
      name: projectName,
      description: '',
      pic: '',
      surveysId: [],
      createdOn: new Date()
    }])
    var pid = Projectresult[0]._id;

    // Add project into User.projectsId
    for (var i = 0; i < enumrators.length; i++) {
      var Userres = await User.updateOne({_id: enumrators[i]}, {$push: {projectsId: pid}})
    }

    // Add project into Org.projectsId
    var Orgres = await Organization.updateOne({_id: orgId}, {$push: {projectsId: pid}})
    return res.status(200).send(pid);

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Server Error"});
  }
}

const getProjectListController = async (req, res) => {
  var orgId = req.params.orgId;
  try {
    var Orgs = await Organization.aggregate([
      {$lookup: { from: 'projects', localField: 'projectsId', foreignField: '_id', as: 'project_docs'}}
    ]);
    Orgs = Orgs.filter(org => org._id == orgId);
    if (Orgs.length == 0) return res.status(403).json({message: 'Bad Input'});
    res.status(200).send(Orgs[0].project_docs);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'});
  }
}
 // ***MORE TESTING IS NEED ON THIS CONTROLLER***
const deleteProjectController = async (req, res, next) => {
  const projectId = req.params.id;
  var orgId = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET).org;
  var surveyIDs = [], respIDs = [], questionIDs = [];
  try {
    // Get survey IDs
    var r = await Project.findById(projectId);
    surveyIDs = r.surveysId;
    // Get survey answers & question Ids
    for (let index = 0; index < surveyIDs.length; index++) {
      var r = await Survey.findById(surveyIDs[index]);
      r.responses.forEach(resp => {
        respIDs.push(resp);
      });
      r.questions.forEach(ques => {
        questionIDs.push(ques);
      });
    }
    // Get the User that have this project
    var orgUsers = await User.find({organizationId: orgId});
    // Delete Responses
    var dr = await Response.deleteMany({_id: {$in: respIDs}});
    // Delete Questions
    var dq = await Question.deleteMany({_id: {$in: questionIDs}});
    // Delete Surveys
    var ds = await Survey.deleteMany({_id: {$in: surveyIDs}})
    // Delete from Org project list
    var dfo = await Organization.updateOne({_id: orgId}, {$pull: {projectsId: projectId}})
    // Delete from User project list
    for (let index = 0; index < orgUsers.length; index++) {
      var dfu = await User.updateOne({_id: orgUsers[index]._id}, {$pull: {projectsId: projectId}})
    }
    // Delete from Projects
    var dp = await Project.findByIdAndDelete(projectId);

    res.status(200).json({projectId, surveyIDs, respIDs, questionIDs});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  createProjectController,
  getProjectListController,
  deleteProjectController
}