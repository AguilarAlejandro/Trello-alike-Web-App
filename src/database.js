const mongoose = require('mongoose');

const { NODEMONGO_MONGODB_HOST, NODEMONGO_MONGODB_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${NODEMONGO_MONGODB_HOST}/${NODEMONGO_MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
})
    .then (db=> console.log('Database connected;'))
    .catch(err=> console.log(err));