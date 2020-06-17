const boardCtrl = {};
const board = require('../models/board');
const card = require('../models/card');
var previousRoute = '/';

///////// Boards /////////
boardCtrl.renderBoardForm = (req, res) => {
    const pageTitle = 'Create new board';
    res.render('board/boardForm',{pageTitle});
};

boardCtrl.createNewBoard = async (req, res) => {
    if (((typeof req.body.title == 'undefined') || (req.body.title == '')) || ((typeof req.body.description == 'undefined') || (req.body.description == ''))) {
        req.flash('error', 'You cannot leave any field empty');
        res.redirect('/board');
    }
    else {
        const boardTitle = req.body.title;
        const boardDescription = req.body.description;
        const newBoard = new board({ boardTitle, boardDescription });
        newBoard.createdBy = req.user.id;
        await newBoard.save();
        req.flash('success', 'Board created succesfully');
        res.redirect('/board');
    }
};

boardCtrl.renderBoards = async (req, res) => {
    const pageTitle = 'Boards';
    const boards = await board.find({ createdBy: req.user.id }).sort({ createdAt: 'desc' });
    res.render('./board/board', { boards, pageTitle }); // carpeta board, archivo board.ejs
};

boardCtrl.renderEditForm = async (req, res) => {
    const pageTitle = 'Edit board';
    const currentBoard = await board.findById(req.params.id);
    if (currentBoard.createdBy != req.user.id) {
        req.flash('error', 'You can only edit your boards');
        return res.redirect('/board');
    }
    res.render('board/boardedit', { currentBoard, pageTitle });
};

boardCtrl.deleteBoard = async (req, res) => {
    const currentBoard = await board.findById(req.params.id);
    if (currentBoard.createdBy != req.user.id) { // Unnecesary because this works on a POST method
        req.flash('error', 'You can only delete your boards');
        return res.redirect('/board');
    };
    await board.findByIdAndDelete(req.params.id);
    await card.remove({ boardId: req.params.id });
    req.flash('success', 'Your board was deleted');
    res.redirect('/board');
};

boardCtrl.updateBoard = async (req, res) => {
    const { title, description } = req.body; // Destructuring 
    await board.findByIdAndUpdate(req.params.id, { boardTitle: title, boardDescription: description });
    req.flash('success', 'Your board was edited');
    res.redirect('/board');
};

///////// Cards /////////
//Render card creation form
boardCtrl.renderCardForm = async (req, res) => {
    const pageTitle = 'Add new card';
    previousRoute = req.originalUrl
    previousRoute = previousRoute.slice(0, previousRoute.length - 7)
    const currentBoard = await board.findById(req.params.id);
    res.render('./board/cardsForm', { currentBoard, pageTitle });
};
//Process card creation
boardCtrl.createNewCard = async (req, res) => {
    if (((typeof req.body.title == 'undefined') || (req.body.title == '')) || ((typeof req.body.description == 'undefined') || (req.body.description == ''))) {
        req.flash('error', 'You cannot leave any field empty');
        res.redirect('/board');
    }
    else {
        const cardTitle = req.body.title;
        const cardDescription = req.body.description;
        const addedBy = req.user.id
        const boardId = previousRoute.slice(7, previousRoute.length - 1);
        const newCard = new card({ cardTitle, cardDescription, addedBy, boardId });
        await newCard.save();
        req.flash('success', 'Card added succesfully');
        res.redirect(previousRoute);
    }
};
//Render all the cards from a board
boardCtrl.renderCards = async (req, res) => {
    const pageTitle = 'Your board';
    const currentCards = await card.find({ boardId: req.params.id }).sort({position:1});
    const currentBoard = await board.findById(req.params.id); // Needed on the front-end to generate proper redirect links
    previousRoute = '/board/' + req.params.id;
    res.render('./board/cards', { currentCards, currentBoard, previousRoute, pageTitle });
};

// Shuffle all the cards with Sortable

boardCtrl.sortCards = async (req,res) => {
    var cardOrder = req.body.order;
    cardOrder = Array.from(JSON.parse(cardOrder));
    res.json({ ok: true });

    for (let i = 0; i < cardOrder.length; i++) {
        var cardId = cardOrder[i];
        await card.findByIdAndUpdate(cardId, {position:i});
    }
};

//Process card edition
boardCtrl.updateCard = async (req, res) => {
    const { title, description, currentCardId } = req.body; // Destructuring 
    await card.findByIdAndUpdate(currentCardId, { cardTitle: title, cardDescription: description });
    req.flash('success', 'Your card was edited');
    res.redirect(previousRoute);
};
//Process card deletion
boardCtrl.deleteCard = async (req, res) => {
    const currentCard = await card.findById(req.params.id);
    if (currentCard.addedBy != req.user.id) { // Unnecesary because this works on a POST method
        req.flash('error', 'You can only delete your cards');
        return res.redirect(previousRoute);
    }
    await card.findByIdAndDelete(req.params.id)
    req.flash('success', 'Your card was deleted');
    res.redirect(previousRoute);
};
// Process subtitle addition
boardCtrl.addCardSubtitle = async (req, res) => {
    await card.updateOne(
        { _id: req.body.currentCardId },
        {
            $addToSet: { "cardSubtitle": req.body.title }
        });
    req.flash('success', 'Your subtitle was added!');
    res.redirect('/board');
};

module.exports = boardCtrl;