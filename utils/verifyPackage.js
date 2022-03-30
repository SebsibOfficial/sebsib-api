const {Organization, User, Project} = require('../models');
const enums = require('./enums');
const jwt = require('jsonwebtoken');

module.exports = async (token, forParam) => {

  var userId = jwt.verify(token, process.env.TOKEN_SECRET)._id;
  var projects = [], projectCount, Aproject, surveyCount = 0, package, memberCount;
  var orgs = await Organization.aggregate([
    {
      $lookup: { from: 'packages', localField: 'packageId', foreignField: '_id', as: 'package_doc'}
    }
  ]);
  orgs = orgs.filter(org => org.ownerId == userId);
  package = orgs[0].package_doc[0];
  
  // Count the projects
  projects = orgs[0].projectsId;
  projectCount = projects.length;
  
  // Count the members
  memberCount = await User.count({organizationId: orgs[0]._id}) - 1;
  
  // Count the surveys in each project
  for (var projectId of projects) {
    Aproject = await Project.findById(projectId);
    surveyCount = surveyCount + Aproject.surveysId.length;
  }
  
  // Check if it exceeds package limit
  if (package.name == enums.PACKAGES.UNLIMITED) {
    return true;
  }

  switch (forParam) {
    case 'MEMBER':
      return memberCount >= package.members ? 'curr_member='+memberCount : true
    case 'PROJECT':
      return projectCount >= package.projects ? 'curr_project='+projectCount : true
    case 'SURVEY':
      return surveyCount >= package.surveys ? 'curr_survey='+surveyCount : true
    default:
      break;
  }
}