import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import "./index.css"



const CreateRoomForm=({uuid,socket,setUser})=>{

  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");

const navigate=useNavigate()
  const handleCreateRoom=(e)=>{
    e.preventDefault();

    const roomData={
      name,roomId,userId:uuid(),host:true,presenter:true
    }
   // console.log(roomData)
   setUser(roomData)
   navigate(`/${roomId}`)
  // console.log(roomData)
   socket.emit("userJoined",roomData)
  }
    return(
      <form className="form col-md-12 mt-5">
        <div className="form-group">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="form-control my-2" placeholder="Enter Your Name"/>
        </div>
        <div className="form-group">
            <div className="input-group d-flex align-items-centre justify-content-center">
            <input type="text" value={roomId} className="form-control my-2" disabled placeholder="Generate room code"/>
            <div className="input-group-append m-2">
                <button className="btn btn-primary btn-sm me-1" onClick={() => setRoomId(uuid())} type="button">generate</button>
                <button
                    className="btn btn-outline-dark border-0 btn-sm"
                    type="button"
                  >
                    Copy
                  </button>
            </div>
            </div>
            
        </div>
        <button type="submit" onClick={handleCreateRoom} className="mt-4 btn-primary btn-block form-control">Generate Room</button>
      </form>
    )
}

export default CreateRoomForm