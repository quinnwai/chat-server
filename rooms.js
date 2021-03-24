let allRooms = [{
        "roomName": "hi",
        "roomPass": "vsvsv",
        "activeUsers": ["quinn", "avishal"],
        "bannedUsers": ["hi", "my", "name"]
        },
        {"roomName": "hi2",
        "roomPass": "2vsvsv",
        "activeUsers": ["quinn", "avishal"],
        "bannedUsers": ["my", "name"] },
    {"roomName": "hi2",
        "roomPass": "",
        "activeUsers": ["quinn", "avishal"],
        "bannedUsers": ["my", "name"] }]

for (let i = 0; i < allRooms.length; i++) {
 document.getElementById("availableRooms").innerHTML +=
'<button id = "room_' + i + '"' +' class = "roomButton">' + allRooms[i].roomName +  '</button>'
// document.getElementById("room_" + i).addEventListener()
}


allRooms.forEach(el => {
   
});

