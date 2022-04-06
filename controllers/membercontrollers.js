const { User, Project } = require("../models");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectId = require('mongoose').Types.ObjectId;
const mongodb = require('mongodb');

const getMemberListController = async (req, res, next) => {
  var orgId = req.params.orgId;
  if (orgId == null) return res.status(400).json({message: 'Bad Input'})
  try {
    const memberlist = await User.find({organizationId: orgId})
    res.status(200).send(memberlist)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'})
  }
}

const createMemberController = async (req, res, next) => {
  var {email, password, username, projectsId} = req.body;
  var orgId = jwt.verify(req.header('auth-token'), process.env.TOKEN_SECRET).org;

  // Check if string is an email
  if (!validator.isEmail(email)) {
    return res.status(400).json({message: 'Invalid Email'});
  }
  // Check if username exists
  if (await User.exists({username: username}) || await User.exists({email: email})) {
    return res.status(400).json({message: 'Username or Email Exists'});
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
    username: username,
    password: hash,
  }]);
  delete result[0].password;
  res.status(200).send(result);
}

const getMemberController = async (req, res, next) => {
  var id = req.params.id;
  try {
    var member = await User.findOne({_id: id});
    res.status(200).json(member);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'});
  }
}

const editMemberController = async (req, res, next) => {
  var {email, password, username, projectsId} = req.body;
  var userId = req.params.id;
  
  // Check if string is an email
  if (!validator.isEmail(email)) {
    return res.status(400).json({message: 'Invalid Email'});
  }
  // Check if username exists
  if (await User.exists({username: username, _id: { $ne: userId}}) || await User.exists({email: email, _id: {$ne: userId}})) {
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
  var result = await User.updateOne({_id: userId},{
    projectsId: projectsId,
    email: email,
    username: username,
    password: hash,
  });
  //delete result[0].password;
  res.status(200).send(result);
}

const deleteMemberController = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({_id: id});
  // Check if the user to-be deleted exists 
  if (user == null) return res.status(404).json({message: 'User doesn\'t exist'});
  // Check if to-be deleted user is a member
  if (user.roleId != '623cc24a8b7ab06011bd1e5f') return res.status(401).json({message: "User not a member"});
  // Remove from User collection
  const result = await User.findOneAndDelete({_id: id});
  res.status(200).json(result);
}

module.exports = {
  createMemberController,
  getMemberListController,
  getMemberController,
  editMemberController,
  deleteMemberController
}