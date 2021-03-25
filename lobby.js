for (let i = 0; i < allRooms.length; i++) {
 document.getElementById("availableRooms").innerHTML +=
'<button id = "room_' + i + '"' +' class = "roomButton">' + allRooms[i].roomName +  '</button>';
}
for (let i = 0; i < allRooms.length; i++) {
document.getElementById("room_" + i).addEventListener("click", function(event){
    if (allRooms[i].bannedUsers.includes(user)){
        alert("Sorry, you have been banned from this room");
    }
    else{
        let pass = "";
        if (allRooms[i].roomPass !== ""){
        pass = prompt("Please enter the room's password to gain access");
        }
        if (pass == allRooms[i].roomPass) {
            alert("Access granted");
            //do the thing where he is redirected to room
        }   
    }
}, false);
}

