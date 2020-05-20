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
    console.log(newBoard);
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
    const boards = await board.find();
    res.render('./board/board', {boards}); // carpeta board, archivo board.ejs
};

boardCtrl.renderCards = (req,res) => {
    res.send('Render cards');
   
};

boardCtrl.renderEditForm = async (req,res) => {
    const currentBoard = await (await board.findById(req.params.id));
    console.log(currentBoard);
    res.render('board/boardedit', {currentBoard});
};

boardCtrl.deleteBoard = async (req,res) => {
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