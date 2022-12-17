require("dotenv").config(); // Keeping environment variables safe
const express = require("express"); // Express is required
const app = express(); // I'll use "app" for accesing express
const https = require("https"); // https is required for get request
app.use(express.urlencoded({extended:true})); // Body-parser
app.use(express.static("public")); // Static method in order to access local files like css and images
app.set("view engine", "ejs"); // EJS is set
var _ = require('lodash'); // Lodash is required
const mongoose = require ("mongoose"); // Mongoose is required
const encrypt = require("mongoose-encryption")
mongoose.connect("mongodb://127.0.0.1:27017/userDB"); // Connecting Mongo Database, Collection & Mongo Atlas
// mongoose.connect("mongodb+srv://admin-ahmet:2503199600@cluster0.n8hirrx.mongodb.net/myBlogDB"); // Connecting Mongo Database, Collection & Mongo Atlas


// Creating a DB Schema
const userSchema = new mongoose.Schema({ // This allows us to record posts in database
  email: String,
  password: String
});

// Encrypts "password" field via using mongoose-encryption
// process.env.SECRET is stored in .env file to be safe
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

// Creating the Collection
const User = mongoose.model("user", userSchema); // "horses" collection is created.

// ________________________________________________________________Get requests
app.get("/", function(req, res) { // Home Page as home.ejs
  res.render("home");
});
app.get("/login", function(req, res) { // Home Page as home.ejs
  res.render("login");
});
app.get("/register", function(req, res) { // Home Page as home.ejs
  res.render("register");
});


// _______________________________________________________________Post Requests
app.post("/register", function(req,res){ // Create a new user
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});


app.post("/login", function(req,res){ // User login
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function (err,foundUser){
    if(!err){
      if(foundUser.password === password){
        res.render("secrets");
      }else{
        console.log(err);
      }
    }
  });
});

// Running the server
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is on and ready to wrack baby");
});
