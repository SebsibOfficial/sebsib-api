const { InputType, Organization, Package, Project, Request, Response, Role, Survey, User, Question } = require("../models");
const bcrypt = require('bcrypt');
const validator = require("validator");
const ObjectId = require('mongoose').Types.ObjectId;
const sanitizeAll = require('../utils/genSantizer');
const translateIds = require('../utils/translateIds')
const fetch = require('node-fetch');

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
          "from": "users",
          "localField": "ownerId",
          "foreignField": "_id",
          "as": "owner"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "projectsId",
          "foreignField": "_id",
          "as": "projects",
          "pipeline": [
            {
              "$lookup": {
                "from": "surveys",
                "localField": "surveysId",
                "foreignField": "_id",
                "as": "surveys",
                
              },
            },
            { $unset: "surveysId" },
            {
              "$lookup": {
                "from": "users",
                "localField": "_id",
                "foreignField": "projectsId",
                "as": "members",
              },
            },
          ],
        }
      },
      { $unset: ["projectsId", "ownerId"] },
    ]);

    return res.status(200).json(accounts);
  } catch (error) {
    console.log(error);
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
  const limit = sanitizeAll(req.params.limit);

  try {
    const accounts = await Organization.find().limit(limit);
    const requests = await Request.find().limit(limit);
    const users = await User.find().limit(limit);
    const projects = await Project.find().limit(limit);
    const surveys = await Survey.find().limit(limit);
    const responses = await Response.find().limit(limit);
    const inputTypes = await InputType.find().limit(limit);
    const packages = await Package.find().limit(limit);
    const roles = await Role.find().limit(limit);
    const questions = await Question.find().limit(limit);

    return res.status(200).json({
      accounts: accounts,
      requests : requests,
      users: users,
      projects : projects,
      surveys: surveys,
      responses: responses,
      questions: questions,
      inputTypes : inputTypes,
      packages : packages,
      roles : roles,
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
      if (collection == 'Account') collection = 'Organization'
      if (collection == 'Inputtype') collection = 'InputType'
    }
    console.log(collection)
    // get all elements of the collection
    const elements = await eval(collection).find();

    return res.status(200).json(elements);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" });
  }
}

const getAccountInfoController = async (req, res, next) => {
  let accountId = sanitizeAll(req.params.id);

  try {
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
          "localField": "ownerId",
          "foreignField": "_id",
          "as": "owner"
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


    return res.status(200).json(account[0]);
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

  // sanitize all inputs
  accountName = sanitizeAll(accountName); ownerEmail = sanitizeAll(ownerEmail); ownerFirstName = sanitizeAll(ownerFirstName); ownerLastName = sanitizeAll(ownerLastName); ownerPhone = sanitizeAll(ownerPhone); packageId = sanitizeAll(packageId); expiryDate = sanitizeAll(expiryDate);

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
    const _unique8DigitVal = Math.floor(Math
      .random() * (99999999 - 10000000 + 1)) + 10000000;

    // Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(_unique8DigitVal.toString(), salt);

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
      expires: new Date(expiryDate),
    });
    
    // send account creation confirmation
    var data = {
      service_id: process.env.SERVICE_ID,
      template_id: "template_jy47etj",
      user_id: process.env.USER_ID,
      template_params: {firstName: ownerFirstName, emailTo: ownerEmail, password: _unique8DigitVal.toString(), packageName: translateIds('id', packageId).toLowerCase().charAt(0).toUpperCase},
    };
    // If .env is DEV or PROD
    if (process.env.NODE_ENV != 'test') {
      var resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    return res.status(200).json({
      user: newUser,
      account: newAccount
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" });
  }
}

const addAdminController = async (req, res, next) => {
  var { adminFirstName, adminLastName, adminEmail, password, roleId } = req.body;

  // sanitize all inputs
  adminFirstName = sanitizeAll(adminFirstName); adminLastName = sanitizeAll(adminLastName); adminEmail = sanitizeAll(adminEmail); password = sanitizeAll(password); roleId = sanitizeAll(roleId);

  // check for bad inputs
  if (adminFirstName === undefined || adminLastName === undefined || adminEmail === undefined || password === undefined || roleId === undefined) return res.status(400).json({ message: 'Bad Input' });

  // Check if email is valid
  if (!validator.isEmail(adminEmail)) {
    return res.status(400).json({ message: 'Invalid Email' });
  }

  // checck if password meets requirements
  if (password.length < 8) return res.status(400).json({ message: 'Password too short' });

  try {
    // check if email exists
    if (await User.exists({ email: adminEmail })) {
      return res.status(400).json({ message: 'Email Exists' });
    }

    // Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    var admin = await User.create({
      _id: new ObjectId(),
      organizationId: new ObjectId('63412e98e855bf671f9533a7'),
      projectId: [],
      roleId: new ObjectId(roleId),
      email: adminEmail,
      phone: '',
      firstName: adminFirstName,
      lastName: adminLastName,
      password: hash,
      pic: '',
    });

    admin.password = '*';

    return res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const decideRequestController = async (req, res, next) => {
  var { requestId, descision } = req.body;

  // sanitize all inputs
  requestId = sanitizeAll(requestId); descision = sanitizeAll(descision);

  try {

    // check for bad inputs
    if (requestId === undefined || descision === undefined) return res.status(400).json({ message: 'Bad Input' });
    if (descision !== 'APPROVE' && descision !== 'DECLINE') return res.status(400).json({ message: 'Bad Input' });

    // check if request exists
    const request = await Request.findOne({ _id: new ObjectId(requestId) });
    if (!request) return res.status(400).json({ message: 'Request does not exist' });

    // check if request is already approved or declined
    if (request.status !== 'PENDING') return res.status(400).json({ message: 'Request already approved or declined' });

    // approve or decline request
    if (descision === 'APPROVE') {
      await Request.updateOne({ _id: new ObjectId(requestId) }, { $set: { status: 'APPROVED' } });
      var approvedOrg = await Organization.findOne({ name: request.orgName });
      return res.status(200).json(approvedOrg);
    }

    if (descision === 'DECLINE') {
      await Request.updateOne({ _id: new ObjectId(requestId) }, { $set: { status: 'DECLINED' } });
      return res.status(200).json({ message: 'Request Declined' });
    }

    return res.status(500).json({ message: "Something went wrong" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}

const editAccountController = async (req, res, next) => {
  const id = sanitizeAll(req.params.id);
  var { accountName, ownerEmail, ownerFirstName, ownerLastName, ownerPhone, packageId, expiryDate } = req.body;

  // sanitize all inputs
  accountName = sanitizeAll(accountName); ownerEmail = sanitizeAll(ownerEmail); ownerFirstName = sanitizeAll(ownerFirstName); ownerLastName = sanitizeAll(ownerLastName); ownerPhone = sanitizeAll(ownerPhone); packageId = sanitizeAll(packageId); expiryDate = sanitizeAll(expiryDate);

  try {
    // get organization from id
    const organization = await Organization.findOne({ _id: new ObjectId(id) });
    if (!organization) return res.status(400).json({ message: 'Organization does not exist' });

    // get owner of organization
    const owner = await User.findOne({ _id: new ObjectId(organization.ownerId) });

    // check if inputs are valid
    // validate email
    if (!validator.isEmail(ownerEmail)) return res.status(400).json({ message: 'Invalid Email' });

    // check if inputs are not empty strings
    accountName = accountName === '' ? organization.name : accountName;
    ownerEmail = ownerEmail === '' ? owner.email : ownerEmail;
    ownerFirstName = ownerFirstName === '' ? owner.firstName : ownerFirstName;
    ownerLastName = ownerLastName === '' ? owner.lastName : ownerLastName;
    ownerPhone = ownerPhone === '' ? owner.phone : ownerPhone;
    packageId = packageId === '' ? organization.packageId : packageId;
    expiryDate = expiryDate === '' ? organization.expires : expiryDate;

    // update organization
    await Organization.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        name: accountName,
        packageId: new ObjectId(packageId),
        expires: new Date(expiryDate)
      }
    });

    // update owner
    await User.updateOne({
      _id: new ObjectId(organization.ownerId)
    }, {
      $set: {
        email: ownerEmail,
        firstName: ownerFirstName,
        lastName: ownerLastName,
        phone: ownerPhone
      }
    });

    // get updated organization
    const updatedOrganization = await Organization.findOne({ _id: new ObjectId(id) });
    // get updated owner
    const updatedOwner = await User.findOne({ _id: new ObjectId(organization.ownerId) });
    updatedOwner.password = '*';

    return res.status(200).json({
      organization: updatedOrganization,
      owner: updatedOwner
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" });
  }
}

const deleteAccountController = async (req, res, next) => {
  const accountId = sanitizeAll(req.params.id);

  try {
    // get organization along with its respective members, projects, surveys, questions and responses
    const organization = await Organization.findOne({ _id: new ObjectId(accountId) });
    if (!organization) return res.status(400).json({ message: 'Organization does not exist' });

    const members = await User.find({ organizationId: new ObjectId(accountId) });
    const projects = await Project.find({ _id: { $in: organization.projectsId } });
    const surveys = await Survey.find({ _id: { $in: projects.map(project => project.surveysId) } });
    const questions = await Question.find({ _id: { $in: surveys.map(survey => survey.questions) } });
    const responses = await Response.find({ _id: { $in: surveys.map(survey => survey.responses) } });

    // delete responses
    await Response.deleteMany({ _id: { $in: responses.map(response => response._id) } });
    // delete questions
    await Question.deleteMany({ _id: { $in: questions.map(question => question._id) } });
    // delete surveys
    await Survey.deleteMany({ _id: { $in: surveys.map(survey => survey._id) } });
    // delete projects
    await Project.deleteMany({ _id: { $in: projects.map(project => project._id) } });
    // delete members
    await User.deleteMany({ _id: { $in: members.map(member => member._id) } });

    // delete organization
    await Organization.deleteOne({ _id: new ObjectId(accountId) });

    return res.status(200).json({ message: 'Account Deleted' });

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

const deleteAdminController = async (req, res, next) => {
  const adminId = sanitizeAll(req.params.id);
  try {
    // get admin
    const admin = await User.findOne({ _id: new ObjectId(adminId) });

    // check if admin exists
    if (!admin) return res.status(400).json({ message: 'Admin does not exist' });

    // check if user is an admin
    if (admin.roleId.toString() !== '623cc24a8b7ab06011bd1e61') return res.status(400).json({ message: 'User is not an admin' });

    // delete admin
    await User.deleteOne({ _id: new ObjectId(adminId) });

    return res.status(200).json({ message: "Admin Deleted" });
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