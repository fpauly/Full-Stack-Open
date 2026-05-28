const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})

//to json 在验证之后生效，可以删除 return res.json(...)
userSchema.set('toJSON',{
    transform:(document, returnObj)=>{
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
        delete returnObj.passwordHash
    }
})

module.exports = mongoose.model('User',userSchema)