
function changeToRoom(){
    var userName = document.getElementById("username").value;
    if(!isEmpty(userName)){
        window.location.href = "/room";
        sessionStorage.setItem("username", userName);
    }
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}