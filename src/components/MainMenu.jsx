
import { useState, useEffect } from "react"


function MainMenu(props) {
    const {test, setTest} = props

    return(
        <>
            <button onClick={()=>setTest(test + 1)}>+</button>
        </>
    )
}

export default MainMenu