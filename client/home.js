
function changeToRoom(){
    var userName = document.getElementById("username").value;
    var pfpUrl = document.getElementById("pfp-url").value;
    if(!isEmpty(userName)){
        window.location.href = "/room";
        sessionStorage.setItem("username", userName);
        if(!isEmpty(pfpUrl)){
            sessionStorage.setItem("pfpurl", pfpUrl);
        }else{
            sessionStorage.setItem("pfpurl", "rgthyju");
        }
    }
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}