const { getMemberListController, createMemberController, getMemberController, editMemberController } = require('../controllers/membercontrollers');
const { getSurveyListController, createSurveyController, getRecentSurveyController, getSurveyController, sendResponseController } = require('../controllers/surveycontrollers');
const { getProjectListController, createProjectController } = require('../controllers/projectcontrollers');
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
  editMemberController
}