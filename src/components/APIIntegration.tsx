import React, { useState, useEffect, useCallback } from 'react'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface User {
  id: number
  name: string
  email: string
  username: string
}

interface WeatherData {
  location: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
}

export function APIIntegration() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // Fonction générique pour les appels API
  const fetchData = useCallback(async <T,>(url: string): Promise<T> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Récupérer les posts depuis JSONPlaceholder
  const fetchPosts = useCallback(async () => {
    try {
      const data = await fetchData<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=10')
      setPosts(data)
    } catch (err) {
      console.error('Erreur lors de la récupération des posts:', err)
    }
  }, [fetchData])

  // Récupérer les utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      const data = await fetchData<User[]>('https://jsonplaceholder.typicode.com/users')
      setUsers(data)
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err)
    }
  }, [fetchData])

  // Simuler des données météo (API fictive)
  const fetchWeather = useCallback(async (city: string = 'Paris') => {
    try {
      // Simulation d'une API météo
      await new Promise(resolve => setTimeout(resolve, 1000)) // Délai artificiel
      
      const mockWeatherData: WeatherData = {
        location: city,
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
        description: ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Orageux'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
        windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
      }
      
      setWeather(mockWeatherData)
    } catch (err) {
      console.error('Erreur lors de la récupération de la météo:', err)
    }
  }, [])

  // Créer un nouveau post
  const createPost = useCallback(async (postData: Omit<Post, 'id'>) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const newPost = await response.json()
      setPosts(prev => [newPost, ...prev])
      return newPost
    } catch (err) {
      console.error('Erreur lors de la création du post:', err)
      throw err
    }
  }, [])

  // Supprimer un post
  const deletePost = useCallback(async (postId: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      setPosts(prev => prev.filter(post => post.id !== postId))
    } catch (err) {
      console.error('Erreur lors de la suppression du post:', err)
    }
  }, [])

  // Charger les données au montage du composant
  useEffect(() => {
    fetchPosts()
    fetchUsers()
    fetchWeather()
  }, [fetchPosts, fetchUsers, fetchWeather])

  // Filtrer les posts par utilisateur
  const filteredPosts = selectedUserId 
    ? posts.filter(post => post.userId === selectedUserId)
    : posts

  return (
    <div>
      <h2>🌐 Intégration API</h2>
      <p>Consommation d'APIs REST avec JavaScript/TypeScript</p>

      {/* État de chargement et erreurs */}
      {loading && (
        <div className="card" style={{ backgroundColor: '#646cff' }}>
          <p>⏳ Chargement en cours...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ backgroundColor: '#ff4757' }}>
          <p>❌ Erreur: {error}</p>
        </div>
      )}

      <div className="grid">
        {/* Météo */}
        <div className="card">
          <h3>🌤️ Météo</h3>
          {weather ? (
            <div>
              <h4>{weather.location}</h4>
              <p>🌡️ {weather.temperature}°C</p>
              <p>☁️ {weather.description}</p>
              <p>💧 Humidité: {weather.humidity}%</p>
              <p>💨 Vent: {weather.windSpeed} km/h</p>
              <button onClick={() => fetchWeather('Lyon')}>Actualiser</button>
            </div>
          ) : (
            <p>Chargement de la météo...</p>
          )}
        </div>

        {/* Filtre par utilisateur */}
        <div className="card">
          <h3>👥 Filtrer par utilisateur</h3>
          <select 
            value={selectedUserId || ''} 
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tous les utilisateurs</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <p>Posts affichés: {filteredPosts.length}</p>
        </div>
      </div>

      {/* Liste des posts */}
      <div className="card">
        <h3>📝 Posts ({filteredPosts.length})</h3>
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          {filteredPosts.map(post => {
            const author = users.find(user => user.id === post.userId)
            return (
              <div key={post.id} className="card" style={{ margin: '0.5rem 0' }}>
                <div className="flex">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                    <small>Par: {author?.name || 'Utilisateur inconnu'}</small>
                  </div>
                  <button 
                    onClick={() => deletePost(post.id)}
                    style={{ backgroundColor: '#ff4757' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Formulaire de création de post */}
      <div className="card">
        <h3>✏️ Créer un nouveau post</h3>
        <CreatePostForm onCreatePost={createPost} users={users} />
      </div>

      {/* Types d'APIs et méthodes HTTP */}
      <div className="card">
        <h3>📚 Types d'APIs et Méthodes HTTP</h3>
        <div className="grid">
          <div>
            <h4>Méthodes HTTP</h4>
            <ul style={{ textAlign: 'left' }}>
              <li><strong>GET:</strong> Récupérer des données</li>
              <li><strong>POST:</strong> Créer de nouvelles données</li>
              <li><strong>PUT:</strong> Mettre à jour complètement</li>
              <li><strong>PATCH:</strong> Mettre à jour partiellement</li>
              <li><strong>DELETE:</strong> Supprimer des données</li>
            </ul>
          </div>
          <div>
            <h4>Codes de statut</h4>
            <ul style={{ textAlign: 'left' }}>
              <li><strong>200:</strong> Succès</li>
              <li><strong>201:</strong> Créé avec succès</li>
              <li><strong>400:</strong> Erreur client</li>
              <li><strong>404:</strong> Non trouvé</li>
              <li><strong>500:</strong> Erreur serveur</li>
            </ul>
          </div>
          <div>
            <h4>Gestion d'erreurs</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Vérifier response.ok</li>
              <li>Utiliser try/catch</li>
              <li>Afficher les erreurs</li>
              <li>Gérer les timeouts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bonnes pratiques */}
      <div className="card">
        <h3>✅ Bonnes Pratiques API</h3>
        <div className="grid">
          <div>
            <h4>Gestion des états</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Loading state</li>
              <li>Error state</li>
              <li>Success state</li>
              <li>Empty state</li>
            </ul>
          </div>
          <div>
            <h4>Sécurité</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Validation des données</li>
              <li>Gestion des tokens</li>
              <li>HTTPS obligatoire</li>
              <li>Rate limiting</li>
            </ul>
          </div>
          <div>
            <h4>Performance</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Mise en cache</li>
              <li>Pagination</li>
              <li>Lazy loading</li>
              <li>Optimisation des requêtes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour créer un nouveau post
interface CreatePostFormProps {
  onCreatePost: (postData: Omit<Post, 'id'>) => Promise<Post>
  users: User[]
}

function CreatePostForm({ onCreatePost, users }: CreatePostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.body.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setIsSubmitting(true)
    try {
      await onCreatePost(formData)
      setFormData({ title: '', body: '', userId: 1 })
      alert('Post créé avec succès!')
    } catch (err) {
      alert('Erreur lors de la création du post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid">
        <div>
          <label>Titre:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre du post"
            required
          />
        </div>
        <div>
          <label>Auteur:</label>
          <select
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <label>Contenu:</label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Contenu du post"
          required
          style={{ width: '100%', minHeight: '100px' }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{ marginTop: '1rem' }}
      >
        {isSubmitting ? 'Création...' : 'Créer le post'}
      </button>
    </form>
  )
}
