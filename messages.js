      var socketio = io.connect();
      socketio.on("message_to_client", function(data) {
         /* 
         2 different cases:
            1 ~ undefined receiver is a global message 
            2 ~ global user variable matches receiver is a private message
         */
         if(data["receiver"] == undefined || data["receiver"] == user){
            //Append an HR thematic break and the escaped HTML of the new message
            document.getElementById("chatlog").appendChild(document.createElement("hr"));

            //show author of message and content
            let msg = data['author']+": "+data['message'];
            document.getElementById("chatlog").appendChild(document.createTextNode(msg));
         }
         
      });

      async function sendMessage(){
         var msg = document.getElementById("message_input").value;
         var usr = document.getElementById("username_input").value;

         // send private message info over if needed
         if(usr != ""){
            // socketio.emit("message_to_server", {message: msg, author: user, receiver: usr });
            socketio.emit("message_to_server", {message: msg, author: user, receiver: usr });
         }
         else{
            socketio.emit("message_to_server", {message: msg, author: user });
         }   
      }