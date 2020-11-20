let messageContainer = document.querySelector(".messageContainer")
let messageBtn = document.querySelector(".messageBtn");
let messageInput = document.querySelector("input[name='message']");


let roomDOM = document.querySelector(".room");
let usersDOM = document.querySelector(".users")

let socket = io()
let data = window.location.search.split("=");
let username = data[1].split("&")[0];
let room = data[2]
let storageUser = sessionStorage.getItem("storageUser")


console.log(username,room)



socket.emit("join",{username,room})


socket.on('message',message=>{
    let messageDiv = document.createElement("div");
    messageDiv.className="message-div";
    let h5Message = document.createElement('h5');
    let pAuthor = document.createElement("p");

    h5Message.className='h5Message';
    pAuthor.className='pAuthor';

    if(storageUser === message.user){
        messageDiv.classList.add("flex-start")
    }
    else{
        messageDiv.classList.add("flex-end")

    }

    h5Message.textContent=message.text;
    pAuthor.textContent=` - ${message.user}`

    messageDiv.appendChild(h5Message)
    messageDiv.appendChild(pAuthor)

    messageContainer.appendChild(messageDiv)
})




socket.on('roomData',data=>{

    console.log(data)
    usersDOM.innerHTML = data.users.length;
    roomDOM.innerHTML = data.room
})




messageBtn.onclick=()=>{
    console.log(messageInput.value)

    socket.emit('sendMessage',messageInput.value)
}