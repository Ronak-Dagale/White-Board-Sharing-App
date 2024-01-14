import React, { useRef,useEffect } from 'react'
import "./index.css"
import { useState } from 'react'
import WhiteBoard from '../../components/whiteboard'
import Chat from '../../components/ChatBar/userbar'
const RoomaPage = ({user,socket,users}) => {
   
  // console.log(111)
  //  console.log(users)
    const [tool,setTool]=useState("pencil")
    const [color,setColor]=useState("#000000")
    const [elements,setElements]=useState([])
    const [history, setHistory] = useState([]);
    const [openUserTab,setOpenUserTab]=useState(false)
    const [openedChatTab,setOpenedChatTab]=useState(false)
    const canvasRef=useRef(null)
    const ctxRef=useRef(null);

   

    const handleclear=()=>{
      const canvas=canvasRef.current;
      const ctx=canvas.getContext("2d");

      ctx.fillRect="white"
      ctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height)

      setElements([]);

    }


    const undo = () => {
      setHistory((prevHistory) => [
        ...prevHistory,
        elements[elements.length - 1],
      ]);
      setElements((prevElements) =>
        prevElements.filter((ele, index) => index !== elements.length - 1)
      );
    };

    const redo = () => {
      setElements((prevElements) => [
        ...prevElements,
        history[history.length - 1],
      ]);
      setHistory((prevHistory) =>
        prevHistory.filter((ele, index) => index !== history.length - 1)
      );
    };

  return (


     

    <div className='row'>
      <button type='button' className='btn btn-dark'
      style={{display:"block",position:"absolute" ,top:"5%",left:"3%" , height:"40px" ,width:"100px"}}
      onClick={()=>setOpenUserTab(true)}>Users</button>
      <button type='button' className='btn btn-primary'
      style={{display:"block",position:"absolute" ,top:"5%",left:"10%" , height:"40px" ,width:"100px"}}
      onClick={()=>setOpenedChatTab(true)}>Chats</button>
      {
        openUserTab &&(
          <div className="position-fixed top-0 left-0 h-100 text-white bg-dark" style={{width:"250px" ,left:"0%"}}> 
          <button type='button' onClick={()=>setOpenUserTab(false)} className='btn btn-light btn-block w-100 mt-5'>close</button>
          <div className="w-100 mt-5 pt-5">
          {
            users.map((usr,index)=>(
              <p key={index*999} className='my-2 text-center w-100 '>{usr.name}{user && user.userId===usr.userId && " (You)"}</p>
            ))
          }
          </div>
          </div>
  )
      }
      {
        openedChatTab &&(
          <Chat setOpenedChatTab={setOpenedChatTab} socket={socket}/>
        )
      }
     <h1 className='text-center py-3'>White Board Sharing App - users online:{users.length} </h1>
     {
         // condition to verify it comming from join room or create room
         user?.presenter &&(
<div className="col-md-10 mx-auto mb-5 d-flex align-items-center justify-content-between">
       <div className="d-flex col-md-4 justify-content-center gap-1">
        <div className="d-flex gap-1">
            <label htmlFor="pencil">Pencil</label>
            <input type='radio' name='tool' id='pencil' checked={tool === "pencil"} value='pencil'  onChange={() => setTool("pencil")}/>
        </div>
        <div className="d-flex gap-1">
            <label htmlFor="line">Line</label>
            <input type='radio' name='tool' id='line' checked={tool === "line"} value='line' onChange={(e)=>setTool(e.target.value)}/> 
        </div>
        <div className="d-flex gap-1">
            <label htmlFor="rect">Rectangle</label>
            <input type='radio' name='tool' id='rect' checked={tool === "rect"}  value='rect' onChange={(e)=>setTool(e.target.value)}/>
        </div>
       
        
       </div>
       <div className="col-md-2 mx-auto justify-content-center">
        <div className="d-flex flex-column align-items-center">
            <label htmlFor='color'>Select Color</label>
            <input type='color' id='color' className='mt-1 ml-3' value={color} onChange={(e)=>setColor(e.target.value)}/>
        </div>
       </div>

       <div className="col-md-3 d-flex gap-2 justify-content-center">
        <button className='btn btn-primary mt-1' disabled={elements.length === 0}
            onClick={() => undo()}>Undo</button>
        <button className='btn btn-outline-primary mt-1' disabled={history.length < 1}
            onClick={() => redo()}>Redo</button>
       </div>

       <div className="col-md-3 justify-content-center">
        <button className='btn btn-danger' onClick={handleclear}>Clear Canvas</button>
       </div>

     </div>
        )
     }
     
     <div className="col-md-10 mx-auto  canvas-box">
        <WhiteBoard canvasRef={canvasRef} ctxRef={ctxRef} elements={elements} setElements={setElements} tool={tool} color={color} user={user} socket={socket}/>
     </div>
    </div>
  )
}

export default RoomaPage
