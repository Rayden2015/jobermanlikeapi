const express = require('express');
const router = express.Router();

const { getUserProfile, updatePassword, updateUser } = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/change').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateUser);

module.exports = router;