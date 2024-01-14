import './App.css';
import Forms from './components/forms';
import { Routes, Route } from 'react-router-dom';
import RoomaPage from './pages/roompage';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';


// Socket.io server configuration
const server = 'http://localhost:5000';
const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket'],
};

const socket = io(server, connectionOptions);

function App() {
  // State for storing user and users data
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Generate a unique user ID
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  };

  useEffect(() => {
    // Listen for "userIsJoined" event
    socket.on('userIsJoined', (data) => {
      if (data.success) {
        //console.log('userJoined123');
        setUsers(data.users);
      } else {
        console.log('problem');
      }
    });

    // Listen for "allUsers" event
    socket.on('allUsers', (data) => {
      setUsers(data);
    });

     socket.on("userJoinedMessageBroadcast",(data)=>{
      console.log(data)
      toast.info(`${data} Joined the Room`)
     })

      socket.on("userleftMessageBroadcast",(data)=>{
        console.log(`${data} left the Room`)
        toast.info(`${data} left the Room`)
      })
  }, []);

  return (
    <div className="container">
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route path="/:roomId" element={<RoomaPage user={user} socket={socket} users={users} />} />
      </Routes>
    </div>
  );
}

export default App;
