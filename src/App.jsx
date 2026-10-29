import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import MainMenu from './components/MainMenu'
import input from './inputs.enum'
import './App.css'

function App() {
  const [test, setTest] = useState(1)

  const [Ainput, setAinput] = useState("") //Actual Input, tecla seleccionada en el momento

  const handleKeyDown = (e) => {
        SI /*Selected Input*/ = ''
        switch (e.key) {
            case 'ArrowUp': SI = input.UP
            case 'ArrowDown': SI = input.DOWN
            case 'ArrowLeft': SI = input.LEFT
            case 'ArrowRight': SI = input.RIGHT
            case 'Enter': SI = input.SELECT
            case 'Escape': SI = input.BACK  

            //Jugadores - Carrera de caballos
            case 'a' || 'A': SI = input.P1
            case 'f' || 'F': SI = input.P2
            case 'j' || 'J': SI = input.P3
            case 'ñ' || 'Ñ': SI = input.P4
            
        }
  setAinput(e.key)
  console.log(e.key)
  }

  useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
    }, [])

  return (
    <>
      <div>
        <p>{test}</p>
        <p>{Ainput}</p>
        <MainMenu test={test} setTest={setTest}/>
        <Routes>
          {/*<Route path="/" element={<MainMenu/>} />*/}
        </Routes>
      </div>
    </>
  )
}

export default App
