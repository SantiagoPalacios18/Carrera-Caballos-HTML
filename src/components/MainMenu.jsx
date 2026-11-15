import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import input from '../inputs.enum'
import './Styles/MainMenu.css'

function MainMenu({ Ainput }) {
    const [selec, setSelec] = useState(0) // 0: Jugar, 1: Leaderboard
    const navigate = useNavigate()

    // Maneja la navegación en el menú con flechas y selección con SELECT (Enter)
    useEffect(() => {
        if (Ainput.includes(input.LEFT) || Ainput.includes(input.UP)) {
            setSelec(prev => Math.max(0, prev - 1))
        }
        if (Ainput.includes(input.RIGHT) || Ainput.includes(input.DOWN)) {
            setSelec(prev => Math.min(1, prev + 1))
        }
        if (Ainput.includes(input.SELECT)) {
            if (selec === 0) navigate('/lobby')
            if (selec === 1) navigate('/leaderboard')
        }
    }, [Ainput, selec, navigate])

    return (
        <div className="menu-container">
            <h1 className="menu-title">LA COPA WARNES</h1>
            <div className="menu-options">
                <div 
                    id="Jugar" 
                    className={`menu-btn ${selec === 0 ? 'selected' : ''}`}
                    onClick={() => navigate('/lobby')}
                >
                    Jugar
                </div>
                <div 
                    id="Leaderboard" 
                    className={`menu-btn ${selec === 1 ? 'selected' : ''}`}
                    onClick={() => navigate('/leaderboard')}
                >
                    Leaderboard
                </div>
            </div>
        </div>
    )
}

export default MainMenu