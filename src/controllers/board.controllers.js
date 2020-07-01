const boardCtrl = {};
const board = require('../models/board');
const list = require('../models/list');
const card = require('../models/card');
var previousRoute = '/';

///////// Boards /////////
boardCtrl.renderBoardForm = (req, res) => {
    const pageTitle = 'Create new board';
    res.render('board/boardForm', { pageTitle });
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
    await list.remove({ boardId: req.params.id });
    req.flash('success', 'Your board was deleted');
    res.redirect('/board');
};

boardCtrl.updateBoard = async (req, res) => {
    const { title, description } = req.body; // Destructuring 
    await board.findByIdAndUpdate(req.params.id, { boardTitle: title, boardDescription: description });
    req.flash('success', 'Your board was edited');
    res.redirect('/board');
};

///////// lists /////////
//Render list creation form
boardCtrl.renderlistForm = async (req, res) => {
    const pageTitle = 'Add new list';
    previousRoute = req.originalUrl
    previousRoute = previousRoute.slice(0, previousRoute.length - 7)
    const currentBoard = await board.findById(req.params.id);
    res.render('./board/listsForm', { currentBoard, pageTitle });
};
//Process list creation
boardCtrl.createNewlist = async (req, res) => {
    if (((typeof req.body.title == 'undefined') || (req.body.title == '')) || ((typeof req.body.description == 'undefined') || (req.body.description == ''))) {
        req.flash('error', 'You cannot leave any field empty');
        res.redirect('/board');
    }
    else {
        const listTitle = req.body.title;
        const listDescription = req.body.description;
        const addedBy = req.user.id
        const boardId = previousRoute.slice(7, previousRoute.length);
        var posi = await list.find().sort({ position: -1 }).limit(1) // To get the current maximum position
        posi = JSON.stringify(posi);
        if ((typeof posi == 'undefined') || (posi == '[]')) {
            var position = 0;
        } else {
            posi = JSON.parse(posi.slice(1, posi.length - 1));
            var position = posi.position + 1;
        }
        const newlist = new list({ listTitle, listDescription, addedBy, boardId, position});
        await newlist.save();
        res.redirect(previousRoute);
    }
};
//Render all the lists from a board
boardCtrl.renderlists = async (req, res) => {
    const pageTitle = 'Your board';
    const currentlists = await list.find({ boardId: req.params.id }).sort({ position: 1 });
    const currentCards = await card.find({ boardId: req.params.id }).sort({ position: 1 });
    const currentBoard = await board.findById(req.params.id); // Needed on the front-end to generate proper redirect links
    previousRoute = '/board/' + req.params.id;
    res.render('./board/lists', { currentlists, currentCards, currentBoard, previousRoute, pageTitle });
};

// Shuffle all the lists with Sortable

boardCtrl.sortlists = async (req, res) => {
    var listOrder = req.body.order;
    listOrder = Array.from(JSON.parse(listOrder));
    res.json({ ok: true });

    for (let i = 0; i < listOrder.length; i++) {
        var listId = listOrder[i];
        await list.findByIdAndUpdate(listId, { position: i });
    }
};

//Process list edition
boardCtrl.updatelist = async (req, res) => {
    const { title, description, currentlistId } = req.body; // Destructuring 
    await list.findByIdAndUpdate(currentlistId, { listTitle: title, listDescription: description });
    req.flash('success', 'Your list was edited');
    res.redirect(previousRoute);
};
//Process list deletion
boardCtrl.deletelist = async (req, res) => {
    const currentlist = await list.findById(req.params.id);
    if (currentlist.addedBy != req.user.id) { // Unnecesary because this works on a POST method
        req.flash('error', 'You can only delete your lists');
        return res.redirect(previousRoute);
    }
    await list.findByIdAndDelete(req.params.id)
    res.redirect(previousRoute);
};
// Process subtitle addition
boardCtrl.addCard = async (req, res) => {
    const cardTitle = req.body.title;
    const listId = req.body.currentListId;
    const boardId = req.params.id
    const addedBy = req.user.id;
    previousRoute = req.originalUrl.slice(0, req.originalUrl.length - 7)
    var posi = await card.countDocuments({ listId: req.body.currentListId })
    // The previous line returns the number of cards that belong to 'currentListId'
    const newCard = new card({ cardTitle, listId, boardId, addedBy, posi });
    await newCard.save();
    res.redirect(previousRoute);
};

boardCtrl.deleteCard = async (req, res) => {
    const currentCard = await card.findById(req.params.id);
    if (currentCard.addedBy != req.user.id) { // Unnecesary because this works on a POST method
        req.flash('error', 'You can only delete your cards');
        return res.redirect(previousRoute);
    }
    await card.findByIdAndDelete(req.params.id)
    res.redirect(previousRoute);
};

module.exports = boardCtrl;