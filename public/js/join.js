

var sessionStorageUser = document.querySelector("input[name='username']")
let joinBtn = document.querySelector(".joinBtn");


joinBtn.onclick=()=>{

    console.log("join.js script fired!")
    sessionStorage.setItem("storageUser",sessionStorageUser.value)
}



