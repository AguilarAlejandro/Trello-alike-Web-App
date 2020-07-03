const { Router } = require('express');
const router = Router();
const {renderIndex, renderAbout} = require('../controllers/index.controllers');
const {isNotAuthenticated, isAuthenticated} = require('../config/auth');
const {renderBoards} = require('../controllers/board.controllers');

router.get('/', isNotAuthenticated, renderIndex);
router.get('/', isAuthenticated, renderBoards);


router.get('/about', renderAbout);


module.exports = router;