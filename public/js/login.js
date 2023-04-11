var x = document.getElementById("jobform");
x.addEventListener('submit',logged);

function logged(){
    alert("You have succesfully logged in.");
}


// validate user login form
function validateForm() {
    const form = document.querySelector('#login-form');
    const userNameInput = document.querySelector('#username');
  
    const passwordInput = document.querySelector('#password');
    const userName = userNameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!/^[a-zA-Z0-9_\s]+$/i.test(userName)) {
      document.getElementById("error-message").innerHTML='User name should contain only alpha-numeric and underscore .'
       return false
    }
    else {

      document.getElementById("login-form").method="post"
      document.getElementById("login-form").action="/login"
    }
  }

//   validate adminlogin form
function validateform() {
    const form = document.querySelector('#admin-form');
    const userNameInput = document.querySelector('#adminusername');
  
    const passwordInput = document.querySelector('#adminpassword');
    const userName = userNameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!/^[a-zA-Z\s]+$/i.test(userName)) {
      document.getElementById("error-message").innerHTML='user name must contain only letters.'
       return false
    } else if (userName.length < 2 || userName.length > 20) {
      document.getElementById("error-message").innerHTML= 'User Name must be between 2 and 20 characters long.'; return false
    }
   
    else {
    document.getElementById("admin-form").method="post"
    document.getElementById("admin-form").action="/admin"
    }
  }