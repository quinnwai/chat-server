// allRooms test cases (TODO: start as empty once tested)
let allRooms = [
    { "roomName": "hi",
    "roomPass": "vsvsv",
    "hasPass": true,
    "activeUsers": ["quinn", "avishal"],
    "creator": "hi",
    "bannedUsers": ["hi", "my", "name"]
    },
    {"roomName": "hi2",
    "roomPass": "",
    "hasPass": false,
    "creator": "hi",
    "activeUsers": ["quinn", "avishal"],
    "bannedUsers": ["my", "name"] },
{"roomName": "hi2",
    "roomPass": "",
    "hasPass": false,
    "creator": "avishal",
    "activeUsers": ["quinn", "avishal"],
    "bannedUsers": ["my", "name", "quinn"] }]

// Require the packages we will use:
const http = require("http"),
    fs = require("fs");

const port = 3456;
const file = "main.html";
// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html, on port 3456:
const server = http.createServer(function (req, res) {
    // This callback runs when a new connection is made to our HTTP server.

    fs.readFile(file, function (err, data) {
        // This callback runs when the client.html file has been read from the filesystem.

        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });

});
server.listen(port);
console.log("Server running on port", port);


// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
    wsEngine: 'ws'
});

// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);
io.sockets.on("connection", function (socket) {
    // This callback runs when a new Socket.IO connection is established.
    
    // QW: This is done so that 1 message goes to everyone's socket, so check user name first before emitting
    socket.on('message_to_server', function (data) {
        // This callback runs when the server receives a new message from the client.

        console.log("message: " + data["message"]); // log it to the Node.JS output (actual console)
        console.log("author: " + data["author"]);

        if(data["receiver"] == undefined){
            console.log("global message");
            io.sockets.emit("message_to_client", { message: data["message"], author: data["author"] }); // broadcast the message to other users
        }
        else{
            console.log("private message to " + data["receiver"]);
            io.sockets.emit("message_to_client", { message: data["message"], author: data["author"], receiver: data["receiver"] }); // broadcast the message to other users
        }
    });
    //recieve password
        socket.on('send_pass_to_server', function (data) {
        //push relevant data (room name and password) onto list
        
        if(data["password"] === allRooms[data["id"]].roomPass){
            io.sockets.emit("pass_validator_to_client",{isPass: true, author: data["author"]});
        }
        else {
            io.sockets.emit("pass_validator_to_client",{isPass: false, author: data["author"]});
        }
    });
    
    socket.on('send_button_presser_to_server', function (data) {
        //push relevant data (room name and password) onto list
        console.log(data);
        console.log(data["author"]);
        io.sockets.emit("send_button_presser_to_client", {author: data["author"]})
    });

    // receiving message from 
    socket.on('get_list_to_server', function () {
        //push relevant data (room name and password) onto list

        let data = [];
        for (let i = 0; i < allRooms.length; i++) {
            let room = { room_name: allRooms[i].roomName, has_pass: allRooms[i].hasPass, 
                bannedUsers: allRooms[i].bannedUsers}
            console.log(room);
            data.push(room);
        }

        console.log("data... " + data);
        io.sockets.emit("send_list_to_client", data);
    });

    socket.on('get_room_to_server', function (data) {
        let response = {active_users: allRooms[data["room_id"]].activeUsers, receiver: data["author"]};
        io.sockets.emit("send_room_to_client", response);
    });
});
