import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import input from '../inputs.enum'
import './Styles/Lobby.css'

function Lobby({ Ainput }) {
    const navigate = useNavigate()
    // Estado de confirmación de los 4 jugadores (P1, P2, P3, P4)
    const [readyPlayers, setReadyPlayers] = useState({
        P1: false,
        P2: false,
        P3: false,
        P4: false
    })

    // Detecta cuando cada jugador presiona su tecla asignada para registrarse en el lobby
    useEffect(() => {
        setReadyPlayers(prev => ({
            P1: prev.P1 || Ainput.includes(input.P1),
            P2: prev.P2 || Ainput.includes(input.P2),
            P3: prev.P3 || Ainput.includes(input.P3),
            P4: prev.P4 || Ainput.includes(input.P4),
        }))
    }, [Ainput])

    // Si todos están listos, inicia el juego automáticamente tras un breve retraso
    useEffect(() => {
        if (readyPlayers.P1 && readyPlayers.P2 && readyPlayers.P3 && readyPlayers.P4) {
            const timer = setTimeout(() => {
                navigate('/juego')
            }, 1200)
            return () => clearTimeout(timer)
        }
    }, [readyPlayers, navigate])

    return (
        <div className="lobby-container">
            <h1 className="lobby-title">LA COPA WARNES</h1>
            <p className="lobby-instruction">¡Cada jugador debe presionar su tecla (A, F, J, Ñ) para comenzar!</p>

            <div className="players-status-grid">
                <div className={`player-box ${readyPlayers.P1 ? 'ready' : ''}`}>
                    <span>Jugador 1 (Tecla A)</span>
                    {readyPlayers.P1 && <div className="color-indicator p1-color"></div>}
                </div>
                <div className={`player-box ${readyPlayers.P2 ? 'ready' : ''}`}>
                    <span>Jugador 2 (Tecla F)</span>
                    {readyPlayers.P2 && <div className="color-indicator p2-color"></div>}
                </div>
                <div className={`player-box ${readyPlayers.P3 ? 'ready' : ''}`}>
                    <span>Jugador 3 (Tecla J)</span>
                    {readyPlayers.P3 && <div className="color-indicator p3-color"></div>}
                </div>
                <div className={`player-box ${readyPlayers.P4 ? 'ready' : ''}`}>
                    <span>Jugador 4 (Tecla Ñ)</span>
                    {readyPlayers.P4 && <div className="color-indicator p4-color"></div>}
                </div>
            </div>

            <footer className="lobby-footer">
                <img src="" alt="Logo Escuela 36" className="sponsor-logo left-logo" />
                <span className="sponsor-text">Patrocinado por la Escuela Tecnica N36 y Excalibur Servicio Tecnico</span>
                <img src="" alt="Logo Excalibur" className="sponsor-logo right-logo" />
            </footer>
        </div>
    )
}

export default Lobby