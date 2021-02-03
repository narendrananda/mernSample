require('dotenv').config();
require('./db/DatabaseConnection');
const User = require("./models/collection");
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,"../public")));
app.set("view engine","hbs");
app.set("views", path.join(__dirname,"../templates/views"));
hbs.registerPartials(path.join(__dirname,"../templates/partials"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// console.log(path.join(__dirname,"../public"));

app.get('/', (req,res)=>{
    res.render('index');
});
app.get('/register', (req,res)=>{
    res.render('register');
});

app.post('/register', async(req,res)=>{
    try {
     const data = new User({
         name: req.body.name,
         email: req.body.email,
         password:req.body.password,
         gender: req.body.gender
     });
     const Token = await data.GenerateToken();
     const createData = await data.save();
     res.render("index");       
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/login', (req,res)=>{
    res.render('login');
});

app.post("/login", async(req,res)=>{
try {
    const email = req.body.email;
    const password = req.body.password;
    const UserFound = await User.findOne({ email: email});
    const isMatch = await bcrypt.compare(password,UserFound.password);

    const token = await UserFound.GenerateToken();
    
    if( isMatch )
    {
        res.render("index");
    }
    else{
        res.send("User not found");
    }

} catch (error) {
    res.status(400).send("Invalid User Details");
}

});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});
