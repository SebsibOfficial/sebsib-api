const getRoutes = require('./get');
const postRoutes = require('./post');
const patchRoutes = require('./patch');
const deleteRoutes = require('./delete');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

module.exports = {
  getRoutes,
  postRoutes,
  deleteRoutes,
  patchRoutes,
  authRoutes,
  adminRoutes
}