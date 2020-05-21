const {Schema, model} = require('mongoose');

const boardSchema = new Schema({
    boardTitle:{
        type:String,
        required:true
    },
    boardDescription:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:true,
    }
},
{ timestamps:true}
    
);

module.exports = model('board',boardSchema);
