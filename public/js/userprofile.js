
let x = document.getElementsByClassName('status')
for(let i=0;i<x.length;i++) {
    if(x[i].innerHTML == "Rejected"){
        x[i].style.color = "red";
    }else if(x[i].innerHTML == "Accepted"){
        x[i].style.color = "#38E54D";
    }else{
        x[i].style.color = "#FFBA00";
    }
}