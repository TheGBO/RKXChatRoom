var socket = io(window.location.host);

var myname = sessionStorage.getItem("username").toString();
var mypfp = sessionStorage.getItem("pfpurl").toString();
var inputChat = document.getElementById("input-box-chat");

inputChat.addEventListener("keydown", (e) => {
    sendMessage(e);
});

socket.on('receive-message', (data) => {
    if(document.hidden){
        document.getElementById('notification').play()
    }
    console.log(data);
    createMessage(data);
});

socket.on('load-messages', (arr) => {
    arr.forEach(element => {
        if(element !== null){
            createMessage(element);
        }
    });
});

socket.on('update-member-count', (membercount) => {
    document.getElementById('member-count').innerHTML = `Online clients : ${membercount}`;
});

function sendMessage(e){
    if (e.keyCode == 13){
        console.log(e.keyCode);
        if(inputChat.value != ""){
            console.log("sent");
            let data = {"content":inputChat.value,"name":myname,"pfp":mypfp}
            socket.emit('send-message',data);
            //createMessage(data);
            inputChat.value = "";
        }
    }
}

function createMessage(data){
    var chatBox = document.getElementsByClassName("chat-messages")[0];
    chatBox.innerHTML += 
    `
    <div class="user-post">
        <img class="pfp" src=${data.pfp} onerror="this.src='favicon.ico'"/>
        <h1 class="user-name">${data.name}</h1>
        <p class="user-message">
            ${data.content}
        </p>
    </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
    
}