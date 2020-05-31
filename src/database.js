const mongoose = require('mongoose');

const { NODEMONGO_MONGODB_HOST, NODEMONGO_MONGODB_DATABASE, DBPASSWORD} = process.env;
mongoose.connect(process.env.MONGODB_URI||`mongodb://${NODEMONGO_MONGODB_HOST}/${NODEMONGO_MONGODB_DATABASE}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
})
    .then (db=> console.log('Database connected;'))
    .catch(err=> console.log(err));