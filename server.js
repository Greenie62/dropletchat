const express = require('express');
const fileUpload = require('express-fileupload');
const IO = require('socket.io');
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = IO(server)


const PORT = 3005;

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))


app.get('/',(req,res)=>{
    res.redirect("/join")
})

app.get('/join',(req,res)=>{
    res.sendFile(path.join(__dirname, "public/join.html"))
})

app.get('/chat/',(req,res)=>{
    res.sendFile(path.join(__dirname, "public/chat.html"))
})

app.post('/join',(req,res)=>{
    console.log(req.body);
    res.redirect(`/chat?name=${req.body.username}&room=${req.body.room}`)
})



let users = [];

let badwords=['fuck','shit','asshole','dickhead','fucker','motherfucker']
const isBad = (word) => badwords.indexOf(word) === -1;

io.on("connection",socket=>{
    console.log(socket.id);

    socket.on('join',({username,room})=>{

        let user = {id:socket.id,username,room};
        console.log(user)
        users.push(user);

        socket.join(user.room);

        socket.emit('message',{user:"admin",text:`${user.username}, welcome to the ${user.room} chatroom!`})
        socket.broadcast.to(user.room).emit("message",{user:"admin",text:`${user.username} has joined the chat! :)`})
        io.to(user.room).emit("roomData",{room:user.room,users})
    })

    socket.on("sendMessage",message=>{
        let user = users.find(u=>u.id === socket.id);
        console.log("SENDER:",user.username);
        console.log("Message: " + message)
        let verdict = message.split(" ").some(isBad)
        if(verdict){
            io.to(user.room).emit("message",{user:'admin',text:`${user.username}, you've been cited for a improper language!`})
        }

        io.to(user.room).emit("message",{user:user.username,text:message})
    })



    socket.on('disconnect',()=>{
        let idx = users.findIndex(u=>u.id === socket.id)
        let user = users.splice(idx,1)
        console.log("exitedUser:",user)
        console.log("client disconnected!")

        io.to(user.room).emit("message",{user:'admin',text:`${user.name} has left the chat!`})
    })
})




server.listen(PORT,console.log(`Logged onto port ${PORT}, ${process.env.USER}.`))