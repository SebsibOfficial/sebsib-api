const { InputType, Organization, Package, Project, Request, Response, Role, Survey, User } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;
const sanitizeAll = require('../utils/genSantizer');

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
      {
        "$lookup": {
          "from": "users",
          "localField": "_id",
          "foreignField": "organizationId",
          "as": "members"
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
    return res.status(500).json({ message: "Server Error" });
  }
}

const getInfoBriefController = async (req, res, next) => {
  try {
    const limit = sanitizeAll(req.params.limit);

    const accounts = await Organization.find().limit(limit);
    const requests = await Request.find().limit(limit);
    const users = await User.find().limit(limit);
    const projects = await Project.find().limit(limit);
    const surveys = await Survey.find().limit(limit);
    const responses = await Response.find().limit(limit);
    const inputTypes = await InputType.find().limit(limit);
    const packages = await Package.find().limit(limit);
    const roles = await Role.find().limit(limit);


    return res.status(200).json({
      "accounts": accounts,
      "requests ": requests,
      "users": users,
      "projects ": projects,
      "surveys": surveys,
      "responses": responses,
      "inputTypes ": inputTypes,
      "packages ": packages,
      "roles ": roles,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAllInfoController = async (req, res, next) => {
  try {
    let collection = sanitizeAll(req.params.collection);

    // capitalize first letter if its not capitalized
    collection = collection.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

    // removes the last s, if a collection name is prular in a request
    if (collection[collection.length - 1] === "s") {
      collection = collection.slice(0, -1);
    }

    // get all elements of the collection
    const elements = await eval(collection).find();

    return res.status(200).json(elements);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAccountInfoController = async (req, res, next) => {
  try {
    let accountId = sanitizeAll(req.params.id);

    const account = await Organization.aggregate([
      {
        "$match": {
          "_id": new ObjectId(accountId)
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "projectsId",
          "foreignField": "_id",
          "as": "projects"
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "_id",
          "foreignField": "organizationId",
          "as": "members"
        }
      },
    ]);


    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAdminsController = async (req, res, next) => {
  try {
    const admins = await User.find({ roleId: { $in: ["623cc24a8b7ab06011bd1e61", "623cc24a8b7ab06011bd1e62"] } });
    
    return res.status(200).json(admins);
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