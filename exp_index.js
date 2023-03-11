const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

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
    res.sendFile(__dirname+'/login.html');
});

app.get('/signup.html',function(req,res){  
    res.sendFile(__dirname+"/signup.html");
});

app.get('/userjobslist',(req,res)=>{
    res.render('userJobs');
});
/*  posts  */

const userslist = [];
app.post("/login",function(req,res){
    let loggedUser = req.body.username;
    res.render('userpage',{user:loggedUser});
});

app.post("/signup",function(req,res){
    userslist.push(req.body);
    res.sendFile(__dirname+"/login.html");
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
app.get("/usersList.html",(req,res)=>{
    
    res.render('usersList',{ulists:userslist});
});
app.get("/applications.html",(req,res)=>{
    res.render('applications');
});
app.get("/manageJobs.html",(req,res)=>{
    res.render('manageJobs');
});
