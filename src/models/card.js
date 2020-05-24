const {Schema, model} = require('mongoose');

const cardSchema = new Schema({
    cardTitle:{
        type:String,
        required:true
    },
    cardDescription:{
        type:String,
        required:true
    },
    cardSubtitle:{
        type: [String],
        default:null
    },
    addedBy:{
        type:String,
        required:true,
    },
    boardId:{
        type:String,
        required:true,
    }
}, {timestamps:true
    
});

module.exports = model('card',cardSchema);
