const { getMemberListController, createMemberController, getMemberController, editMemberController, 
  deleteMemberController, removeMemberController, addMemberController } = require('../controllers/membercontrollers');
const { getSurveyListController, createSurveyController, getRecentResponseController, getSurveyController, 
  sendResponseController, deleteSurveyController, getResponsesController } = require('../controllers/surveycontrollers');
const { getProjectListController, createProjectController, deleteProjectController } = require('../controllers/projectcontrollers');
const { editSettingsController } = require('../controllers/settingcontrollers');
const {sendRequestController,  getOrgStatusController,  changePasswordController, resetPasswordController} = require('../controllers/othercontrollers')

module.exports = {
  getMemberListController,
  createMemberController,
  getSurveyListController,
  createSurveyController,
  getProjectListController,
  createProjectController,
  editSettingsController,
  getMemberController,
  getRecentResponseController,
  getSurveyController,
  createProjectController, 
  sendResponseController,
  editMemberController,
  deleteMemberController,
  deleteProjectController,
  deleteSurveyController,
  getResponsesController,
  removeMemberController,
  addMemberController,
  sendRequestController,
  getOrgStatusController,
  changePasswordController,
  resetPasswordController
}