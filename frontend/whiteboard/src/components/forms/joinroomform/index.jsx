import { useState } from "react"
import "./index.css"
import {useNavigate} from 'react-router-dom'

const JoinRoomForm=({uuid,socket,setUser})=>{

  const [roomId,setRoomId]=useState("")
    const [name,setName]=useState("")
    const navigate=useNavigate()

    const handleJoinRoom=(e)=>{
      e.preventDefault();

      const roomData={
        name,roomId,userId:uuid(),host:true,presenter:false
      }
     // console.log(roomData)
     setUser(roomData)
     navigate(`/${roomId}`)
     socket.emit("userJoined",roomData)
    }
    return(
      <form className="form col-md-12 mt-5">
        <div className="form-group">
            <input type="text" value={name}  onChange={(e)=> setName(e.target.value)} className="form-control my-2" placeholder="Enter Your Name"/>
        </div>
        <div className="form-group">
            <div className="input-group d-flex align-items-centre justify-content-center">
            <input type="text" value={roomId}  onChange={(e)=> setRoomId(e.target.value)} className="form-control my-2"  placeholder="Enter room code"/>
            
            </div>
            
        </div>
        <button type="submit" onClick={handleJoinRoom} className="mt-4 btn-primary btn-block form-control">Join Room</button>
      </form>
    )
}

export default JoinRoomForm