const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const port = 3000;


mongoose.connect('mongodb://localhost:27017/careersdb',{useNewUrlParser: true})
    .then(() => {
        console.log("MOngo Db connection open!!");
    })
    .catch((err) =>{
        console.log("Oh no Mongo Connection Error!!!!");
        console.log(err);
    });

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.set('view engine','ejs');

app.listen(port,function(){
    console.log('Listening on port ' + port);
});


/*  gets */
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/login.html',(req,res)=>{
    res.render('/login',{Message:""});
});

app.get('/signup.html',function(req,res){  
    res.render("/signup",{Message : ""});
});

app.get('/userjobslist',(req,res)=>{
    res.render('userJobs');
});

app.get('/description',(req,res)=>{
    res.render('description');
})
/*  posts  */

const userslist = [];
app.post("/login",function(req,res){
    let loggedUser = req.body.username;
    res.render('userpage',{user:loggedUser});
});



/*      admin     */

app.get("/admin",function(req,res){
    res.sendFile(__dirname+'/adminLogin.html');
});
app.post("/admin",function(req,res){
    res.render('adminIndex');
});
app.get("/adminIndex.html",(req,res)=>{
    res.render('adminIndex');
});

app.get("/applications.html",(req,res)=>{
    res.render('applications');
});
app.get("/manageJobs.html",(req,res)=>{
    res.render('manageJobs');
});



/*  users list  */

    /* New User - Signup */

app.post("/signup",function(req,res){
     
    const newuser = new User({
        userName: req.body.username,
        firstName: req.body.firstname,
        lastName: req.body.secondname,
        email: req.body.email,
        password: req.body.password
    });
    User.find({userName : req.body.username }).then(function(foundUsersList){
        if(foundUsersList.length === 0){
            console.log('User Added Successfully');
            newuser.save();
            res.render("/login",{Message:"User Added Successfully"});
        }else{
            console.log("User Existed try another user");
            res.redirect("/signup.html");
        }
    });
    
    
});

const usersSchema = new mongoose.Schema({
    userName : String,
    firstName : String,
    lastName : String,
    email : String,
    password : String
});

const User = mongoose.model('User',usersSchema);

    /*   admin users list  */ 

app.get("/usersList.html",(req,res)=>{
    User.find().then(function(foundUsersList){
        res.render('usersList',{ulists : foundUsersList});
    });
});