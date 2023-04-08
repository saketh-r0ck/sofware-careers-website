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

app.get('/userjobslist',(req,res)=>{
    res.render('userJobs');
});

app.get('/description',(req,res)=>{
    res.render('description',{user:loggedUser});
})

/*  posts  */





/*      admin     */



app.get("/adminIndex.html",(req,res)=>{
    res.render('adminIndex');
});

app.get("/applications.html",(req,res)=>{
    res.render('applications');
});

/*  users page  */ 



/*   login  */

let loginMessage = "";
app.get('/login.html',(req,res)=>{
    res.render('login',{message: loginMessage});
});

let loggedUser;

userlist=[{jobtitle:"SOFTWARE DEVELOPER",
jobshowdescription:"A software developer is a professional who is responsible for designing, creating, testing and maintaining computer software..",
jobdescription:"A software developer is a professional who is responsible for designing, creating, testing and maintaining computer software. They typically work with programming languages such as Java, C++, Python, and Ruby, and use various software development tools and platforms to create software applications that meet the needs of their clients or organizations. Software developers also collaborate with other professionals such as project managers, quality assurance testers, and technical writers to ensure that the software they create is user-friendly, reliable, and efficient.",
salary:"90k",
experience:"5 years",
location:"Mumbai"},
{jobtitle:"DATA SCIENTIST",
jobshowdescription:"A data scientist is responsible for analyzing large and complex data sets to extract insights and trends..",
jobdescription:"A data scientist is responsible for analyzing large and complex data sets to extract insights and trends. They use statistical analysis, machine learning algorithms, and data visualization tools to identify patterns and make predictions about future trends. Data scientists work with a variety of data sources, including structured and unstructured data, and use programming languages such as Python, R, and SQL to manipulate and analyze the data. They also collaborate with other team members, such as business analysts and software developers, to develop data-driven solutions to business problems.",
salary:"70k",
experience:"4 years",
location:"Hyderabad"},
{jobtitle:"DATABASE ADMINISTRATOR",
jobshowdescription:" A database administrator (DBA) is responsible for managing the performance, security, and availability of databases..",
jobdescription:" A database administrator (DBA) is responsible for managing the performance, security, and availability of databases. They work with database management systems (DBMS) such as Oracle, SQL Server, and MySQL to create and manage databases. They ensure that databases are backed up, recoverable, and secure. They also monitor database performance and optimize database design to improve performance. They work with developers to ensure that databases are designed to meet application requirements.",
salary:"80k",
experience:"6 years",
location:"Delhi"}
]
app.post("/login",async function(req,res){
    loggedUser = req.body.username;
    await User.findOne({userName : loggedUser}).then((user_found)=>{    
        if (user_found){   
            try{        
                if(bcrypt.compare(req.body.password, user_found.password)){
                    res.render('userpage',{user : req.body.username,userslist:userlist})
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

app.post('/form.html',(req,res)=>{
    
    console.log(req.body)
})

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
    let date_time =  (date + " " + month + " " + year + " " + hours + ":" + minutes + ":" + seconds);    
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

app.get('/userProfile',async(req,res)=>{
    await User.findOne({userName : loggedUser}).then(function(foundUser){
        res.render('userProfile',{user:loggedUser,name:foundUser.firstName+" "+foundUser.lastName,email:foundUser.email})
    })
    
})