import { useState, useEffect, useRef } from 'react'

interface User {
  id: number
  name: string
  email: string
  age: number
}

export function DOMExamples() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob Dupont', email: 'bob@example.com', age: 30 },
    { id: 3, name: 'Claire Dubois', email: 'claire@example.com', age: 28 }
  ])
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', age: 0 })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const userListRef = useRef<HTMLDivElement>(null)

  // Manipulation du DOM avec useRef
  useEffect(() => {
    if (userListRef.current) {
      userListRef.current.scrollTop = 0
    }
  }, [users])

  // Méthodes pour manipuler les objets
  const addUser = () => {
    if (newUser.name && newUser.email && newUser.age > 0) {
      const user: User = {
        ...newUser,
        id: Math.max(...users.map(u => u.id)) + 1
      }
      setUsers([...users, user])
      setNewUser({ name: '', email: '', age: 0 })
    }
  }

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id))
    if (selectedUser?.id === id) {
      setSelectedUser(null)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user))
    setSelectedUser(null)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>🎯 DOM et Objets JavaScript</h2>
      <p>Manipulation du DOM et gestion d'objets JavaScript</p>

      <div className="grid">
        {/* Formulaire d'ajout */}
        <div className="card">
          <h3>Ajouter un utilisateur</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Nom"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="number"
              placeholder="Âge"
              value={newUser.age || ''}
              onChange={(e) => setNewUser({ ...newUser, age: parseInt(e.target.value) || 0 })}
            />
            <button onClick={addUser}>Ajouter</button>
          </div>
        </div>

        {/* Recherche */}
        <div className="card">
          <h3>Rechercher</h3>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="card">
        <h3>Liste des utilisateurs ({filteredUsers.length})</h3>
        <div 
          ref={userListRef}
          style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '1rem'
          }}
        >
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              className="card"
              style={{ 
                margin: '0.5rem 0',
                cursor: 'pointer',
                backgroundColor: selectedUser?.id === user.id ? 'rgba(100, 108, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex">
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <strong>{user.name}</strong>
                  <br />
                  <small>{user.email}</small>
                  <br />
                  <small>Âge: {user.age} ans</small>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteUser(user.id)
                  }}
                  style={{ backgroundColor: '#ff4757' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Édition d'utilisateur */}
      {selectedUser && (
        <div className="card">
          <h3>Modifier l'utilisateur</h3>
          <div className="flex">
            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
            <input
              type="number"
              value={selectedUser.age}
              onChange={(e) => setSelectedUser({ ...selectedUser, age: parseInt(e.target.value) || 0 })}
            />
            <button onClick={() => updateUser(selectedUser)}>Sauvegarder</button>
            <button onClick={() => setSelectedUser(null)}>Annuler</button>
          </div>
        </div>
      )}

      {/* Informations sur les objets */}
      <div className="card">
        <h3>Informations sur les objets</h3>
        <div className="grid">
          <div>
            <h4>Propriétés des objets</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>id: Identifiant unique</li>
              <li>name: Nom de l'utilisateur</li>
              <li>email: Adresse email</li>
              <li>age: Âge de l'utilisateur</li>
            </ul>
          </div>
          <div>
            <h4>Méthodes utilisées</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>filter(): Filtrer les utilisateurs</li>
              <li>map(): Transformer les données</li>
              <li>find(): Trouver un utilisateur</li>
              <li>Math.max(): Calculer l'ID max</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
