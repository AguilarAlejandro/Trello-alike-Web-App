const {Schema, model} = require('mongoose');

const listSchema = new Schema({
    listTitle:{
        type:String,
        required:true
    },
    listDescription:{
        type:String,
        required:true
    },
    listSubtitle:{
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
    },
    position:Number,
}, {timestamps:true
    
});

module.exports = model('list',listSchema);
