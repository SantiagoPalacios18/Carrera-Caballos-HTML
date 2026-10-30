import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import MainMenu from './components/MainMenu'
import input from './inputs.enum'
import './App.css'

function App() {
  const [test, setTest] = useState(1)

  const [Ainput, setAinput] = useState("") //Actual Input, tecla seleccionada en el momento

  const handleKeyDown = (e) => {
    var SI /*Selected Input*/ = input.NONE
    switch (e.key) {
        case 'ArrowUp': SI = input.UP; break;
        case 'ArrowDown': SI = input.DOWN; break;
        case 'ArrowLeft': SI = input.LEFT; break;
        case 'ArrowRight': SI = input.RIGHT; break;
        case 'Enter': SI = input.SELECT; break;
        case 'Escape': SI = input.BACK;   break;
 
        //Jugadores - Carrera de caballos
        case 'a' || 'A': SI = input.P1; break;
        case 'f' || 'F': SI = input.P2; break;
        case 'j' || 'J': SI = input.P3; break;
        case 'l' || 'L': SI = input.P4; break;
        default: SI = input.NONE; break;
    } 
    setAinput(SI)
  }

  useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
    }, [])

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<MainMenu Ainput={Ainput} setAinput={setAinput}/>} />*/
        </Routes>
      </div>
    </>
  )
}

export default App
