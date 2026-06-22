"use client"

import {useRef} from "react"

export default function HiddenExit(){
    const timerRef = useRef(null);
    const handleMouseDown= ()=>{
        timerRef.current = setTimeout(()=>{
        window.dispatchEvent(new CustomEvent("kiosk:exit-requested"));
    },10000)};
    const handleMouseUp = ()=>{
        clearTimeout(timerRef.current);
    };
    return (
        <div style={{position:"fixed", top:0, left:0, width:100, height:100, zIndex:9999, opacity:0}} onPointerDown={handleMouseDown} onPointerUp={handleMouseUp} onPointerLeave={handleMouseUp}/>
    )
}
