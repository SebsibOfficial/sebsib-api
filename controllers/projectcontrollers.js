const createProjectController = (req, res) => {
  res.json({message: "Hey from createProjectController"})
}

const getProjectListController = (req, res) => {
  res.json({message: "Hey from getProjectListController"})
}

module.exports = {
  createProjectController,
  getProjectListController
}