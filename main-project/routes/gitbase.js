/**
 * this is our gitbase routing file within which
 * we will define the available routes in for our gitbase module
 */
const express = require('express');
const router = express.Router();
const { getUserList, getUserByName, getUserRepo } = require('../controllers/gitbase');

/**
 * all of our possible gitbase routes
 */
router.get('/', getUserList);
router.get('/:username', getUserByName);
router.get('/repos/:repo_url', getUserRepo);

module.exports = router;