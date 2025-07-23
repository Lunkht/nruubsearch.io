# nrrubSearch 🔍

Un moteur de recherche moderne et personnalisable avec interface utilisateur avancée.

## 🚀 Fonctionnalités

- **Interface moderne** : Design responsive avec mode sombre/clair
- **Recherche avancée** : Filtres par type de contenu, tri, limitation des résultats
- **Suggestions intelligentes** : Autocomplétion basée sur l'historique
- **Historique de recherche** : Sauvegarde locale des recherches précédentes
- **API REST** : Backend FastAPI avec endpoints de recherche

## 📁 Structure du projet

```
nrrubSearch/
├── backend/           # API FastAPI
│   ├── main.py       # Serveur principal
│   ├── crawler.py    # Collecteur de données
│   ├── indexer.py    # Création d'index
│   └── requirements.txt
├── frontend/         # Interface utilisateur
│   ├── script.js     # Logique principale
│   ├── style.css     # Styles CSS
│   └── *.html        # Pages de l'interface
├── assets/           # Ressources (logos, icônes)
└── vercel.json       # Configuration de déploiement
```

## 🛠️ Installation et développement local

### Prérequis
- Python 3.8+
- Node.js (optionnel, pour le développement frontend)

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd nrrubSearch
```

### 2. Installer les dépendances backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. Générer l'index de recherche
```bash
# Collecter les données (optionnel, des données d'exemple existent déjà)
python crawler.py

# Créer l'index de recherche
python indexer.py
```

### 4. Démarrer le serveur de développement
```bash
# Démarrer le backend sur le port 8002
uvicorn main:app --reload --port 8002

# Dans un autre terminal, servir le frontend
# Option 1: Serveur Python simple
python -m http.server 3000

# Option 2: Live Server (VS Code extension)
# Ouvrir index.html avec Live Server
```

### 5. Accéder à l'application
- Frontend : http://localhost:3000
- API Backend : http://localhost:8002/api/health

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel
1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement la configuration `vercel.json`
3. Le déploiement se fera automatiquement

### Méthode 2 : Via CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel --prod
```

### Variables d'environnement (optionnel)
Pour la production, vous pouvez configurer :
- `CORS_ORIGINS` : Domaines autorisés pour CORS
- `INDEX_FILE_PATH` : Chemin vers le fichier d'index

## 📡 API Endpoints

### GET /api/search
Recherche dans l'index

**Paramètres :**
- `q` (string) : Terme de recherche

**Réponse :**
```json
[
  {
    "title": "Titre de la page",
    "url": "URL ou chemin du fichier"
  }
]
```

### GET /api/health
Vérification de l'état du serveur

**Réponse :**
```json
{
  "status": "ok",
  "index_loaded": true
}
```

## 🔧 Personnalisation

### Ajouter de nouvelles sources
1. Modifier `crawler.py` pour ajouter des URLs
2. Exécuter le crawler : `python crawler.py`
3. Régénérer l'index : `python indexer.py`
4. Redémarrer le serveur

### Modifier l'interface
- **Styles** : Éditer `frontend/style.css`
- **Fonctionnalités** : Modifier `frontend/script.js`
- **Pages** : Ajouter des fichiers HTML dans `frontend/`

## 🐛 Résolution de problèmes

### Erreur "Vérifiez la connexion au serveur"
- Vérifiez que le backend est démarré
- Contrôlez l'URL de l'API dans la console du navigateur
- En local : backend doit être sur le port 8002

### Index vide ou recherche sans résultats
- Exécutez `python indexer.py` dans le dossier backend
- Vérifiez que `index.json` existe et contient des données

### Problèmes de CORS en développement
- Le middleware CORS est configuré pour accepter toutes les origines
- En production, modifiez `allow_origins` dans `main.py`

## 🚀 Améliorations futures

- [ ] Base de données persistante (PostgreSQL/MongoDB)
- [ ] Scoring TF-IDF pour la pertinence
- [ ] Authentification utilisateur
- [ ] Crawling automatique et planifié
- [ ] Analytics et monitoring
- [ ] Support de fichiers PDF/DOC
- [ ] Recherche par facettes
- [ ] API de suggestion avancée

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

---

**Développé avec ❤️ en utilisant FastAPI et JavaScript vanilla**