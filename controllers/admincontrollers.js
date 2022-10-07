const { InputType, Organization, Package, Project, Request, Response, Role, Survey, User } = require("../models");
const bcrypt = require('bcrypt');
const validator = require("validator");
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
  var { accountName, ownerEmail, ownerFirstName, ownerLastName, ownerPhone, packageId, expiryDate } = req.body;

  // check for bad inputs
  if (accountName === undefined || ownerEmail === undefined || packageId === undefined || expiryDate === undefined) return res.status(400).json({ message: 'Bad Input' });

  // Check if email is valid
  if (!validator.isEmail(ownerEmail)) {
    return res.status(400).json({ message: 'Invalid Email' });
  }

  ownerFirstName = ownerFirstName ?? "";
  ownerLastName = ownerLastName ?? "";
  ownerPhone = ownerPhone ?? "";

  try {
    // check if the account (organization) name is already taken
    const account = await Organization.findOne({ name: accountName });
    if (account) {
      return res.status(400).json({ message: "Account name is already taken" });
    }

    // check if the owner email is already in use
    const user = await User.findOne({ email: ownerEmail });
    if (user) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // for passwords, this is the password that is not hashed yet
    const _unique6DigitVal = Math.floor(Math
      .random() * (999999 - 100000 + 1)) + 100000;

    // Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(_unique6DigitVal.toString(), salt);

    const _userId = new ObjectId();
    const _orgId = new ObjectId();

    const _trimmedOrg = accountName.replaceAll(" ", "");
    const _customOrgId = _trimmedOrg.toUpperCase().substring(0, 3) + _trimmedOrg.toUpperCase().substring(_trimmedOrg.length - 3, _trimmedOrg.length) + Math.floor(Math.random() * 90 + 10)

    // create a new user, which will be the owner of the new organization
    const newUser = await User.create({
      _id: _userId,
      organizationId: _orgId,
      projectId: [],
      roleId: new ObjectId("623cc24a8b7ab06011bd1e60"),
      email: ownerEmail,
      phone: ownerPhone,
      firstName: ownerFirstName,
      lastName: ownerLastName,
      password: hash,
      pic: '',
      createdAt: new Date(),
    });

    newUser.password = '*';

    // create a new account (organization)
    const newAccount = await Organization.create({
      _id: _orgId,
      ownerId: _userId,
      orgId: _customOrgId,
      hasPassChange: false,
      packageId: new ObjectId(packageId),
      projectsId: [],
      name: accountName,
      expires: expiryDate,
    });

    return res.status(200).json({ 
      user: newUser,
      account: newAccount
    });
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