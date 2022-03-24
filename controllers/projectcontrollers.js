const { Organization } = require("../models");

const createProjectController = (req, res) => {
  res.json({message: "Hey from createProjectController"})
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

module.exports = {
  createProjectController,
  getProjectListController
}