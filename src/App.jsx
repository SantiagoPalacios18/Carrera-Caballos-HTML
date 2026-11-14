import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainMenu from './components/MainMenu'
import input from './inputs.enum'
import './App.css'

function App() {
  const [Ainput, setAinput] = useState([input.NONE])

  const handleKeyDown = (e) => {
    setAinput((oldInput) => {
      let mappedInput = null;

      switch (e.key) {
        case 'ArrowUp': mappedInput = input.UP; break;
        case 'ArrowDown': mappedInput = input.DOWN; break;
        case 'ArrowLeft': mappedInput = input.LEFT; break;
        case 'ArrowRight': mappedInput = input.RIGHT; break;
        case 'Enter': mappedInput = input.SELECT; break;
        case 'Escape': mappedInput = input.BACK; break;
        
        // Jugadores - Carrera de caballos
        case 'a': case 'A': mappedInput = input.P1; break;
        case 'f': case 'F': mappedInput = input.P2; break;
        case 'j': case 'J': mappedInput = input.P3; break;
        case 'l': case 'L': mappedInput = input.P4; break;
        default: break;
      }

      if (mappedInput && !oldInput.includes(mappedInput)) {
        const filtered = oldInput.filter(i => i !== input.NONE);
        return [...filtered, mappedInput];
      }

      return oldInput;
    });
  }

  const handleKeyUp = (e) => {
    setAinput((oldInput) => {
      let mappedInput = null;

      switch (e.key) {
        case 'ArrowUp': mappedInput = input.UP; break;
        case 'ArrowDown': mappedInput = input.DOWN; break;
        case 'ArrowLeft': mappedInput = input.LEFT; break;
        case 'ArrowRight': mappedInput = input.RIGHT; break;
        case 'Enter': mappedInput = input.SELECT; break;
        case 'Escape': mappedInput = input.BACK; break;

        case 'a': case 'A': mappedInput = input.P1; break;
        case 'f': case 'F': mappedInput = input.P2; break;
        case 'j': case 'J': mappedInput = input.P3; break;
        case 'l': case 'L': mappedInput = input.P4; break;
        default: break;
      }

      if (!mappedInput) return oldInput;

      const newInput = oldInput.filter(i => i !== mappedInput);
      return newInput.length > 0 ? newInput : [input.NONE];
    });
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<MainMenu Ainput={Ainput} />} />
        </Routes>
      </div>
    </>
  )
}

export default App