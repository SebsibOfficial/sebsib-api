const getMemberListController = (req, res, next) => {
  res.json({message: "Hey from getMemberListController"})
}

const createMemberController = (req, res, next) => {
  res.json({message: "Hey from createMemberController"})
}

module.exports = {
  createMemberController,
  getMemberListController
}