const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }},
    {timestamps:true
});

userSchema.methods.encryptPassword = async password => { //Parameter goes b4 arrow
    const salt = await bcrypt.genSalt(10);
    /* async and await make the function asynchronous or non-blocking
    so the web app doesn't block until the result is finished*/
    return await bcrypt.hash(password, salt);
}

userSchema.methods.matchPassword = async function (password){ 
    return await bcrypt.compare(password, this.password)
}

module.exports = model('user',userSchema);
