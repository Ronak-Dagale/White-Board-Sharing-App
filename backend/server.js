const express = require('express');
const app = express();
const httpServer = require("http").createServer(app); // Create an HTTP server using Express
const { Server } = require("socket.io");
const { addUser, removeUser, getUser } = require('./utils/users'); // Import the addUser function from a module

const io = new Server(httpServer); // Create a new instance of the Socket.IO server

// Necessary Routes
app.get("/", (req, res) => {
    res.send("hello by server"); // Handle the root route
});

let roomIdglobal, imgURLglobal;

io.on("connection", (socket) => {
    console.log("User connected"); // Log when a user connects

    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data;

        roomIdglobal = roomId; // Set the global roomId
        
        socket.join(roomId); // Join the socket to the specified room

        const users = addUser({ name, userId, roomId, host, presenter,socketId:socket.id }); // Add the user to the users list
        socket.emit("userIsJoined", { success: true, users }); // Emit an event to the connecting user
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcast",name  )
        socket.broadcast.to(roomId).emit("allUsers", users); // Broadcast the updated users list to all users in the room
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
            imgURL: imgURLglobal, // Broadcast the current whiteboard image URL
        });
    });

    socket.on("whiteboardData", (data) => {
        imgURLglobal = data; // Update the global whiteboard image URL
        socket.broadcast.to(roomIdglobal).emit("whiteBoardDataResponse", {
            imgURL: data, // Broadcast the updated whiteboard image URL to all users in the room
        });
    });

    socket.on("message", (data) => {
        const { message } = data;
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(roomIdglobal).emit("messageResponse", { message, name: user.name });
            removeUser(socket.id); // Moved after emitting the message
        }
    });
    socket.on("disconnect",()=>{
        const user=getUser(socket.id)
       
        if(user)
        {
            removeUser(socket.id)
            // console.log(user)
            socket.broadcast.to(roomIdglobal).emit("userleftMessageBroadcast",user.name)
        }
       
    })
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log("Server running on port", port)); // Start the server and listen on the specified port
