
let x = document.getElementById('jobform')

function validateForm(){
    console.log(x)
    const resumefile = document.getElementById('file');
    const allowedExtension = /(\.pdf|\.doc|\.docx)$/i;
    const file_error = document.getElementById('file_error');
    if(!allowedExtension.exec(resumefile)){
        file_error.innerHTML = "Invalid file";
        return false;
    }else{
        x.method="post";
        x.action="/form";
    }
}