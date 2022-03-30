const { Organization, Project, User } = require("../models");
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
      surveysId: [],
    }])
    var pid = Projectresult[0]._id;
  
    // Add project into User.projectsId
    for (var i = 0; i < enumrators.length; i++) {
      var Userres = await User.updateOne({_id: enumrators[0]}, {$push: {projectsId: pid}})
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

const deleteProjectController = (req, res, next) => {
  res.json({message: "Hey from deleteProjectController"})
}

module.exports = {
  createProjectController,
  getProjectListController,
  deleteProjectController
}