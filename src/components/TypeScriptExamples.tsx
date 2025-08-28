import React, { useState, useEffect } from 'react'

// Types de base
type Status = 'idle' | 'loading' | 'success' | 'error'
type UserRole = 'admin' | 'user' | 'guest'
type Priority = 'low' | 'medium' | 'high'

// Interfaces
interface User {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: Date
}

interface Task {
  id: number
  title: string
  description: string
  priority: Priority
  status: Status
  assignee?: User
  dueDate?: Date
}

interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: Date
}

// Types utilitaires
type PartialUser = Partial<User>
type RequiredUser = Required<User>
type PickUser = Pick<User, 'id' | 'name' | 'email'>
type OmitUser = Omit<User, 'password' | 'createdAt'>

// Types conditionnels
type NonNullableUser = NonNullable<User | null | undefined>
type StringKeys = keyof User
type NumberKeys = keyof { [K in keyof User]: User[K] extends number ? K : never }[keyof User]

// Types de fonctions
type EventHandler<T = Event> = (event: T) => void
type AsyncFunction<T, R> = (param: T) => Promise<R>
type Validator<T> = (value: T) => boolean

// Classes avec TypeScript
class TaskManager {
  private tasks: Task[] = []
  private users: User[] = []

  constructor(initialTasks: Task[] = [], initialUsers: User[] = []) {
    this.tasks = initialTasks
    this.users = initialUsers
  }

  // Méthodes génériques
  addTask<T extends Partial<Task>>(taskData: T): Task {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title || 'Nouvelle tâche',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: 'idle',
      assignee: taskData.assignee,
      dueDate: taskData.dueDate
    }
    this.tasks.push(newTask)
    return newTask
  }

  getTasksByStatus(status: Status): Task[] {
    return this.tasks.filter(task => task.status === status)
  }

  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(task => task.priority === priority)
  }

  updateTaskStatus(id: number, status: Status): Task | null {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.status = status
      return task
    }
    return null
  }

  getTasks(): Task[] {
    return [...this.tasks]
  }

  getUsers(): User[] {
    return [...this.users]
  }
}

// Fonctions utilitaires avec TypeScript
const createUser = (userData: PartialUser): User => {
  return {
    id: Date.now(),
    name: userData.name || 'Utilisateur',
    email: userData.email || 'user@example.com',
    role: userData.role || 'user',
    isActive: userData.isActive ?? true,
    createdAt: userData.createdAt || new Date()
  }
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Hooks personnalisés avec TypeScript
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

const useApi = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}

export function TypeScriptExamples() {
  const [taskManager] = useState(() => new TaskManager())
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium'
  })
  const [selectedStatus, setSelectedStatus] = useState<Status>('idle')
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
  
  // Utilisation du hook personnalisé
  const [savedTasks, setSavedTasks] = useLocalStorage<Task[]>('tasks', [])
  const { data: apiData, loading, error } = useApi<ApiResponse<Task[]>>('https://jsonplaceholder.typicode.com/posts?_limit=3')

  // Ajouter une tâche
  const handleAddTask = () => {
    if (newTask.title?.trim()) {
      const task = taskManager.addTask(newTask)
      setSavedTasks(prev => [...prev, task])
      setNewTask({ title: '', description: '', priority: 'medium' })
    }
  }

  // Filtrer les tâches
  const filteredTasks = taskManager.getTasks().filter(task => {
    const statusMatch = selectedStatus === 'idle' || task.status === selectedStatus
    const priorityMatch = selectedPriority === 'medium' || task.priority === selectedPriority
    return statusMatch && priorityMatch
  })

  return (
    <div>
      <h2>🔷 Exemples TypeScript</h2>
      <p>Concepts avancés de TypeScript et bonnes pratiques</p>

      <div className="grid">
        {/* Types et interfaces */}
        <div className="card">
          <h3>📋 Types et Interfaces</h3>
          <div style={{ textAlign: 'left' }}>
            <h4>Types de base:</h4>
            <ul>
              <li><code>Status:</code> 'idle' | 'loading' | 'success' | 'error'</li>
              <li><code>UserRole:</code> 'admin' | 'user' | 'guest'</li>
              <li><code>Priority:</code> 'low' | 'medium' | 'high'</li>
            </ul>
            
            <h4>Types utilitaires:</h4>
            <ul>
              <li><code>Partial&lt;T&gt;:</code> Rend toutes les propriétés optionnelles</li>
              <li><code>Required&lt;T&gt;:</code> Rend toutes les propriétés obligatoires</li>
              <li><code>Pick&lt;T, K&gt;:</code> Sélectionne des propriétés spécifiques</li>
              <li><code>Omit&lt;T, K&gt;:</code> Exclut des propriétés spécifiques</li>
            </ul>
          </div>
        </div>

        {/* Gestionnaire de tâches */}
        <div className="card">
          <h3>📝 Gestionnaire de tâches</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Titre de la tâche"
              value={newTask.title || ''}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
            <button onClick={handleAddTask}>Ajouter</button>
          </div>
          
          <textarea
            placeholder="Description (optionnelle)"
            value={newTask.description || ''}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ width: '100%', marginTop: '1rem', minHeight: '80px' }}
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <h3>🔍 Filtres</h3>
        <div className="flex">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Status)}
          >
            <option value="idle">Tous les statuts</option>
            <option value="loading">En cours</option>
            <option value="success">Terminé</option>
            <option value="error">Erreur</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Priority)}
          >
            <option value="medium">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="card">
        <h3>📋 Tâches ({filteredTasks.length})</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          {filteredTasks.map(task => (
            <div key={task.id} className="card" style={{ margin: '0.5rem 0' }}>
              <div style={{ textAlign: 'left' }}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="flex">
                  <span style={{ 
                    backgroundColor: task.priority === 'high' ? '#ff4757' : 
                                   task.priority === 'medium' ? '#ffa502' : '#2ed573',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {task.priority}
                  </span>
                  <span style={{ 
                    backgroundColor: task.status === 'success' ? '#2ed573' : 
                                   task.status === 'error' ? '#ff4757' : '#646cff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    marginLeft: '0.5rem'
                  }}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Storage */}
      <div className="card">
        <h3>💾 Local Storage</h3>
        <p>Tâches sauvegardées: {savedTasks.length}</p>
        <button onClick={() => setSavedTasks([])}>Vider le cache</button>
      </div>

      {/* API Data */}
      <div className="card">
        <h3>🌐 Données API</h3>
        {loading && <p>⏳ Chargement...</p>}
        {error && <p style={{ color: '#ff4757' }}>❌ Erreur: {error}</p>}
        {apiData && (
          <div>
            <p>Données récupérées: {apiData.data?.length || 0} éléments</p>
            <p>Statut: {apiData.status}</p>
            <p>Message: {apiData.message}</p>
          </div>
        )}
      </div>

      {/* Concepts TypeScript */}
      <div className="card">
        <h3>📚 Concepts TypeScript Avancés</h3>
        <div className="grid">
          <div>
            <h4>Types génériques</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Classes génériques</li>
              <li>Fonctions génériques</li>
              <li>Interfaces génériques</li>
              <li>Contraintes de types</li>
            </ul>
          </div>
          <div>
            <h4>Types conditionnels</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Conditional types</li>
              <li>Infer keyword</li>
              <li>Mapped types</li>
              <li>Template literal types</li>
            </ul>
          </div>
          <div>
            <h4>Types utilitaires</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Partial, Required</li>
              <li>Pick, Omit</li>
              <li>Record, ReturnType</li>
              <li>Parameters, InstanceType</li>
            </ul>
          </div>
          <div>
            <h4>Bonnes pratiques</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Strict mode activé</li>
              <li>Types explicites</li>
              <li>Interfaces vs Types</li>
              <li>Documentation JSDoc</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exemples de code */}
      <div className="card">
        <h3>💻 Exemples de Code</h3>
        <div className="grid">
          <div>
            <h4>Interface avec génériques</h4>
            <pre style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
{`interface ApiResponse<T> {
  data: T
  status: number
  message: string
}`}
            </pre>
          </div>
          <div>
            <h4>Type conditionnel</h4>
            <pre style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
{`type NonNullableUser = 
  NonNullable<User | null | undefined>`}
            </pre>
          </div>
          <div>
            <h4>Hook personnalisé</h4>
            <pre style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
{`const useLocalStorage = <T>(
  key: string, 
  initialValue: T
) => {
  // Implementation...
}`}
            </pre>
          </div>
          <div>
            <h4>Classe générique</h4>
            <pre style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
{`class TaskManager {
  private tasks: Task[] = []
  
  addTask<T extends Partial<Task>>(
    taskData: T
  ): Task {
    // Implementation...
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
