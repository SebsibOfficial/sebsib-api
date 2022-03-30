const { getMemberListController, createMemberController, getMemberController, editMemberController, deleteMemberController } = require('../controllers/membercontrollers');
const { getSurveyListController, createSurveyController, getRecentSurveyController, getSurveyController, sendResponseController, deleteSurveyController } = require('../controllers/surveycontrollers');
const { getProjectListController, createProjectController, deleteProjectController } = require('../controllers/projectcontrollers');
const { editSettingsController } = require('../controllers/settingcontrollers');

module.exports = {
  getMemberListController,
  createMemberController,
  getSurveyListController,
  createSurveyController,
  getProjectListController,
  createProjectController,
  editSettingsController,
  getMemberController,
  getRecentSurveyController,
  getSurveyController,
  createProjectController, 
  sendResponseController,
  editMemberController,
  deleteMemberController,
  deleteProjectController,
  deleteSurveyController
}