
import { useState, useEffect } from "react"
import input from '../inputs.enum'
import './Styles/MainMenu.css'

function MainMenu(props) {
    const {Ainput, setAinput} = props
    const vel = 10
    const [pos, setPos] = useState({h: 0, v: 0})

    function setPosition(h, v){
        setPos(prevPos =>{
                const newH = h ? Math.max(0, prevPos.h + h) : prevPos.h;
                const newV = v ? Math.max(0, prevPos.v + v) : prevPos.v;

                h && console.log('nueva posicion h es: ' + newH)
                v && console.log('nueva posicion v es: ' + newV)

                document.documentElement.style.setProperty('--pos-h', newH.toString() + 'px')
                document.documentElement.style.setProperty('--pos-v', newV.toString() + 'px')

                setAinput(input.NONE);

                return { h: newH, v: newV };
            }
        )
    }

    const handleInput = ()=>{
        switch(Ainput){
            case input.RIGHT: setPosition(vel, 0); break;
            case input.LEFT : setPosition(-vel, 0); break;
            case input.UP : setPosition(0, -vel); break;
            case input.DOWN : setPosition(0, vel); break;
            default: break;
        }
    }



    useEffect(() => {
        handleInput()
    }, [Ainput])

    return(
        <>
            <div id="pj"></div>
        </>
    )
}

export default MainMenu