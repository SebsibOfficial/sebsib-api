const { User, Project } = require("../models");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectId = require('mongoose').Types.ObjectId;

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
  var hashedPassword = 'a';
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
    password: hashedPassword,
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

const editMemberController = (req, res, next) => {
  res.json({message: "Hey from editMemberController"})
}
module.exports = {
  createMemberController,
  getMemberListController,
  getMemberController,
  editMemberController
}