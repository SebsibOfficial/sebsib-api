const { User, Project } = require("../models");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectId = require('mongoose').Types.ObjectId;
const mongodb = require('mongodb');
const getToken = require('../utils/getToken')
const sanitizeAll = require('../utils/genSantizer');

const getMemberListController = async (req, res, next) => {
  var orgId = req.params.orgId;
  orgId = sanitizeAll(orgId);
  if (orgId == null) return res.status(400).json({message: 'Bad Input'})
  try {
    const memberlist = await User.find({organizationId: orgId})
    return res.status(200).send(memberlist)
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Server Error'})
  }
}

const createMemberController = async (req, res, next) => {
  var {email, password, phone, firstname, lastname, projectsId} = req.body;
  // Required fields must not be undefined
  if (email === undefined || password === undefined || projectsId === undefined) return res.status(400).json({message: 'Bad Input'});
  // Remove undefined types
  phone = phone ?? '';
  firstname = firstname ?? '';
  lastname = lastname ?? '';
  // Check password length
  if (password.length < 8) return res.status(400).json({message: 'Password too short'});
  email = sanitizeAll(email);phone = sanitizeAll(phone);
  firstname = sanitizeAll(firstname); lastname = sanitizeAll(lastname); projectsId = sanitizeAll(projectsId);

  var orgId = jwt.verify(getToken(req.header('Authorization')), process.env.TOKEN_SECRET).org;
  try {
    // Check if string is an email
    if (!validator.isEmail(email)) {
      return res.status(400).json({message: 'Invalid Email'});
    }
    // Check if email exists
    if (await User.exists({email: email})) {
      return res.status(400).json({message: 'Email Exists'});
    }
    // Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    // Check if projectId exist
    for (var i = 0; i < projectsId.length; i++) {
      if(await Project.exists({_id: projectsId[i]}) == null){
        return res.status(400).json({message: 'Project doesn\'t Exist'});
      }
    }
    // Create Member
    var result = await User.insertMany([{
      _id: new ObjectId(),
      organizationId: orgId,
      projectsId: projectsId,
      roleId: new ObjectId('623cc24a8b7ab06011bd1e5f'),
      email: email,
      phone: phone,
      firstName: firstname,
      lastName: lastname, 
      password: hash,
      pic: '',
      createdOn: new Date()
    }]);
    result[0].password = '*';
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Server Error'});
  }
  
}

const getMemberController = async (req, res, next) => {
  var id = sanitizeAll(req.params.id);
  try {
    var member = await User.findOne({_id: id});
    member.password = "*";
    return res.status(200).json(member);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Server Error'});
  }
}

const editMemberController = async (req, res, next) => {
  var {email, password, phone, firstname, lastname, projectsId} = req.body;
  var userId = sanitizeAll(req.params.id);
  email = sanitizeAll(email); firstname = sanitizeAll(firstname); lastname = sanitizeAll(lastname); phone = sanitizeAll(phone); projectsId = sanitizeAll(projectsId);
  
  try {
    // Check if string is an email
    if (!validator.isEmail(email)) {
      return res.status(400).json({message: 'Invalid Email'});
    }
    // Check if username exists
    if (await User.exists({email: email, _id: {$ne: userId}})) {
      return res.status(400).json({message: 'Username or Email Exists'});
    }
    const user = await User.findOne({_id: userId});
    // Check if the user to-be edited exists 
    if (user == null) return res.status(404).json({message: 'User doesn\'t exist'});
    // Check if to-be edited user is a member
    if (user.roleId != '623cc24a8b7ab06011bd1e5f') return res.status(401).json({message: "User not a member"});
    // Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    // Check if projectId exist
    for (var i = 0; i < projectsId.length; i++) {
      if (!mongodb.ObjectId.isValid(projectsId[i])) return res.status(400).json({message: 'ProjectId is not valid'});
      if(await Project.exists({_id: projectsId[i]}) == null){
        return res.status(400).json({message: 'Project doesn\'t Exist'});
      }
    }
    // Edit Member
    if (password == '') {
      var result = await User.updateOne({_id: userId},{
        projectsId: projectsId,
        email: email,
        firstName: firstname,
        lastName: lastname,
        phone: phone
      });
    } else {
      var result = await User.updateOne({_id: userId},{
        projectsId: projectsId,
        email: email,
        firstName: firstname,
        lastName: lastname,
        phone: phone,
        password: hash,
      });
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Server Error'});
  }
}

const deleteMemberController = async (req, res, next) => {
  const id = sanitizeAll(req.params.id);
  try {
    const user = await User.findOne({_id: id});
    // Check if the user to-be deleted exists 
    if (user == null) return res.status(404).json({message: 'User doesn\'t exist'});
    // Check if to-be deleted user is a member
    if (user.roleId != '623cc24a8b7ab06011bd1e5f') return res.status(401).json({message: "User not a member"});
    // Remove from User collection
    const result = await User.findOneAndDelete({_id: id});
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Server Error'});
  }
}

const addMemberController = async (req, res) => {
  const projectId = sanitizeAll(req.params.pid);
  const memberIds = sanitizeAll(req.body.members);
  try {
    const users = await User.find({_id: {$in : memberIds}});
    const project = await Project.findOne({_id: projectId});
    // Check if the member to-be added exists 
    if (users.length == 0 || project == null) return res.status(404).json({message: 'User or Project doesn\'t exist: '});
    // Check if to-be added user is a member
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (element.roleId != '623cc24a8b7ab06011bd1e5f') return res.status(401).json({message: "User not a member"});
    }
    // Check if member is already in the project
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (element.projectsId.includes(projectId)) return res.status(401).json({message: "User is already in the project"});      
    }
    // Insert the project id in the member
    var ip = await User.updateMany({_id: {$in : memberIds}}, {$push: {projectsId: projectId}});
    return res.status(200).json({members: memberIds, project: projectId});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Server Error"});
  }
}

const removeMemberController = async (req, res) => {
  const projectId = sanitizeAll(req.params.pid);
  const memberId = sanitizeAll(req.params.id);
  try {
    const user = await User.findOne({_id: memberId});
    const project = await Project.findOne({_id: projectId});
    // Check if the member to-be removed exists 
    if (user == null || project == null) return res.status(404).json({message: 'User or Project doesn\'t exist'});
    // Check if to-be removed user is a member
    if (user.roleId != '623cc24a8b7ab06011bd1e5f') return res.status(401).json({message: "User not a member"});
    // Check if member is already in the project
    if (!user.projectsId.includes(projectId)) return res.status(401).json({message: "User not in the project"});
    // Remove the project id in the member
    var rp = await User.findOneAndUpdate({_id: memberId}, {$pull: {projectsId: projectId}});
    return res.status(200).json({member: memberId, project: projectId});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  createMemberController,
  getMemberListController,
  getMemberController,
  editMemberController,
  deleteMemberController,
  addMemberController,
  removeMemberController
}