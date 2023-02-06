const {Organization, User, Project} = require('../models');
const enums = require('./enums');
const jwt = require('jsonwebtoken');

module.exports = async (token, forParam) => {

  var orgId = jwt.verify(token, process.env.TOKEN_SECRET).org;
  var projects = [], projectCount, Aproject, surveyCount = 0, package, memberCount;
  var orgs = await Organization.aggregate([
    {
      $lookup: { from: 'packages', localField: 'packageId', foreignField: '_id', as: 'package_doc'}
    }
  ]);
  orgs = orgs.filter(org => org._id == orgId);
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
  
  // Check if package has expired
  var expiresAt = new Date(orgs[0].expires);
  if (expiresAt.getTime() < new Date().getTime()) return 'expired';

  switch (forParam) {
    case 'MEMBER':
      return memberCount >= package.members ? 'not enough; mc='+memberCount : true
    case 'PROJECT':
      return projectCount >= package.projects ? 'not enough; pc='+projectCount : true
    case 'SURVEY':
      return surveyCount >= package.surveys ? 'not enough; sc='+surveyCount : true
    default:
      break;
  }
}