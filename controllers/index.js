const {
  getMemberListController,
  createMemberController,
  getMemberController,
  editMemberController,
  deleteMemberController,
  removeMemberController,
  addMemberController,
} = require('../controllers/membercontrollers');

const {
  getSurveyListFromProjectIdController,
  getSurveyListFromOrgIdController,
  createSurveyController,
  createOnlineSurveyController,
  getRecentResponseController,
  getSurveyController,
  getRegularSurveyController,
  sendResponseController,
  deleteSurveyController,
  getResponsesController,
  syncSurveysController,
  getSurveyQuestionsController,
  editSurveyController,
  getSurveyListFromUserIdController,
  editOnlineSurveyController,
  updateSurveyStatus
} = require('../controllers/surveycontrollers');

const {
  getProjectListController,
  createProjectController,
  deleteProjectController,
} = require('../controllers/projectcontrollers');

const { editSettingsController } = require('../controllers/settingcontrollers');

const {
  sendRequestController,
  getOrgStatusController,
  changePasswordController,
  resetPasswordController,
} = require('../controllers/othercontrollers')

const {
  getDashStatController,
  getAllAccountInfoController,
  getRequestsController,
  getInfoBriefController,
  getAllInfoController,
  getAccountInfoController,
  getAdminsController,
  createAccountController,
  addAdminController,
  decideRequestController,
  editAccountController,
  deleteAccountController,
  deleteAdminController,
} = require('../controllers/admincontrollers')

module.exports = {
  getMemberListController,
  createMemberController,
  createSurveyController,
  getProjectListController,
  createProjectController,
  editSettingsController,
  getMemberController,
  getRecentResponseController,
  getSurveyController,
  getRegularSurveyController,
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
  resetPasswordController,
  getDashStatController,
  getAllAccountInfoController,
  getRequestsController,
  getInfoBriefController,
  getAllInfoController,
  getAccountInfoController,
  getAdminsController,
  createAccountController,
  addAdminController,
  decideRequestController,
  editAccountController,
  deleteAccountController,
  deleteAdminController,
  syncSurveysController,
  getSurveyListFromProjectIdController,
  getSurveyListFromOrgIdController,
  createOnlineSurveyController,
  getSurveyQuestionsController,
  editSurveyController,
  getSurveyListFromUserIdController,
  editOnlineSurveyController,
  updateSurveyStatus
}