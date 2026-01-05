const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('Please input password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.zfhlr7q.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url,{family:4})

const phoneSchema = new mongoose.Schema({
 
    name:String,
    phone:String
})

const Phone = mongoose.model('Phone',phoneSchema)

 
const phone = new Phone({
   
    name:'Fan Yin',
    phone:'123-12345678'
})

phone.save().then(result=>{
    console.log('Phone saved')
    mongoose.connection.close()
})