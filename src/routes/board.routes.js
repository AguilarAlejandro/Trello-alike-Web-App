const { Router } = require('express');
const router = Router();
const { 
    renderBoardForm, 
    createNewBoard,
    createNewlist, 
    renderBoards,
    renderlists,
    renderEditForm, 
    updateBoard, 
    updatelist,
    deletelist,
    addCard,
    deleteCard,
    sortlists,
    deleteBoard } = require('../controllers/board.controllers');
const {isAuthenticated} = require('../config/auth');

//New board
router.get('/addboard', isAuthenticated, renderBoardForm);
router.post('/addboard', createNewBoard); 

//Get all boards
router.get('/board', isAuthenticated, renderBoards);

//Edit board

router.get('/board/:id/edit', isAuthenticated, renderEditForm);
router.put('/board/:id/edit', updateBoard);

//Delete board
router.delete('/board/:id/delete', isAuthenticated, deleteBoard);

//New list

router.post('/board/:id/addlist', createNewlist);

// Get all lists from board
router.get('/board/:id', isAuthenticated, renderlists);
router.post('/board/:id', isAuthenticated, sortlists);

router.put('/board/:id/editlist', isAuthenticated, updatelist);

// Delete lists

router.delete('/board/:id/delete/:id', isAuthenticated, deletelist);

// Add list card

router.post('/board/:id/addcard', isAuthenticated, addCard)

//Delete list card

router.delete('/board/:id/delete/:id/:id', isAuthenticated, deleteCard);


module.exports = router;