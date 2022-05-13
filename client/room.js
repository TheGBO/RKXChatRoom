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
    var matches = data.content.match(/\bhttps?:\/\/\S+/gi);
    var embedThing = "";
    if(matches){
        var embedUrl = matches[0];
    
        console.log(checkUrlContentType(embedUrl));
        embedThing = `<a href="${embedUrl}">${embedUrl}</a><br>`;
        embedThing += `<img class="embed-image" src="${embedUrl}" alt=""></img><br>`;
        console.log("image");
    }

    chatBox.innerHTML += 
    `
    <div class="user-post">
        <img class="pfp" src=${data.pfp} onerror="this.src='favicon.ico'"/>
        <h1 class="user-name">${data.name}</h1>
        <p class="user-message">
            ${data.content}
            <br>
            ${embedThing}
        </p>

    </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
    
}

function checkUrlContentType(url){
    var xhttp = new XMLHttpRequest();
    xhttp.open('HEAD', url);
    xhttp.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            console.log(this.status);
            return this.getResponseHeader("Content-Type");
        }
    };
    xhttp.send();
}