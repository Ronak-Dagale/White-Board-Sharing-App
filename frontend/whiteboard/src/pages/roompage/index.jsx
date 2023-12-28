import React, { useRef } from 'react'
import "./index.css"
import { useState } from 'react'
import WhiteBoard from '../../components/whiteboard'
const RoomaPage = ({user,socket,users}) => {

// console.log(111)
   console.log(users)
    const [tool,setTool]=useState("pencil")
    const [color,setColor]=useState("#000000")
    const [elements,setElements]=useState([])
    const [history, setHistory] = useState([]);
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
     <h1 className='text-center py-3'>White Board Sharing App </h1>
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
