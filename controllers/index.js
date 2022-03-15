const { getMemberListController, createMemberController } = require('../controllers/membercontrollers');
const { getSurveyListController, createSurveyController } = require('../controllers/surveycontrollers');
const { getProjectListController, createProjectController } = require('../controllers/projectcontrollers');
const { editSettingsController } = require('../controllers/settingcontrollers');

module.exports = {
  getMemberListController,
  createMemberController,
  getSurveyListController,
  createSurveyController,
  getProjectListController,
  createProjectController,
  editSettingsController
}