const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/*   Restapi   */
const jobsApi = require('./routes/jobsRoute')

const app = express();
const port = 3000;

app.use('/jobs',jobsApi)

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




/*  search */

app.post("/search",async function(req,res){
    let searchkey =req.body.key;
    let data=await Job.find({Title:{$regex: searchkey,$options:'i'}})
    res.render('userpage',{user : loggedUser,userslist:data})
 });


/*      admin     */



/*  users page  */ 



/*   login  */

let loginMessage = "";
app.get('/login.html',(req,res)=>{
    res.render('login',{message: loginMessage});
});

let loggedUser;
app.post("/login",async function(req,res){
    await User.findOne({userName : req.body.username}).then((user_found)=>{    
        if (user_found){   
            loggedUser = user_found.userName
            try{        
                if(bcrypt.compare(req.body.password, user_found.password)){
                Job.find().then((foundJobslist)=>{
                        res.render('userpage',{user : loggedUser,userslist:foundJobslist})
                    })
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
            lastName: req.body.lastname,
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
                const foundjobslist = await Job.find()
                res.render('adminIndex',{jlist:foundjobslist})
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
/*    Admin Jobs list  */ 
app.get("/adminIndex.html",async (req,res)=>{
    await Job.find().then((foundJobslist)=>{
        res.render('adminIndex',{jlist:foundJobslist});
    })
    
});


/*  getting description page jobtitle  */
let apply_job;
app.post("/userpage",async function(req,res){
    
    await Job.findOne({Job_id : req.body.job}).then((foundJob)=>{   
        apply_job=foundJob    
        res.render('description',{user:loggedUser,jobdetails:foundJob});
    })

});
/*  getting description page jobtitle  */

app.post("/description",async function(req,res){
    
    res.render('form',{job_tittle : apply_job.Title,user : loggedUser})
    
});
 
/*  form  */ 

const applicationSchema = new mongoose.Schema({
    Job_id :Number,
    Job_Title : String,
    Username : String,
    Name: String,
    Email: String,
    Phone: Number,
    Address: String,
    Applied_date:String,
    Status : String
});
   

const Application = mongoose.model('Application',applicationSchema);
app.post("/form",async function(req,res){
    const newappjob = new Application({
        Job_id : apply_job.Job_id,
        Job_Title : apply_job.Title,
        Username : loggedUser,
        Name : req.body.name,
        Email : req.body.email,
        Phone:req.body.Phonenumber,
        Address:req.body.Address,
        Applied_date:getDate(),
        Status : "Not Reviewed"
    })
    newappjob.save();
});

/*    Manage JObs   */
let randomNum;
app.get("/manageJobs",(req,res)=>{
    const min = 10000;
    const max = 99999;
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    res.render('manageJobs',{random:randomNum});
});

const jobsSchema = new mongoose.Schema({
    Job_id : Number,
    Posted_Date : String,
    Title : String,
    Category : String,
    No_Of_Positions : String,
    Experience :String,
    Salary : String,
    Employment_Type : String,
    Location : String,
    Job_Description : String,
    Qualification : String,
    Roles_Responsibilities : String
});

const Job = mongoose.model('Job',jobsSchema)

function getDate(){

    const date_ob = new Date();  
    let date = ("0" + date_ob.getDate()).slice(-2); // current date
    let month = date_ob.toLocaleString('default', { month: 'short' });    // current month
    let year = date_ob.getFullYear();   // current year
    let hours = date_ob.getHours();     // current hours
    let minutes = date_ob.getMinutes(); // current minutes
    let seconds = date_ob.getSeconds(); // current seconds
    let date_time =  (date + " " + month + " " + year + " " + hours + ":" + minutes);    
    return date_time
}


app.post("/manageJobs",(req,res)=>{
    
    const newJob = new Job({
        Job_id : randomNum,
        Posted_Date :  getDate(),
        Title : req.body.job_title,
        Category : req.body.job_category,
        No_Of_Positions : req.body.positions,
        Experience : req.body.experience,
        Salary : req.body.salary,
        Employment_Type : req.body.employment_type,
        Location : req.body.location,
        Job_Description : req.body.job_description,
        Qualification : req.body.qualification,
        Roles_Responsibilities : req.body.roles_responsibilities
    })
    newJob.save()
  
})


/*   user profile    */ 
let phonenum,address = "";
app.get('/userProfile',async(req,res)=>{
    await User.findOne({userName : loggedUser}).then(function(foundUser){
        res.render('userProfile',{user:loggedUser,
                                  name:foundUser.firstName+" "+foundUser.lastName,
                                  email:foundUser.email,
                                  phone:phonenum,
                                  })
    })
    
})


/*      admin applications   */ 

app.get("/applications.html",async (req,res)=>{
    await Application.find().then((foundApplications)=>{
        res.render('applications',{applist : foundApplications})
    })
    
});