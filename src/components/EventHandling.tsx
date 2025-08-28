import React, { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
}

interface KeyEvent {
  key: string
  code: string
  timestamp: number
}

export function EventHandling() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [keyEvents, setKeyEvents] = useState<KeyEvent[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [doubleClickCount, setDoubleClickCount] = useState(0)
  const [dragState, setDragState] = useState({ isDragging: false, startX: 0, startY: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Gestion des événements de souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseClick = () => {
      setClickCount(prev => prev + 1)
    }

    const handleDoubleClick = () => {
      setDoubleClickCount(prev => prev + 1)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleMouseClick)
    document.addEventListener('dblclick', handleDoubleClick)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleMouseClick)
      document.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [])

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeyEvent: KeyEvent = {
        key: e.key,
        code: e.code,
        timestamp: Date.now()
      }
      setKeyEvents(prev => [newKeyEvent, ...prev.slice(0, 9)]) // Garder les 10 derniers
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Gestion du drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    setDragState({ isDragging: true, startX: e.clientX, startY: e.clientY })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDragState({ isDragging: false, startX: 0, startY: 0 })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragState({ isDragging: false, startX: 0, startY: 0 })
  }

  // Validation de formulaire
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Le nom est requis'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Le message est requis'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      alert('Formulaire soumis avec succès!')
      setFormData({ name: '', email: '', message: '' })
      setFormErrors({})
    }
  }

  return (
    <div>
      <h2>⚡ Programmation Événementielle</h2>
      <p>Gestion des événements JavaScript et React</p>

      <div className="grid">
        {/* Événements de souris */}
        <div className="card">
          <h3>🖱️ Événements de souris</h3>
          <p>Position: X: {mousePosition.x}, Y: {mousePosition.y}</p>
          <p>Clics simples: {clickCount}</p>
          <p>Double-clics: {doubleClickCount}</p>
          
          <div 
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              padding: '1rem',
              backgroundColor: dragState.isDragging ? '#646cff' : '#1a1a1a',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              cursor: 'grab',
              userSelect: 'none'
            }}
          >
            Élément draggable
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              padding: '1rem',
              backgroundColor: '#2a2a2a',
              border: '2px dashed #646cff',
              borderRadius: '8px',
              marginTop: '1rem',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Zone de drop
          </div>
        </div>

        {/* Événements clavier */}
        <div className="card">
          <h3>⌨️ Événements clavier</h3>
          <p>Appuyez sur des touches pour voir les événements</p>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            {keyEvents.map((event, index) => (
              <div key={index} style={{ 
                padding: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'left'
              }}>
                <strong>{event.key}</strong> ({event.code}) - {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire avec validation */}
      <div className="card">
        <h3>📝 Formulaire avec validation</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div>
              <label>Nom:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ 
                  borderColor: formErrors.name ? '#ff4757' : '#ccc',
                  width: '100%'
                }}
              />
              {formErrors.name && <small style={{ color: '#ff4757' }}>{formErrors.name}</small>}
            </div>
            
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ 
                  borderColor: formErrors.email ? '#ff4757' : '#ccc',
                  width: '100%'
                }}
              />
              {formErrors.email && <small style={{ color: '#ff4757' }}>{formErrors.email}</small>}
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label>Message:</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ 
                borderColor: formErrors.message ? '#ff4757' : '#ccc',
                width: '100%',
                minHeight: '100px'
              }}
            />
            {formErrors.message && <small style={{ color: '#ff4757' }}>{formErrors.message}</small>}
          </div>
          
          <div className="flex" style={{ marginTop: '1rem' }}>
            <button type="submit">Soumettre</button>
            <button 
              type="button" 
              onClick={() => {
                setFormData({ name: '', email: '', message: '' })
                setFormErrors({})
              }}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      {/* Types d'événements */}
      <div className="card">
        <h3>📚 Types d'événements JavaScript</h3>
        <div className="grid">
          <div>
            <h4>Événements de souris</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>click: Clic simple</li>
              <li>dblclick: Double-clic</li>
              <li>mousedown/mouseup: Appui/relâchement</li>
              <li>mousemove: Mouvement de souris</li>
              <li>mouseenter/mouseleave: Entrée/sortie</li>
              <li>drag/drop: Glisser-déposer</li>
            </ul>
          </div>
          <div>
            <h4>Événements clavier</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>keydown: Touche enfoncée</li>
              <li>keyup: Touche relâchée</li>
              <li>keypress: Caractère saisi</li>
            </ul>
          </div>
          <div>
            <h4>Événements de formulaire</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>submit: Soumission</li>
              <li>change: Changement de valeur</li>
              <li>input: Saisie en cours</li>
              <li>focus/blur: Focus/perte de focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
