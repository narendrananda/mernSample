const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,"email exists"],
        validate (value) {
            if (!validator.isEmail(value)){
                throw new Error(`Invalid email`);
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:3
    },
    gender:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
     }]

});

userSchema.methods.GenerateToken = async function (){
    try {
        const token = await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        return token;
    } catch (error) {
        res.send(error);
        console.log(error);
    }
};

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
});

const User = new mongoose.model("User",userSchema);

module.exports = User;