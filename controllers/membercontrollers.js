const getMemberListController = (req, res, next) => {
  res.json({message: "Hey from getMemberListController"})
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