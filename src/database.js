const mongoose = require('mongoose');

//const { NODEMONGO_MONGODB_HOST, NODEMONGO_MONGODB_DATABASE, DBPASSWORD} = process.env;
//const MONGODB_URI = `mongodb://${NODEMONGO_MONGODB_HOST}/${NODEMONGO_MONGODB_DATABASE}`;
const MONGODB_URI = `mongodb+srv://Alejandro:<DBPASSWORD>@padmidb-d8iu9.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
})
    .then (db=> console.log('Database connected;'))
    .catch(err=> console.log(err));