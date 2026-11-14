import { useState, useEffect } from "react"
import input from '../inputs.enum'
import './Styles/MainMenu.css'

function MainMenu(props) {
    const { Ainput } = props
    const vel = 4

    const [pos, setPos] = useState({ h: 0, v: 0 })

    useEffect(() => {
        let animationFrameId;

        const updatePosition = () => {
            setPos(prevPos => {
                let newH = prevPos.h;
                let newV = prevPos.v;

                if (Ainput.includes(input.LEFT)) newH -= vel;
                if (Ainput.includes(input.RIGHT)) newH += vel;
                if (Ainput.includes(input.UP)) newV -= vel;
                if (Ainput.includes(input.DOWN)) newV += vel;

                newH = Math.max(0, newH);
                newV = Math.max(0, newV);

                return { h: newH, v: newV };
            });

            animationFrameId = requestAnimationFrame(updatePosition);
        };

        animationFrameId = requestAnimationFrame(updatePosition);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [Ainput])

    const style1 = {
        '--pos-h': `${pos.h}px`,
        '--pos-v': `${pos.v}px`,
    }

    return (
        <>
            <div id="pj" style={style1}></div>
        </>
    )
}

export default MainMenu