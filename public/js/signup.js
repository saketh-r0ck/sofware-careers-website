
function validateForm() {
  const form = document.querySelector('#signupform');
  const firstNameInput = document.querySelector('#firstname');
  const lastNameInput = document.querySelector('#lastname');
  const userNameInput = document.querySelector('#username');

  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const confirmpasswordInput = document.querySelector('#confirmpassword');
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const userName = userNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmpassword = confirmpasswordInput.value.trim();
  if (!/^[a-zA-Z]+$/i.test(firstName)) {
    
    document.getElementById("error-message").innerHTML= 'First name must contain only letters.';
    return false
  } else if (firstName.length < 2 || firstName.length > 20) {
    document.getElementById("error-message").innerHTML= 'First name must be between 2 and 20 characters long.';return false
  } 

  // Validate last name
    else if (!/^[a-zA-Z\s]+$/i.test(lastName)) {
    document.getElementById("error-message").innerHTML= 'Last name must contain only letters';
    return false
  } else if (lastName.length < 2 || lastName.length > 20) {
    document.getElementById("error-message").innerHTML='Last name must be between 2 and 20 characters long.';
    return false
  } 
  else if (!/^[a-zA-Z0-9_\s]+$/i.test(userName)) {
    document.getElementById("error-message").innerHTML='User name should contain only alpha-numeric and underscore .';
     return false
  } else if (userName.length < 2 || userName.length > 20) {
    document.getElementById("error-message").innerHTML= 'User Name must be between 2 and 20 characters long.'; return false
  }
  // Validate email
 
   else if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("error-message").innerHTML= 'Email is invalid.';
    return false
  } 
  // Validate password
 else if (password.length < 6 || password.length > 20) {
    document.getElementById("error-message").innerHTML= 'Password must be between 6 and 20 characters long.';
    return false
  } 
  else if(confirmpassword!==password){
    document.getElementById("error-message").innerHTML= 'Password is not matched';
    return false
  }
 
  else {
    alert("You have succesfully registered."); 
    document.getElementById("signupform").method="post"
    document.getElementById("signupform").action="/signup"
  }
}