import React, { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

// WhiteBoard Component
const WhiteBoard = ({
    canvasRef, ctxRef, elements, setElements, tool, color, user, socket
}) => {

    const [isDrawing, setIsDrawing] = useState(false);
    const [img, setImg] = useState(null);

    useEffect(() => {
        // Listen for updates to the whiteboard data from the server
        socket.on("whiteBoardDataResponse", (data) => {
            setImg(data.imgURL);
        });
    }, []);

    // If the user is not a presenter, display the whiteboard as an image
    if (!(user?.presenter)) {
        return (
            <div className='border border-dark border-3 h-100 w-100 overflow-hidden'>
                <img src={img} alt="real time white board image Shared by Presenter" style={{
                    height: window.innerHeight * 2,
                    width: "285%"
                }} />
            </div>
        )
    }

    // ********************** useEffect *********************
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
    }, []);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color]);

    useLayoutEffect(() => {
        // Draw elements on the canvas using roughjs
        if (canvasRef) {
            const roughCanvas = rough.canvas(canvasRef.current);

            if (elements.length > 0) {
                ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }

            elements.forEach((element) => {
                if (element.type === "pencil") {
                    roughCanvas.linearPath(element.path, {
                        stroke: element.stroke,
                        strokeWidth: 5,
                        roughness: 0,
                    });
                } else if (element.type === "line") {
                    roughCanvas.draw(roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, {
                        stroke: element.stroke,
                        strokeWidth: 5,
                        roughness: 0,
                    }));
                } else if (element.type === "rect") {
                    roughCanvas.draw(roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height, {
                        stroke: element.stroke,
                        strokeWidth: 5,
                        roughness: 0,
                    }));
                }
            });

            // Get the current state of the canvas as an image
            const canvasImage = canvasRef.current.toDataURL();

            // Send the canvas image data to the server
            socket.emit("whiteboardData", canvasImage);
        }
    }, [elements]);

    // Event handlers for mouse interactions
    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color
                },
            ]);
        } else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        } else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                },
            ]);
        }

        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {
            if (tool === "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                path: newPath,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "rect") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                height: offsetY - ele.offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    // JSX structure
    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className='border border-dark border-3 h-100 w-100 overflow-hidden'>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default WhiteBoard;
