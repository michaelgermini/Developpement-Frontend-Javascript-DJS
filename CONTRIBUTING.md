# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer au projet DJS Frontend Development ! Ce guide vous aidera à comprendre comment contribuer efficacement.

## 📋 Table des Matières

- [Comment Contribuer](#comment-contribuer)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Rapport de Bugs](#rapport-de-bugs)
- [Suggestions de Fonctionnalités](#suggestions-de-fonctionnalités)

## 🚀 Comment Contribuer

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork localement
git clone https://github.com/votre-username/djs-frontend-development.git
cd djs-frontend-development

# Ajoutez le repository original comme upstream
git remote add upstream https://github.com/original-owner/djs-frontend-development.git
```

### 2. Installation

```bash
# Installez les dépendances
npm install

# Vérifiez que tout fonctionne
npm run dev
npm run lint
npm run type-check
```

### 3. Créer une Branche

```bash
# Créez une branche pour votre contribution
git checkout -b feature/nom-de-votre-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

## 📝 Standards de Code

### TypeScript/JavaScript

- **Types explicites** : Utilisez des types TypeScript explicites
- **Interfaces** : Définissez des interfaces pour les props et les données
- **Fonctions pures** : Privilégiez les fonctions pures quand possible
- **Nommage** : Utilisez des noms descriptifs en camelCase

```typescript
// ✅ Bon
interface UserProps {
  name: string;
  age: number;
  isActive: boolean;
}

const UserComponent: React.FC<UserProps> = ({ name, age, isActive }) => {
  // ...
};

// ❌ Éviter
const User = (props: any) => {
  // ...
};
```

### React

- **Composants fonctionnels** : Utilisez des composants fonctionnels avec hooks
- **Props typées** : Définissez des interfaces pour les props
- **Hooks personnalisés** : Créez des hooks réutilisables
- **Gestion d'état** : Utilisez useState et useEffect appropriément

```typescript
// ✅ Bon
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    // ...
  });
  return [value, setValue] as const;
};

// ❌ Éviter
const [data, setData] = useState(null);
```

### CSS

- **Classes sémantiques** : Utilisez des noms de classes descriptifs
- **Responsive** : Assurez-vous que le design est responsive
- **Accessibilité** : Respectez les standards d'accessibilité

```css
/* ✅ Bon */
.user-card {
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
}

/* ❌ Éviter */
.card1 {
  padding: 10px;
  border-radius: 5px;
}
```

## 🔄 Processus de Pull Request

### 1. Préparer votre Contribution

```bash
# Assurez-vous que votre code est à jour
git fetch upstream
git checkout main
git merge upstream/main

# Rebasez votre branche si nécessaire
git checkout feature/votre-fonctionnalite
git rebase main
```

### 2. Tests et Vérifications

```bash
# Lancez les tests
npm run lint
npm run type-check
npm run build

# Testez manuellement
npm run dev
```

### 3. Commit et Push

```bash
# Committez avec un message descriptif
git commit -m "feat: ajouter la fonctionnalité de recherche avancée"

# Push vers votre fork
git push origin feature/votre-fonctionnalite
```

### 4. Créer la Pull Request

1. Allez sur GitHub et créez une Pull Request
2. Utilisez le template fourni
3. Décrivez clairement vos changements
4. Ajoutez des captures d'écran si nécessaire

### 5. Convention de Commits

Utilisez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: tests
chore: tâches de maintenance
```

## 🐛 Rapport de Bugs

### Avant de Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Testez avec la dernière version
3. Reproduisez le bug de manière cohérente

### Template de Rapport

```markdown
**Description du Bug**
Description claire et concise du bug.

**Étapes pour Reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

**Comportement Attendu**
Description de ce qui devrait se passer.

**Captures d'Écran**
Si applicable, ajoutez des captures d'écran.

**Environnement**
- OS: [ex: Windows 10]
- Navigateur: [ex: Chrome 120]
- Version: [ex: 1.0.0]

**Informations Supplémentaires**
Toute autre information pertinente.
```

## 💡 Suggestions de Fonctionnalités

### Avant de Proposer une Fonctionnalité

1. Vérifiez que la fonctionnalité n'existe pas déjà
2. Assurez-vous qu'elle s'aligne avec les objectifs du projet
3. Pensez à l'impact sur l'expérience utilisateur

### Template de Suggestion

```markdown
**Problème à Résoudre**
Description claire du problème que cette fonctionnalité résoudrait.

**Solution Proposée**
Description de la solution proposée.

**Alternatives Considérées**
Autres solutions que vous avez considérées.

**Impact**
Impact sur l'expérience utilisateur et la maintenabilité.

**Exemples d'Utilisation**
Comment cette fonctionnalité serait utilisée.
```

## 🎯 Types de Contributions Sought

### Priorité Haute
- Corrections de bugs
- Améliorations de performance
- Améliorations d'accessibilité
- Documentation

### Priorité Moyenne
- Nouvelles fonctionnalités pédagogiques
- Améliorations UI/UX
- Tests supplémentaires

### Priorité Basse
- Refactoring mineur
- Optimisations cosmétiques

## 📞 Contact

Si vous avez des questions ou besoin d'aide :

- Ouvrez une issue sur GitHub
- Contactez l'équipe pédagogique de la HEA

## 🙏 Remerciements

Merci à tous les contributeurs qui participent à l'amélioration de ce projet pédagogique !

---

**Note** : Ce projet est destiné à l'apprentissage. Toutes les contributions doivent respecter cet objectif pédagogique.
