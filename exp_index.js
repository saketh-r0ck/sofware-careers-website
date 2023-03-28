const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;


mongoose.connect('mongodb://localhost:27017/careersdb',{useNewUrlParser: true})
    .then(() => {
        console.log("MongoDb connection open !!");
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



let signupMessage = "";
app.get('/signup.html',function(req,res){  
    res.render("signup",{message : signupMessage});
});

app.get('/userjobslist',(req,res)=>{
    res.render('userJobs');
});

app.get('/description',(req,res)=>{
    res.render('description');
})
/*  posts  */





/*      admin     */



app.get("/adminIndex.html",(req,res)=>{
    res.render('adminIndex');
});

app.get("/applications.html",(req,res)=>{
    res.render('applications');
});
app.get("/manageJobs.html",(req,res)=>{
    res.render('manageJobs');
});


/*   login  */

let loginMessage = "";
app.get('/login.html',(req,res)=>{
    res.render('login',{message: loginMessage});
});


app.post("/login",async function(req,res){
    let loggedUser = req.body.username;
    await User.findOne({userName : loggedUser}).then((user_found)=>{    
        if (user_found){   
            try{        
                if(bcrypt.compare(req.body.password, user_found.password)){
                    res.render('userpage',{user : req.body.username})
                }else{
                    loginMessage = "Password doesn't match"
                    res.redirect('/login.html')
                }
            }catch(error){
                return res.status(500).send()
            } 
        }else{
            loginMessage = "User doesn't exist. Register a new account"
            res.redirect("/login.html")
        }    
    })
});

/*  Signup and users list  */

    /* New User - Signup */
    const usersSchema = new mongoose.Schema({
        userName : String,
        firstName : String,
        lastName : String,
        email : String,
        password : String
    });
    
    const User = mongoose.model('User',usersSchema);

    app.post("/signup",async function(req,res){      
        
        
        /* encrypting password  */ 
        const admin_password = req.body.password
        const hashed_password = await bcrypt.hash(admin_password,10)
        
        const newuser = new User({
            userName: req.body.username,
            firstName: req.body.firstname,
            lastName: req.body.secondname,
            email: req.body.email,
            password : hashed_password
        }); 
        
        User.find({userName : req.body.username }).then(function(foundUsersList){
            if(foundUsersList.length === 0){
                loginMessage = 'User Added Successfully';
                newuser.save();
                res.redirect("/login.html");
            }else{
                signupMessage = "User Existed try another user";
                res.redirect('/signup.html');
            }
        });
        
    });

    /*   admin users list  */ 

    app.get("/usersList.html",(req,res)=>{
        User.find().then(function(foundUsersList){
            res.render('usersList',{ulists : foundUsersList});
        });
    });



/*  Admin Login  */ 
let adminMessage = ""

app.get("/admin",function(req,res){
    res.render('adminLogin',{message: adminMessage});
});

const adminSchema = new mongoose.Schema({
    adminUserName : String,
    adminPassword : String
});

const Admin = mongoose.model('Admin',adminSchema);
const admin_password = "admin"

bcrypt.hash(admin_password,10,(err,hash)=>{
    if (err) return err;
    const webAdmin = new Admin({adminUserName:"admin",adminPassword: hash});
    //webAdmin.save();
})


app.post("/admin", async function(req,res){
    
    const user = await Admin.findOne({adminUserName: req.body.adminusername});
    if (user){
        try{
            if(bcrypt.compare(req.body.adminpassword, user.adminPassword)){
                res.render('adminIndex')
            }else{
                adminMessage = "Password doesn't match"
                res.redirect('/admin')
            }
        }catch(error){
            res.status(500).send()
        }
    }else{
        adminMessage = "Username is wrong!!";
        res.redirect('/admin');
    }
   
});


/*  form  */ 

app.get('/form',(req,res)=>{
    
    res.render('form');
})

app.post('/form',(req,res)=>{
    console.log(req.body)
})