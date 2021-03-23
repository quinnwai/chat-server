let user;

document.addEventListener('DOMContentLoaded', function(){
    document.getElementsByClassName("user")[0].getElementsByClassName("login")[0].addEventListener("click", function(){
        user = document.getElementById("username").value;

        //delete div class user
        $(".user").remove();
    });
});