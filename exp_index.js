const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer')
const fs = require('fs')
const path = require('path')

/*   Restapi   */
const jobsApi = require('./routes/jobsRoute');
const { log } = require('console');

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
    loggedUser = "Login"
    Job.find().then((foundJobslist)=>{
    
        res.render('index',{userslist:foundJobslist })
    
    })
});

app.post('/',async(req,res)=>{
    await Job.findOne({Job_id : req.body.job}).then((foundJob)=>{   
        apply_job=foundJob    
        qual = apply_job.Qualification.split('\r\n')
        roles = apply_job.Roles_Responsibilities.split('\r\n')
        desc = apply_job.Job_Description.split('\r\n')
        res.render('description',{user:loggedUser,jobdetails:foundJob,description: desc,qualification:qual,roles_responsibilities:roles});
    })
})

let signupMessage = "";
app.get('/signup',function(req,res){  
    res.render("signup",{message : signupMessage});
});

app.get('/about_us',(req,res)=>{
    console.log("about us: "+ loggedUser)

    res.render("about_us",{user:loggedUser})
})

app.get('/contact_us',(req,res)=>{
    console.log("conatact us: "+ loggedUser)

    res.render('contact_us',{user:loggedUser})
})
/*  search */

app.post("/search",async function(req,res){
    let searchkey =req.body.key;
    let data=await Job.find({Title:{$regex: searchkey,$options:'i'}})
    if (data.length == 0){
        res.render('userpage',{user: loggedUser,userslist:data, searchMessage : "No Jobs Found!"})
    }else{
        res.render('userpage',{user : loggedUser,userslist:data, searchMessage : ""})
    }
 });

 app.get('/userpage',(req,res)=>{
    if(loggedUser == "Login"){
        res.redirect('/')
    }else{
        Job.find().then((foundJobslist)=>{
            res.render('userpage',{user : loggedUser,userslist:foundJobslist,searchMessage : ""})
        })
    }
 })

/*      admin     */

/*  users page  */ 

/*   login  */

let loginMessage = "";
app.get('/login.html',(req,res)=>{
    res.render('login',{message: loginMessage});
});

let loggedUser = "Login";
app.post("/login",async function(req,res){
    await User.findOne({userName : req.body.username}).then((user_found)=>{    
        if (user_found){   
            loggedUser = user_found.userName
            try{        
                bcrypt.compare(req.body.password, user_found.password,function (err,result){   
                    if(result == true){
                        Job.find().then((foundJobslist)=>{
                            res.render('userpage',{user : loggedUser,userslist:foundJobslist,searchMessage : ""})
                        })
                    }else{
                        loginMessage = "Password doesn't match"
                        res.redirect('/login.html')
                    }
                })
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
                res.redirect('/signup');
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
            bcrypt.compare(req.body.adminpassword, user.adminPassword,async function (err,result){
                if(result == true){
                    const foundjobslist = await Job.find()
                    res.render('adminIndex',{jlist:foundjobslist})
                }else{
                    adminMessage = "Password is wrong!!"
                    res.redirect('/admin')
                }
            })
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

/*      admin Job delete options   */ 
app.post("/deletejob",async function(req,res){
    let job_id=req.body.job_deleteid;
    
    await Job.deleteOne({"Job_id":job_id})
    res.redirect("/adminIndex.html")
    
});
app.post("/editjob1",async function(req,res){
    let job_id=req.body.job_editid;
    let jobdetails=await Job.findOne({"Job_id":job_id})
    res.render('editJob',{jlist:jobdetails})
    
});
app.post("/editjob2",async function(req,res){
    
    let updatedjob = await Job.findOneAndUpdate(
        { Job_id:req.body.job_id},
        { $set:  {  Job_id : req.body.job_id,
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
           
        }},
      )
      
      res.redirect('adminIndex.html')
});


/*  getting description page jobtitle  */
let apply_job;
app.post("/userpage",async function(req,res){
    await Job.findOne({Job_id : req.body.job}).then((foundJob)=>{   
        apply_job=foundJob    
        qual = apply_job.Qualification.split('\r\n')
        roles = apply_job.Roles_Responsibilities.split('\r\n')
        desc = apply_job.Job_Description.split('\r\n')
        res.render('description',{user:loggedUser,jobdetails:foundJob,description: desc,qualification:qual,roles_responsibilities:roles});
    })

});
/*  getting description page jobtitle  */
let formMessage;
app.post("/description",async function(req,res){
    formMessage = "";
    console.log("description: "+ loggedUser)

    res.render('form',{job_tittle : apply_job.Title,user : loggedUser,message:formMessage})
    
});
 
/*  form  */ 
app.get('/form1',async function(req,res){
    console.log("form: "+ loggedUser)

    console.log(formMessage)
    res.render('form',{job_tittle: apply_job.Title,user : loggedUser,message:formMessage})
})

const applicationSchema = new mongoose.Schema({
    Job_id :Number,
    Job_Title : String,
    Username : String,
    Name: String,
    Email: String,
    Phone: Number,
    Address: String,
    Applied_date:String,
    Resume : String,
    Resume_Path : String,
    Resume_Mimetype : String,
    Status : String
});

const Application = mongoose.model('Application',applicationSchema);

const resumeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/resumes')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+"-"+Date.now()+"-"+file.originalname)
    }
})

  
const upload = multer({ storage: resumeStorage})

app.post("/form",upload.single('resume'),async function(req,res){
    const newappjob = new Application({
        Job_id : apply_job.Job_id,
        Job_Title : apply_job.Title,
        Username : loggedUser,
        Name : req.body.name,
        Email : req.body.email,
        Phone:req.body.Phonenumber,
        Address:req.body.Address,
        Applied_date:getDate(),
        Resume :req.file.filename,
        Resume_Path : req.file.path,
        Resume_Mimetype : req.file.mimetype,
        Status : "Not Reviewed"
    })
    await Application.find({Job_id:apply_job.Job_id,Username:loggedUser}).then((foundApplication)=>{
        if(foundApplication.length == 0){
            const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                formMessage = "Resume should be PDF ,Doc or Docx format"
                res.redirect('/form1')

            }else{ 
                newappjob.save();
                res.render('formsubmission')
            }
        }else{
            formMessage = "*You have already applied for this job , Please check your aplication status."
            res.redirect('/form1')
        }
    })
});

app.post("/formSubmission",(req,res)=>{
    res.redirect("/userpage")
})

/*    Manage JObs   */
let randomNum;
app.get("/manageJobs",async(req,res)=>{
    const min = 10000;
    const max = 99999;
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    await Job.find({Job_id : randomNum}).then((foundJob)=>{
        if (foundJob.length == 0){
            res.render('manageJobs',{random:randomNum});
        }else{
            res.redirect('/manageJobs')
        }
    })
    
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
    console.log(req.body)
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
    res.redirect('/manageJobs')
})


/*   user profile    */ 
let phonenum,address = "";
app.get('/userProfile',async(req,res)=>{
    if (loggedUser == "Login"){
        res.render('login',{message: loginMessage})
    }else{
        await User.findOne({userName : loggedUser}).then(function(foundUser){

        Application.find({Username : loggedUser}).then((foundApplications)=>{
            
            let fullName = foundUser.firstName + " " + foundUser.lastName
            res.render('userProfile',{user:loggedUser,
                                    name : fullName,
                                    email : foundUser.email,
                                    userapplist: foundApplications
                                    })
        })
    })
    }
    
})

app.get('/DeleteAccount/:username',async(req,res)=>{
    deleteUser = req.params.username
    await Application.deleteMany({Username:deleteUser}).then(async(err)=>{
        await User.deleteOne({userName:deleteUser})

    })
    loggedUser = "Login"
    res.redirect('/')
})


/*      admin applications   */ 

app.get("/applications.html",async (req,res)=>{
    await Application.find().then((foundApplications)=>{
        res.render('applications',{applist : foundApplications})
    })
    
});

app.get("/public/resumes/:resume",async(req,res)=>{
    const resume = req.params.resume
    const filepath = path.join(__dirname ,"/public/resumes/",resume)
    await Application.findOne({Resume : resume}).then((foundApplication)=>{
        if (foundApplication) {
            res.setHeader('Content-Type', foundApplication.Resume_Mimetype);
            // for display in browser and for download
            res.setHeader('Content-Disposition', 'inline; filename="' + resume + '"');
    
            const readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    })
})

app.post('/applications',async(req,res)=>{
    let del = await Application.findOneAndUpdate(
        { Job_id: req.body.job_id, Username : req.body.user_name },
        { $set: { Status: req.body.status_btn } },
        { new: true });
    res.redirect('/applications.html')
})


