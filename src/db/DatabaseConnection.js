const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser : true , useCreateIndex : true , useUnifiedTopology : true })
.then(() =>{
    console.log("Connection successful with mongodb");
})
.catch(err =>console.log(err));