const boardCtrl = {}; 
const board = require('../models/board');

boardCtrl.renderBoardForm = (req,res) => {
    res.render('board/boardForm');
};

boardCtrl.renderCardForm = (req,res) => {
    res.send('Add new board');
};

boardCtrl.createNewBoard = async (req,res) => {
    const boardTitle = req.body.title;
    const boardDescription = req.body.description;
    const newBoard = new board({boardTitle,boardDescription});
    newBoard.createdBy = req.user.id;
    await newBoard.save();

    req.flash('success', 'Board created succesfully');
    res.redirect('/board');
};

boardCtrl.editBoard = (req,res) => {
    res.send("Editing board");
    // const boards = await board.findById();
};

boardCtrl.createNewCard = (req,res) => {
    res.send('new note');
};

boardCtrl.renderBoards = async (req,res) => {
    const boards = await board.find({createdBy: req.user.id}).sort({createdAt: 'desc'});
    res.render('./board/board', {boards}); // carpeta board, archivo board.ejs
};

boardCtrl.renderCards = (req,res) => {
    res.send('Render cards');
   
};

boardCtrl.renderEditForm = async (req,res) => {
    const currentBoard = await board.findById(req.params.id);
    if (currentBoard.createdBy != req.user.id) {
        req.flash('error', 'You can only edit your boards');
        return res.redirect('/board');
    }
    res.render('board/boardedit', {currentBoard});
};

boardCtrl.deleteBoard = async (req,res) => {
    const currentBoard = await board.findById(req.params.id);
    if (currentBoard.createdBy != req.user.id) { // Unnecesary because this works on a POST method
        req.flash('error', 'You can only delete your boards');
        return res.redirect('/board');
    }
    await board.findByIdAndDelete(req.params.id)
    req.flash('success', 'Your board was deleted');
    res.redirect('/board');
};

boardCtrl.updateBoard = async (req,res) => {
    const {title, description } = req.body; // Destructuring 
    await board.findByIdAndUpdate(req.params.id, {boardTitle:title, boardDescription:description});
    req.flash('success', 'Your board was edited');
    res.redirect('/board');
};



module.exports = boardCtrl;