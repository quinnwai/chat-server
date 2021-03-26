
 document.getElementById().addEventListener("click", function (event) {
    for (int i = 0; i < allowedNodeEnvironmentFlags.length; ++i){
         document.getElementById("room_" + i).disabled = true;
    }
 }

  document.getElementById().addEventListener("click", function (event) {
    for (int i = 0; i < allowedNodeEnvironmentFlags.length; ++i){
         document.getElementById("room_" + i).disabled = false;
    }
 }