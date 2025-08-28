import React, { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'

// Enregistrer tous les composants Chart.js
Chart.register(...registerables)

interface DataPoint {
  x: number
  y: number
  label: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export function Widgets2D() {
  const [canvasData, setCanvasData] = useState<DataPoint[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedTool, setSelectedTool] = useState<'circle' | 'rectangle' | 'line'>('circle')
  const [color, setColor] = useState('#646cff')
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'doughnut'>('bar')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  // Données pour les graphiques
  const chartData: ChartData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes 2024',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  // Initialiser le canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Définir la taille du canvas
    canvas.width = 600
    canvas.height = 400

    // Style de base
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Gestion des événements du canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    drawShape(x, y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    drawShape(x, y)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  // Fonction de dessin
  const drawShape = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    switch (selectedTool) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, 2 * Math.PI)
        ctx.fill()
        break
      case 'rectangle':
        ctx.fillRect(x - 15, y - 15, 30, 30)
        break
      case 'line':
        if (canvasData.length > 0) {
          const lastPoint = canvasData[canvasData.length - 1]
          ctx.beginPath()
          ctx.moveTo(lastPoint.x, lastPoint.y)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
        break
    }

    // Ajouter le point aux données
    setCanvasData(prev => [...prev, { x, y, label: `${selectedTool} ${prev.length + 1}` }])
  }

  // Effacer le canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setCanvasData([])
  }

  // Initialiser et gérer le graphique Chart.js
  useEffect(() => {
    const chartCanvas = chartRef.current
    if (!chartCanvas) return

    // Détruire l'ancien graphique s'il existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = chartCanvas.getContext('2d')
    if (!ctx) return

    // Créer le nouveau graphique
    chartInstanceRef.current = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `Graphique ${chartType}`,
            color: 'white'
          }
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        } : undefined
      }
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [chartType, chartData])

  // Générer des données aléatoires
  const generateRandomData = () => {
    const newData = chartData.labels.map(() => Math.floor(Math.random() * 100))
    chartData.datasets[0].data = newData
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data = chartData
      chartInstanceRef.current.update()
    }
  }

  return (
    <div>
      <h2>🎨 Widgets et Graphisme 2D</h2>
      <p>Canvas HTML5 et graphiques avec Chart.js</p>

      <div className="grid">
        {/* Canvas de dessin */}
        <div className="card">
          <h3>🖌️ Canvas de dessin</h3>
          <div className="flex" style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setSelectedTool('circle')}
              style={{ 
                backgroundColor: selectedTool === 'circle' ? '#646cff' : '#1a1a1a'
              }}
            >
              ⭕ Cercle
            </button>
            <button
              onClick={() => setSelectedTool('rectangle')}
              style={{ 
                backgroundColor: selectedTool === 'rectangle' ? '#646cff' : '#1a1a1a'
              }}
            >
              ⬜ Rectangle
            </button>
            <button
              onClick={() => setSelectedTool('line')}
              style={{ 
                backgroundColor: selectedTool === 'line' ? '#646cff' : '#1a1a1a'
              }}
            >
              📏 Ligne
            </button>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '50px', height: '40px' }}
            />
            <button onClick={clearCanvas} style={{ backgroundColor: '#ff4757' }}>
              🗑️ Effacer
            </button>
          </div>
          
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              border: '2px solid #646cff',
              borderRadius: '8px',
              cursor: 'crosshair',
              maxWidth: '100%'
            }}
          />
          
          <p style={{ marginTop: '1rem' }}>
            Éléments dessinés: {canvasData.length}
          </p>
        </div>

        {/* Graphiques Chart.js */}
        <div className="card">
          <h3>📊 Graphiques interactifs</h3>
          <div className="flex" style={{ marginBottom: '1rem' }}>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value as any)}
            >
              <option value="bar">Barres</option>
              <option value="line">Ligne</option>
              <option value="pie">Camembert</option>
              <option value="doughnut">Donut</option>
            </select>
            <button onClick={generateRandomData}>
              🎲 Données aléatoires
            </button>
          </div>
          
          <div style={{ height: '300px', position: 'relative' }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>

      {/* Widgets interactifs */}
      <div className="card">
        <h3>🎛️ Widgets interactifs</h3>
        <div className="grid">
          {/* Progress bars */}
          <div className="card">
            <h4>📈 Barres de progression</h4>
            <ProgressBar value={75} label="Progression générale" color="#646cff" />
            <ProgressBar value={45} label="Tâches terminées" color="#2ed573" />
            <ProgressBar value={90} label="Performance" color="#ffa502" />
          </div>

          {/* Gauge */}
          <div className="card">
            <h4>🎯 Jauge circulaire</h4>
            <CircularGauge value={65} max={100} label="CPU Usage" />
          </div>

          {/* Counter */}
          <div className="card">
            <h4>🔢 Compteur animé</h4>
            <AnimatedCounter target={1234} duration={2000} />
          </div>

          {/* Color picker */}
          <div className="card">
            <h4>🎨 Sélecteur de couleurs</h4>
            <ColorPicker />
          </div>
        </div>
      </div>

      {/* Concepts Canvas et 2D */}
      <div className="card">
        <h3>📚 Concepts Canvas et Graphisme 2D</h3>
        <div className="grid">
          <div>
            <h4>Canvas HTML5</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Dessin 2D en temps réel</li>
              <li>Manipulation pixel par pixel</li>
              <li>Animations fluides</li>
              <li>Jeux et visualisations</li>
            </ul>
          </div>
          <div>
            <h4>Chart.js</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Graphiques interactifs</li>
              <li>Animations automatiques</li>
              <li>Responsive design</li>
              <li>Thèmes personnalisables</li>
            </ul>
          </div>
          <div>
            <h4>Événements Canvas</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>mousedown/mouseup</li>
              <li>mousemove</li>
              <li>touchstart/touchend</li>
              <li>touchmove</li>
            </ul>
          </div>
          <div>
            <h4>Formes 2D</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Rectangles et carrés</li>
              <li>Cercles et arcs</li>
              <li>Lignes et courbes</li>
              <li>Polygones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant Progress Bar
interface ProgressBarProps {
  value: number
  label: string
  color: string
}

function ProgressBar({ value, label, color }: ProgressBarProps) {
  return (
    <div style={{ margin: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>
    </div>
  )
}

// Composant Gauge circulaire
interface CircularGaugeProps {
  value: number
  max: number
  label: string
}

function CircularGauge({ value, max, label }: CircularGaugeProps) {
  const percentage = (value / max) * 100
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#646cff"
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div style={{ marginTop: '1rem' }}>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  )
}

// Composant Compteur animé
interface AnimatedCounterProps {
  target: number
  duration: number
}

function AnimatedCounter({ target, duration }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * target))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [target, duration])

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '3rem', margin: '1rem 0' }}>{count}</h2>
      <button onClick={() => setCount(0)}>Réinitialiser</button>
    </div>
  )
}

// Composant Sélecteur de couleurs
function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#646cff')
  const [showPicker, setShowPicker] = useState(false)

  const colors = [
    '#646cff', '#ff4757', '#2ed573', '#ffa502', 
    '#3742fa', '#ff6348', '#ff3838', '#ff9ff3'
  ]

  return (
    <div>
      <div className="flex" style={{ marginBottom: '1rem' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: selectedColor,
            borderRadius: '8px',
            border: '2px solid white',
            cursor: 'pointer'
          }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <span style={{ marginLeft: '1rem', lineHeight: '50px' }}>
          {selectedColor}
        </span>
      </div>
      
      {showPicker && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {colors.map(color => (
            <div
              key={color}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: color,
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedColor === color ? '3px solid white' : '1px solid rgba(255,255,255,0.3)'
              }}
              onClick={() => {
                setSelectedColor(color)
                setShowPicker(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
