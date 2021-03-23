/*
Authenticating user with username and password
*/

// test array
// let login_dict = {"quinnwai" : "quinniewaiwai", " " : "namename", "avishal" : "vishaliscool"};
// let users_set = new Set(["quinnwai", "firstlast", "avishal"]);

let username;

// validate username and password given
let login_button = document.getElementsByClassName("user")[0].getElementsByClassName("login")[0];

login_button.addEventListener('click', function(){
    username = document.getElementById("username");
});