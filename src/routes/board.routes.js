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
    deleteBoard } = require('../controllers/board.controllers');

//New board
router.get('/addboard', renderBoardForm);
router.post('/addboard', createNewBoard); 

//Get all boards
router.get('/board', renderBoards);

//Edit board

router.get('/board/:id/edit', renderEditForm);
router.put('/board/:id/edit', updateBoard);

//Delete board
router.delete('/board/:id/delete', deleteBoard);

//New card
router.get('/board/:id/addcard', renderCardForm);

router.post('/board/:id/addcard', createNewCard);

// Get all cards from board
router.get('/board/:id', renderCards);


// Edit cards
router.get('/board/:id/edit/:id');

router.put('/board/:id/edit/:id');


module.exports = router;