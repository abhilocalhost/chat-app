const http = require('http')
const express = require('express')
const path = require('path')
const app = express()
const Filter = require('bad-words')
const {generateMessage, generateURL} = require('./utils/messages')
const server = http.createServer(app)
const socketio = require('socket.io')
//instance of socket.io to configure web socket with our server
const io = socketio(server)
const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/users')

const port = process.env.PORT || 8000
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
const welcome = "welcome to the new connection"

//when a socket.io get a new connection
io.on('connection',(socket)=>{
    console.log('web socket connection established')
   

    socket.on('join',({username,room}, callback)=>{

       const {error, user} = addUser({
            id: socket.id,
            username,
            room
        })
        if(error){
            return callback(error)
        }

        //joining a given chat room
        socket.join(user.room)
        
        socket.emit('message',generateMessage(welcome,user.username))
    
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username+' has joined'))
       
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)
        })
         //positive acknowledgement
        callback()
    })


    //FORM
    socket.on('formSubmission', (message,callback)=>{ 
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            //negative acknowledgment is send
            return callback('bad words not allow')
        }
    //sending to all connection 
    io.to(user.room).emit('message',generateMessage(message,user.username))
    //acknowledgment is send
      callback()
    })

    //LOCATION
    socket.on('sendLocation',(location,callback)=>{
        const user = getUser(socket.id)
        const loc = "https://google.com/maps?q="+ location.latitude+","+location.longitude
        io.to(user.room).emit('locationMessage',generateURL(loc, user.username))
        //acknowledgment is send
        callback()
    })

    //when a client disconnect 
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(user.username+' has left'))
       
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })
         
})

server.listen(port,()=>{
    console.log('server is running on port '+port)
})  