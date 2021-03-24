let user = "quinn";
let allRooms = [
        { "roomName": "hi",
        "roomPass": "vsvsv",
        "activeUsers": ["quinn", "avishal"],
        "creator": "hi",
        "bannedUsers": ["hi", "my", "name"]
        },
        {"roomName": "hi2",
        "roomPass": "",
        "creator": "hi",
        "activeUsers": ["quinn", "avishal"],
        "bannedUsers": ["my", "name"] },
    {"roomName": "hi2",
        "roomPass": "",
        "creator": "avishal",
        "activeUsers": ["quinn", "avishal"],
        "bannedUsers": ["my", "name", "quinn"] }]

for (let i = 0; i < allRooms.length; i++) {
 document.getElementById("availableRooms").innerHTML +=
'<button id = "room_' + i + '"' +' class = "roomButton">' + allRooms[i].roomName +  '</button>';
}
for (let i = 0; i < allRooms.length; i++) {
document.getElementById("room_" + i).addEventListener("click", function(event){
    console.log("hi");
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

