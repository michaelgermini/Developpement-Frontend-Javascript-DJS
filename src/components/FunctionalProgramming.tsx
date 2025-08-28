import React, { useState, useMemo, useCallback } from 'react'

interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

interface User {
  id: number
  name: string
  age: number
  city: string
}

export function FunctionalProgramming() {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Mouse', price: 25, category: 'Electronics', inStock: true },
    { id: 3, name: 'Book', price: 15, category: 'Books', inStock: false },
    { id: 4, name: 'Chair', price: 150, category: 'Furniture', inStock: true },
    { id: 5, name: 'Table', price: 200, category: 'Furniture', inStock: false },
    { id: 6, name: 'Phone', price: 800, category: 'Electronics', inStock: true }
  ])

  const [users] = useState<User[]>([
    { id: 1, name: 'Alice', age: 25, city: 'Paris' },
    { id: 2, name: 'Bob', age: 30, city: 'Lyon' },
    { id: 3, name: 'Claire', age: 28, city: 'Marseille' },
    { id: 4, name: 'David', age: 35, city: 'Paris' },
    { id: 5, name: 'Eva', age: 22, city: 'Toulouse' }
  ])

  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [searchTerm, setSearchTerm] = useState('')

  // Fonctions pures
  const filterByCategory = useCallback((items: Product[], category: string) => {
    return category === 'all' ? items : items.filter(item => item.category === category)
  }, [])

  const sortItems = useCallback(<T extends Product | User>(items: T[], key: keyof T) => {
    return [...items].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal)
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal
      }
      return 0
    })
  }, [])

  const searchItems = useCallback((items: Product[], term: string) => {
    return items.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase())
    )
  }, [])

  // Composition de fonctions
  const processProducts = useCallback((items: Product[], category: string, sortKey: keyof Product, search: string) => {
    return sortItems(
      searchItems(
        filterByCategory(items, category),
        search
      ),
      sortKey
    )
  }, [filterByCategory, sortItems, searchItems])

  // Utilisation de useMemo pour optimiser les calculs
  const processedProducts = useMemo(() => 
    processProducts(products, filterCategory, sortBy, searchTerm),
    [products, filterCategory, sortBy, searchTerm, processProducts]
  )

  const totalValue = useMemo(() => 
    products.reduce((sum, product) => sum + product.price, 0),
    [products]
  )

  const averagePrice = useMemo(() => 
    products.length > 0 ? totalValue / products.length : 0,
    [products.length, totalValue]
  )

  const categoryStats = useMemo(() => {
    const stats = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }, [products])

  // Fonctions d'ordre supérieur
  const createFilterFunction = (predicate: (item: Product) => boolean) => {
    return (items: Product[]) => items.filter(predicate)
  }

  const inStockFilter = createFilterFunction(item => item.inStock)
  const expensiveFilter = createFilterFunction(item => item.price > 100)

  const inStockProducts = useMemo(() => inStockFilter(products), [products])
  const expensiveProducts = useMemo(() => expensiveFilter(products), [products])

  // Fonction de transformation
  const transformProduct = (product: Product) => ({
    ...product,
    displayName: `${product.name} (${product.category})`,
    priceWithTax: product.price * 1.2,
    status: product.inStock ? 'En stock' : 'Rupture'
  })

  const transformedProducts = useMemo(() => 
    products.map(transformProduct),
    [products]
  )

  return (
    <div>
      <h2>🔄 Programmation Fonctionnelle</h2>
      <p>Concepts de programmation fonctionnelle en JavaScript/TypeScript</p>

      {/* Contrôles */}
      <div className="card">
        <h3>🎛️ Contrôles de filtrage</h3>
        <div className="flex">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            <option value="Electronics">Électronique</option>
            <option value="Books">Livres</option>
            <option value="Furniture">Meubles</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
          >
            <option value="name">Trier par nom</option>
            <option value="price">Trier par prix</option>
          </select>
          
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid">
        {/* Produits filtrés */}
        <div className="card">
          <h3>📦 Produits filtrés ({processedProducts.length})</h3>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            {processedProducts.map(product => (
              <div key={product.id} style={{ 
                padding: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'left'
              }}>
                <strong>{product.name}</strong> - {product.category}
                <br />
                <small>Prix: {product.price}€ | Stock: {product.inStock ? '✅' : '❌'}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="card">
          <h3>📊 Statistiques</h3>
          <div style={{ textAlign: 'left' }}>
            <p><strong>Valeur totale:</strong> {totalValue}€</p>
            <p><strong>Prix moyen:</strong> {averagePrice.toFixed(2)}€</p>
            <p><strong>En stock:</strong> {inStockProducts.length}/{products.length}</p>
            <p><strong>Produits chers (&gt;100€):</strong> {expensiveProducts.length}</p>
          </div>
          
          <h4>Par catégorie:</h4>
          <ul style={{ textAlign: 'left' }}>
            {Object.entries(categoryStats).map(([category, count]) => (
              <li key={category}>{category}: {count} produit(s)</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Produits transformés */}
      <div className="card">
        <h3>🔄 Produits transformés</h3>
        <div className="grid">
          {transformedProducts.slice(0, 3).map(product => (
            <div key={product.id} className="card">
              <h4>{product.displayName}</h4>
              <p>Prix HT: {product.price}€</p>
              <p>Prix TTC: {product.priceWithTax.toFixed(2)}€</p>
              <p>Statut: {product.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concepts de programmation fonctionnelle */}
      <div className="card">
        <h3>📚 Concepts de Programmation Fonctionnelle</h3>
        <div className="grid">
          <div>
            <h4>Fonctions pures</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Pas d'effets de bord</li>
              <li>Même entrée = même sortie</li>
              <li>Prévisibles et testables</li>
              <li>Ex: filterByCategory, sortItems</li>
            </ul>
          </div>
          <div>
            <h4>Composition de fonctions</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Combiner plusieurs fonctions</li>
              <li>Chaînage d'opérations</li>
              <li>Code plus lisible</li>
              <li>Ex: processProducts</li>
            </ul>
          </div>
          <div>
            <h4>Fonctions d'ordre supérieur</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Prendre des fonctions en paramètre</li>
              <li>Retourner des fonctions</li>
              <li>Réutilisabilité</li>
              <li>Ex: createFilterFunction</li>
            </ul>
          </div>
          <div>
            <h4>Immutabilité</h4>
            <ul style={{ textAlign: 'left' }}>
              <li>Ne pas modifier les données</li>
              <li>Créer de nouvelles copies</li>
              <li>Éviter les bugs</li>
              <li>Ex: [...items].sort()</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Méthodes fonctionnelles */}
      <div className="card">
        <h3>🔧 Méthodes Fonctionnelles JavaScript</h3>
        <div className="grid">
          <div>
            <h4>Array.map()</h4>
            <p>Transformer chaque élément</p>
            <code>items.map(item =&gt; transformItem(item))</code>
          </div>
          <div>
            <h4>Array.filter()</h4>
            <p>Filtrer les éléments</p>
            <code>items.filter(item =&gt; condition(item))</code>
          </div>
          <div>
            <h4>Array.reduce()</h4>
            <p>Réduire à une valeur</p>
            <code>items.reduce((acc, item) =&gt; acc + item, 0)</code>
          </div>
          <div>
            <h4>Array.find()</h4>
            <p>Trouver le premier élément</p>
            <code>items.find(item =&gt; condition(item))</code>
          </div>
        </div>
      </div>
    </div>
  )
}
