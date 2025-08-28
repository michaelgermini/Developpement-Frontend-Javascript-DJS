import React, { useState } from 'react'
import { DOMExamples } from './components/DOMExamples'
import { EventHandling } from './components/EventHandling'
import { FunctionalProgramming } from './components/FunctionalProgramming'
import { APIIntegration } from './components/APIIntegration'
import { Widgets2D } from './components/Widgets2D'
import { TypeScriptExamples } from './components/TypeScriptExamples'

type ModuleType = 'dom' | 'events' | 'functional' | 'api' | 'widgets' | 'typescript'

function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dom')

  const modules = [
    { id: 'dom', name: 'DOM et Objets JavaScript', component: DOMExamples },
    { id: 'events', name: 'Programmation Événementielle', component: EventHandling },
    { id: 'functional', name: 'Programmation Fonctionnelle', component: FunctionalProgramming },
    { id: 'api', name: 'Intégration API', component: APIIntegration },
    { id: 'widgets', name: 'Widgets et Graphisme 2D', component: Widgets2D },
    { id: 'typescript', name: 'Exemples TypeScript', component: TypeScriptExamples }
  ]

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || DOMExamples

  return (
    <div className="app">
      <header className="card">
        <h1>🚀 DJS - Développement Frontend Javascript</h1>
        <p>Module 40.102 - Haute École Arc Ingénierie</p>
        <p>Développement d'applications web avec JavaScript et TypeScript</p>
      </header>

      <nav className="card">
        <div className="flex">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id as ModuleType)}
              style={{
                backgroundColor: activeModule === module.id ? '#646cff' : '#1a1a1a'
              }}
            >
              {module.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="card">
        <ActiveComponent />
      </main>

      <footer className="card">
        <p>© 2025 - Module DJS - Responsable: Marc Schaefer</p>
        <p>Crédits ECTS: 2 | Volume: 50h (20h enseignement + 30h travail personnel)</p>
      </footer>
    </div>
  )
}

export default App
