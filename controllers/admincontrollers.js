const { User, Project, Survey, Organization, Response, Request } = require("../models");
const mongoose = require('mongoose');

const getDashStatController = async (req, res, next) => {
  try {
    // organization (accounts) count
    const accountsCount = await Organization.count();

    // admins count
    const adminsCount = await User.countDocuments({ roleId: { $in: ["623cc24a8b7ab06011bd1e61", "623cc24a8b7ab06011bd1e62"] } });

    // expired orgaznizations count
    const expAccountsCount = await Organization.countDocuments({ expires: { $lt: new Date() } });

    // members count
    const membersCount = await User.countDocuments({ roleId: { $nin: ["623cc24a8b7ab06011bd1e61", "623cc24a8b7ab06011bd1e62"] } });

    // projects count
    const projectsCount = await Project.countDocuments();

    // responses count
    const responseCount = await Response.countDocuments();

    // surveys count
    const surveysCount = await Survey.countDocuments();

    return res.status(200).json({
      "accountsCount": accountsCount,
      "adminsCount": adminsCount,
      "expAccountsCount": expAccountsCount,
      "membersCount": membersCount,
      "projectsCount": projectsCount,
      "responseCount": responseCount,
      "surveysCount": surveysCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAllAccountInfoController = async (req, res, next) => {
  try {

    // get basic infos from all organizations
    const accounts = await Organization.aggregate([
      {
        "$lookup": {
          "from": "projects",
          "localField": "projectsId",
          "foreignField": "_id",
          "as": "projects"
        }
      },
    ]);

    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getRequestsController = async (req, res, next) => {
  try {
    const requests = await Request.find()

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const getInfoBriefController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAllInfoController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAccountInfoController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAdminsController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const createAccountController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const addAdminController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const decideRequestController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const editAccountController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const deleteAccountController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const deleteAdminController = async (req, res, next) => {
  try {

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
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
};