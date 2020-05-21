const boardCtrl = {}; 
const board = require('../models/board');
const card = require('../models/card');
var previousRoute = '/';

///////// Boards /////////
boardCtrl.renderBoardForm = (req,res) => {
    res.render('board/boardForm');
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

boardCtrl.renderBoards = async (req,res) => {
    const boards = await board.find({createdBy: req.user.id}).sort({createdAt: 'desc'});
    res.render('./board/board', {boards}); // carpeta board, archivo board.ejs
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

///////// Cards /////////

boardCtrl.renderCardForm = async (req,res) => {
    previousRoute = req.originalUrl
    previousRoute = previousRoute.slice(0, previousRoute.length-7)
    const currentBoard = await board.findById(req.params.id);
    res.render('./board/cardsForm', {currentBoard});
};

boardCtrl.createNewCard = async (req,res) => {
    const cardTitle = req.body.title;
    const cardDescription = req.body.description;
    const addedBy = req.user.id
    const boardId = previousRoute.slice(7,previousRoute.length-1);
    const newCard = new card({cardTitle,cardDescription,addedBy,boardId});
    await newCard.save();
    req.flash('success', 'Card added succesfully');
    res.redirect(previousRoute);
};

boardCtrl.renderCards = async (req,res) => {
    const currentCards = await card.find({boardId:req.params.id});
    const currentBoard = await board.findById(req.params.id);
    res.render('./board/cards', {currentCards, currentBoard});
};

module.exports = boardCtrl;