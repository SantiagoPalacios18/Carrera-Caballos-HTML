import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import input from '../inputs.enum'
import './Styles/CopaWarnes.css'

// ==========================================
// CONSTANTES DE CONFIGURACIÓN DEL JUEGO
// ==========================================
const SCORE_MULTIPLIER = 100;       
const DISTANCE_MULTIPLIER = 0.5;    
const POTHHOLE_START = 20;          
const POTHHOLE_END = 80;            
const TOTAL_POTHOLES = 3;           
const ACTION_LINE_SPEED_RANGE = [2, 6]; 
const TARGET_RANGE = [30, 50];      
const FINISH_LINE = 90;             
const CAR_WIDTH = 6;                
const HOLE_WIDTH = 3;               

function CopaWarnes({ Ainput }) {
    const navigate = useNavigate()

    const [cars, setCars] = useState([
        { id: 'P1', key: input.P1, color: 'red', pos: 0, score: 0, totalDistError: 0, finished: false, acted: false },
        { id: 'P2', key: input.P2, color: 'blue', pos: 0, score: 0, totalDistError: 0, finished: false, acted: false },
        { id: 'P3', key: input.P3, color: 'green', pos: 0, score: 0, totalDistError: 0, finished: false, acted: false },
        { id: 'P4', key: input.P4, color: 'yellow', pos: 0, score: 0, totalDistError: 0, finished: false, acted: false },
    ])

    // Generación de baches distribuidos proporcionalmente dentro de la pantalla
    const [potholes] = useState(() => {
        const minGap = CAR_WIDTH * 1.5; 
        
        return cars.map(() => {
            const holes = [];
            let currentMin = POTHHOLE_START;
            const usableSpace = POTHHOLE_END - POTHHOLE_START;
            const step = usableSpace / TOTAL_POTHOLES;

            for (let i = 0; i < TOTAL_POTHOLES; i++) {
                const sectionStart = currentMin;
                const sectionEnd = POTHHOLE_START + (i + 1) * step - HOLE_WIDTH;

                if (sectionStart < sectionEnd) {
                    const holePos = Math.floor(Math.random() * (sectionEnd - sectionStart + 1)) + sectionStart;
                    holes.push(holePos);
                    currentMin = holePos + HOLE_WIDTH + minGap;
                }
            }
            return holes;
        });
    })

    const [targetPos, setTargetPos] = useState(40); 
    const [actionLinePos, setActionLinePos] = useState(0); 
    const [lineSpeed, setLineSpeed] = useState(3);
    const [roundEnded, setRoundEnded] = useState(false);
    const [winnerData, setWinnerData] = useState(null);
    const [clickReplicas, setClickReplicas] = useState([]);

    // Salir de la partida con la tecla Escape (BACK)
    useEffect(() => {
        if (Ainput.includes(input.BACK)) {
            navigate('/');
        }
    }, [Ainput, navigate]);

    useEffect(() => {
        const randomTarget = Math.floor(Math.random() * (TARGET_RANGE[1] - TARGET_RANGE[0])) + TARGET_RANGE[0];
        const randomSpeed = Math.random() * (ACTION_LINE_SPEED_RANGE[1] - ACTION_LINE_SPEED_RANGE[0]) + ACTION_LINE_SPEED_RANGE[0];
        setTargetPos(randomTarget);
        setLineSpeed(randomSpeed);
        setActionLinePos(0);
        setClickReplicas([]);
        setRoundEnded(false);
    }, [])

    useEffect(() => {
        if (roundEnded) return;

        const interval = setInterval(() => {
            setActionLinePos(prev => {
                if (prev >= 100) {
                    triggerRoundEvaluation();
                    return 100;
                }
                return prev + lineSpeed * 0.4;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [lineSpeed, roundEnded]);

    useEffect(() => {
        if (roundEnded) return;

        cars.forEach((car, index) => {
            if (Ainput.includes(car.key) && !car.acted) {
                registerPlayerClick(index);
            }
        });
    }, [Ainput]);

    // ==========================================
    // CÁLCULO DE PRECISIÓN Y GESTIÓN DE COBERTURA DE BACHES
    // ==========================================
    const registerPlayerClick = (carIndex) => {
        const currentClickPos = actionLinePos;

        setClickReplicas(prev => [...prev, { pos: currentClickPos, color: cars[carIndex].color }]);

        setCars(prevCars => {
            const updated = [...prevCars];
            if (updated[carIndex].acted) return prevCars;

            const targetCenter = targetPos + 5; 
            const distanceError = Math.abs(currentClickPos - targetCenter);
            const maxRadius = 5;
            const isInsideTarget = distanceError <= maxRadius;

            let earnedScore = 0;
            let advanceAmount = 1.5; 

            if (isInsideTarget) {
                const precisionFactor = maxRadius - distanceError; 
                earnedScore = Math.round((precisionFactor + 2) * SCORE_MULTIPLIER * 0.8);
                advanceAmount = 3 + (precisionFactor * DISTANCE_MULTIPLIER); 
            } else {
                earnedScore = 0;
                advanceAmount = 1.5;
            }

            let newPos = updated[carIndex].pos + advanceAmount;
            const currentPotholes = potholes[carIndex];
            const currentCarPos = updated[carIndex].pos;

            // Validación estricta de colisión con baches
            for (let holeLeft of currentPotholes) {
                const holeRight = holeLeft + HOLE_WIDTH;

                if (currentCarPos < holeLeft && newPos + CAR_WIDTH > holeLeft) {
                    if (!isInsideTarget) {
                        newPos = holeLeft - CAR_WIDTH; // Se frena antes del bache
                        break;
                    } else {
                        if (newPos < holeRight) {
                            newPos = holeRight; // Salta al otro lado limpiamente
                        }
                    }
                }
            }

            newPos = Math.min(FINISH_LINE, newPos);
            const isFinished = newPos >= FINISH_LINE;

            updated[carIndex] = {
                ...updated[carIndex],
                pos: newPos,
                score: updated[carIndex].score + earnedScore,
                totalDistError: updated[carIndex].totalDistError + distanceError,
                acted: true,
                finished: isFinished
            };

            return updated;
        });
    };

    const triggerRoundEvaluation = () => {
        setRoundEnded(true);

        setCars(latestCars => {
            const winner = latestCars.find(c => c.finished);
            if (winner) {
                const sortedByPosition = [...latestCars].sort((a, b) => {
                    if (b.pos !== a.pos) return b.pos - a.pos;
                    return a.totalDistError - b.totalDistError;
                });
                setWinnerData(sortedByPosition[0]);
            } else {
                setTimeout(() => {
                    setCars(c => c.map(car => ({ ...car, acted: false })));
                    const randomTarget = Math.floor(Math.random() * (TARGET_RANGE[1] - TARGET_RANGE[0])) + TARGET_RANGE[0];
                    setTargetPos(randomTarget);
                    setActionLinePos(0);
                    setClickReplicas([]);
                    setRoundEnded(false);
                }, 1500);
            }
            return latestCars;
        });
    };

    const [initials, setInitials] = useState("");
    const handleSaveScore = () => {
        if (initials.length !== 3) return;
        const existingScores = JSON.parse(localStorage.getItem('copa_warnes_lb') || '[]');
        existingScores.push({ initials: initials.toUpperCase(), score: winnerData.score });
        existingScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('copa_warnes_lb', JSON.stringify(existingScores.slice(0, 20)));
        navigate('/leaderboard');
    };

    return (
        <div className="game-container">
            {/* Pista ajustada al 100% de la pantalla sin scroll */}
            <div className="track-area">
                {cars.map((car, idx) => (
                    <div key={car.id} className="lane">
                        <span className="lane-label">{car.id}</span>
                        <div className="lane-track">
                            {/* Baches preparados para recibir background-image / texturas */}
                            {potholes[idx].map((holePos, hIdx) => (
                                <div key={hIdx} className="pothole asset-container" style={{ left: `${holePos}%`, width: `${HOLE_WIDTH}%` }}></div>
                            ))}
                            {/* Línea de meta al 90% */}
                            <div className="finish-line-marker" style={{ left: `${FINISH_LINE}%` }}></div>
                            {/* Autos con proporción 2:1 y preparados para texturas o imágenes */}
                            <div 
                                className="car-marker asset-container" 
                                style={{ 
                                    left: `${car.pos}%`, 
                                    backgroundColor: car.color,
                                    width: `${CAR_WIDTH}%`
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barra de precisión inferior */}
            <div className="precision-bar-container">
                <div className="precision-bar">
                    <div className="target-zone" style={{ left: `${targetPos}%`, width: '10%' }}></div>
                    {clickReplicas.map((rep, idx) => (
                        <div key={idx} className="click-replica" style={{ left: `${rep.pos}%`, backgroundColor: rep.color }}></div>
                    ))}
                    <div className="action-line" style={{ left: `${actionLinePos}%` }}></div>
                </div>
                <p className="bar-instructions">¡Presiona tu tecla asignada (A, F, J, Ñ) en el objetivo! (ESC para salir)</p>
            </div>

            {winnerData && (
                <div className="winner-modal">
                    <h2>¡EL AUTO {winnerData.id} HA GANADO!</h2>
                    <p>Ingresa tus 3 iniciales:</p>
                    <input 
                        type="text" 
                        maxLength={3} 
                        value={initials} 
                        onChange={(e) => setInitials(e.target.value)}
                        placeholder="ABC"
                    />
                    <button onClick={handleSaveScore}>Guardar Puntaje</button>
                </div>
            )}
        </div>
    )
}

export default CopaWarnes