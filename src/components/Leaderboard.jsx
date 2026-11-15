import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import './Styles/Leaderboard.css'

function Leaderboard() {
    const [scores, setScores] = useState([])
    const navigate = useNavigate()

    // Carga los puntajes guardados del almacenamiento local (simulando .json)
    useEffect(() => {
        const loadedScores = JSON.parse(localStorage.getItem('copa_warnes_lb') || '[]');
        setScores(loadedScores);
    }, [])

    return (
        <div className="leaderboard-container">
            <h1 className="lb-title">LEADERBOARD - TOP 20</h1>
            
            <div className="lb-table">
                <div className="lb-header-row">
                    <span>Posición</span>
                    <span>Iniciales</span>
                    <span>Puntaje</span>
                </div>
                {scores.map((entry, index) => (
                    <div key={index} className={`lb-row ${index === 0 ? 'gold-podium' : ''}`}>
                        <span>#{index + 1}</span>
                        <span>{entry.initials}</span>
                        <span>{entry.score}</span>
                    </div>
                ))}
                {scores.length === 0 && <p className="no-scores">No hay puntajes registrados todavía.</p>}
            </div>

            <button className="back-btn" onClick={() => navigate('/')}>Volver al Menú</button>
        </div>
    )
}

export default Leaderboard