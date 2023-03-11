const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use('/Admin',express.static(path.join(__dirname,'Admin/public2')));
app.set('view engine','ejs');

app.listen(port,function(){
    console.log('Listening on port' + port);
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
app.post("/login.html",function(req,res){
    username = req.body.username;
    res.render('userpage',{user:username});
});

app.post("/signup.html",function(req,res){
    res.sendFile(__dirname+"/login.html");
    
});

app.get("/admin",function(req,res){
    res.sendFile(__dirname+"/Admin/adminLogin.html");
});