// allRooms and liveUsers initalized
let allRooms = [];
let liveUsers = [];

// Require the packages we will use:
const http = require("http"),
fs = require("fs");

// setup for express to enable styling
const port = 3456;
const file = "main.html";
var express = require('express');

const app = express();
var path = require('path');
const { userInfo } = require("os");
app.use(express.static((__dirname)));
console.log(__dirname);

// Listen for HTTP connections for main.html on port 3456:
const server = http.createServer(app);

server.listen(port || process.env.PORT);
console.log("Server running on port", port);


// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
    wsEngine: 'ws'
});

// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);
io.sockets.on("connection", function (socket) {
    // This callback runs when a new Socket.IO connection is established.

    // Add to list of users with ids
    socket.on('store_username_with_id', function (data) {
        let usr = data["username"];

        if(!liveUsers.includes(usr)){
            liveUsers[usr] = socket.id;
        };
        console.log("liveUsers:", liveUsers);
    });

    socket.on('add_room_to_server', function (data) {

        console.log("room name: " + data["room_name"]); // log it to the Node.JS output (actual console)
        console.log("admin: " + data["admin"]);

        //check if password is available
        let isPwd;
        let pwd;
        if(data["password"] == undefined){
            isPwd = false;
            pwd = ""; //TODO: make sure no password case works
        }
        else{
            isPwd = true;
            pwd = data["password"];
            console.log("Password: " + data["password"]);
        }

        // add to all rooms
        allRooms.push({  "roomName": data["room_name"], "roomPass": pwd,
        hasPass: isPwd, creator: data["admin"], "activeUsers": [],  "bannedUsers": []  });
        console.log("allRooms:", allRooms);

        // get relevant data from allRooms for button
        let newList = sendList();
        
        //send relevant data back to update list
        io.sockets.emit("update_list_to_client", newList);
    });
    
    // QW: This is done so that 1 message goes to everyone's socket, so check user name first before emitting
    socket.on('message_to_server', function (data) {
        // This callback runs when the server receives a new message from the client.

        console.log("message: " + data["message"]); // log it to the Node.JS output (actual console)
        console.log("author: " + data["author"]);

        //if recipient, send with recipient. Else, send just the room id, message, and author
        if(data["receiver"] == undefined){
            console.log("global message");
            io.sockets.emit("message_to_client", { room_id: data["room_id"], message: data["message"], author: data["author"] }); // broadcast the message to other users
        }
        else{
            console.log("private message to " + data["receiver"]);
            io.sockets.emit("message_to_client", { room_id: data["room_id"], message: data["message"], author: data["author"], receiver: data["receiver"] });
        }
    });


    socket.on('send_button_presser_to_server', function (data) {
        //push relevant data (room name and password) onto list
        console.log(data["author"], "is trying to enter the room");
        socket.emit("send_button_presser_to_client", {room_id: data["room_id"], author: data["author"]});
    });

    //receive password
    socket.on('send_pass_to_server', function (data) {
        //push relevant data (room name and password) onto list
        console.log("send pass to server");
        
        if(data["password"] === allRooms[data["room_id"]].roomPass){
            socket.emit("pass_validator_to_client",{isPass: true, room_id: data["room_id"], author: data["author"]});
        }
        else {
            socket.emit("pass_validator_to_client",{isPass: false, room_id: data["room_id"], author: data["author"]});
        }
    });

    // processing request from server to get room list 
    socket.on('get_list_to_server', function () {
        //push relevant data (room name and password) onto list
        let data = sendList();

        io.sockets.emit("send_list_to_client", data);
    });

    socket.on('get_room_to_server', function (data) {
        // Adds given user to list if not already in list
        console.log('get_room_to_server');
        console.log("room id", data["room_id"]);
        console.log("room: ", allRooms[data["room_id"]]);
        if(!(allRooms[data["room_id"]].activeUsers.includes(data["author"]))){
            allRooms[data["room_id"]].activeUsers.push(data["author"]);
        }

        // check if author is admin and add admin privileges
        let isAdmin = false;
        if (data["author"] == allRooms[data["room_id"]].creator){
            console.log(data["author"], "is the creator");
            isAdmin = true;
        }

        // send room data
        let response = {room_name: allRooms[data["room_id"]].roomName, is_admin: isAdmin, active_users: allRooms[data["room_id"]].activeUsers, receiver: data["author"]};
        console.log("sending room info : ");
        socket.emit("send_room_to_client", response);

        // update active users for users already in room
        io.sockets.emit('update_active_users', {room_id: data["room_id"], active_users: allRooms[data["room_id"]].activeUsers});
    });

    socket.on("remove_active_user", function (data) {
        // create list of old and new active users
        let oldUsers = allRooms[data["room_id"]].activeUsers;
        let newUsers = [];

        // copy all users but the user leaving the room into new array
        for(let i = 0; i < oldUsers.length; i++){
            if(oldUsers[i] != data["author"]){
                newUsers.push(oldUsers[i]);
            }
        }

        // overwrite activeUsers for the current room
        allRooms[data["room_id"]].activeUsers = newUsers;

        console.log("new users:", allRooms[data["room_id"]].activeUsers);

        //update everyone in the room's active users
        io.sockets.emit('update_active_users', {room_id: data["room_id"], active_users: newUsers});
    });   

    socket.on("add_banned_user", function (data) {
        //ensure request coming from creator of room before pushing banned user
        if(data["author"] == allRooms[data["room_id"]].creator){
            allRooms[data["room_id"]].bannedUsers.push(data["banned_user"]);   
        }

        console.log("new banned users: ", allRooms[data["room_id"]].bannedUsers);
    });
    
    // forwad request data to all clients
    socket.on("clear_room_to_server", function (data) {
        io.sockets.emit("clear_room_to_client", data);
    });

    // refresh rooms for particular client
    socket.on("refresh_rooms_to_server", function (){
        socket.emit("refresh_rooms_to_client", sendList());
    });

    // remove deleted room from allRooms and send back updated list
    socket.on("remove_room_to_server", function (data) {
        console.log("entered remove room to server with data", data);

        //check each room
        for(let i = 0; i < allRooms.length; i++){
            // if right credentials, then delete and refresh all rooms
            // otherwise, update appropriate error message

            console.log(allRooms[i].roomName, data["room_name"], allRooms[i].roomName == data["room_name"]);
            if(allRooms[i].roomName == data["room_name"]){
                
                console.log(allRooms[i].creator, data["author"], allRooms[i].creator == data["author"]);
                if(allRooms[i].creator == data["author"]){
                    //store active users for later
                    let activeUsers = allRooms[i].activeUsers;
                    
                    // create new object to update allRooms
                    let newRooms = [];
                    for(let i = 0; i < allRooms.length; i++){
                        if(allRooms[i].roomName != data["room_name"]){
                            newRooms.push(allRooms[i]);
                        }
                    }
                    allRooms = newRooms;

                    console.log("deletion... updated allRooms:", allRooms);

                    io.sockets.emit("refresh_rooms_to_client", sendList());

                    // remove messaging area for all active users
                    for(let i = 0; i < activeUsers.length; i++){
                        let user = activeUsers[i];
                        io.to(liveUsers[user]).emit("clear_room_to_client", {target: user, purpose: ""} );
                    }
                }
            }
        }
        
    });
});

function sendList(){
    let data = [];
    for (let i = 0; i < allRooms.length; i++) {
        let room = { room_name: allRooms[i].roomName, has_pass: allRooms[i].hasPass, 
            bannedUsers: allRooms[i].bannedUsers}
        console.log(room);
        data.push(room);
    }
    return data;
}