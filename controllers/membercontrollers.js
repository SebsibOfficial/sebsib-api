const { User } = require("../models");

const getMemberListController = async (req, res, next) => {
  var orgId = req.params.orgId;
  if (orgId == null) return res.status(403).json({message: 'Bad Input'})
  try {
    const memberlist = await User.find({organizationId: orgId})
    res.status(200).send(memberlist)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server Error'})
  }
}

const createMemberController = (req, res, next) => {
  res.json({message: "Hey from createMemberController"})
}

const getMemberController = (req, res, next) => {
  res.json({message: "Hey from getMemberController"})
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