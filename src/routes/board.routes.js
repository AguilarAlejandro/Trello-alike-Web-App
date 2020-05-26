const { Router } = require('express');
const router = Router();
const { 
    renderBoardForm, 
    renderCardForm,
    createNewBoard,
    createNewCard, 
    renderBoards,
    renderCards,
    renderEditForm, 
    updateBoard, 
    renderCardEditForm,
    updateCard,
    deleteCard,
    addCardSubtitle,
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

//New card
router.get('/board/:id/addcard', isAuthenticated, renderCardForm);

router.post('/board/:id/addcard', createNewCard);

// Get all cards from board
router.get('/board/:id',isAuthenticated, renderCards);

// Edit cards
//router.get('/board/:id/edit/:id', isAuthenticated, renderCardEditForm);
router.put('/board/:id/editcard', isAuthenticated, updateCard);

// Delete cards

router.delete('/board/:id/delete/:id', isAuthenticated, deleteCard);

// Add card subtitle

router.post('/board/:id/addsubtitle', isAuthenticated, addCardSubtitle)


module.exports = router;