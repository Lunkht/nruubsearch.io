document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsList = document.getElementById('results-list');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const filtersToggle = document.getElementById('filters-toggle');
    const filtersPanel = document.getElementById('filters-panel');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let currentSuggestionIndex = -1;
    let searchTimeout = null;
    let currentResults = [];
    let currentQuery = '';

    // Gestion du mode sombre/clair
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    };

    // Fonction pour basculer le thème
    window.toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    };

    // Initialiser le thème au chargement
    initializeTheme();

    // Fonction pour basculer le menu des paramètres
    window.toggleSettingsMenu = () => {
        const menu = document.getElementById('settings-menu');
        menu.classList.toggle('show');
    };

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (event) => {
        const menu = document.getElementById('settings-menu');
        const button = document.querySelector('.settings-button');
        
        if (menu && !menu.contains(event.target) && !button.contains(event.target)) {
            menu.classList.remove('show');
        }
    });

    // Configuration de l'URL de l'API
    const getApiUrl = () => {
        // En production sur Vercel, utiliser l'URL relative
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return '/api';
        }
        // En développement local
        return 'http://localhost:5000/api';
    };

    const performSearch = async (query = null) => {
        const searchQuery = query || searchInput.value.trim();
        if (searchQuery) {
            hideSuggestions();
            
            // Afficher le spinner dans le bouton
            if (searchButton) {
                searchButton.innerHTML = '<div class="loading-spinner"></div>';
                searchButton.disabled = true;
            }
            
            // Ajouter à l'historique
            addToSearchHistory(searchQuery);
            currentQuery = searchQuery;
            
            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(searchQuery)}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const results = await response.json();
                currentResults = results;
                applyFiltersAndDisplay();
            } catch (error) {
                console.error('Error fetching search results:', error);
                resultsList.innerHTML = '<li style="color: #e74c3c; text-align: center; padding: 20px; background: rgba(231, 76, 60, 0.1); border-radius: 12px; margin: 20px 0;">❌ Erreur lors de la recherche. Veuillez réessayer.</li>';
            } finally {
                // Restaurer le bouton
                if (searchButton) {
                    searchButton.innerHTML = '🔍';
                    searchButton.disabled = false;
                }
            }
        } else {
            resultsList.innerHTML = '';
        }
    };
    
    // Fonction pour basculer l'affichage des filtres
    const toggleFilters = () => {
        filtersPanel.classList.toggle('show');
        filtersToggle.classList.toggle('active');
    };
    
    // Fonction pour appliquer les filtres
    const applyFiltersAndDisplay = () => {
        if (currentResults.length === 0) {
            displayResults([], currentQuery);
            return;
        }
        
        let filteredResults = [...currentResults];
        
        // Filtrer par type de contenu
        const contentType = document.getElementById('content-type-filter').value;
        if (contentType !== 'all') {
            filteredResults = filteredResults.filter(result => {
                const url = result.url.toLowerCase();
                switch (contentType) {
                    case 'html':
                        return url.includes('.html') || url.includes('.htm');
                    case 'text':
                        return url.includes('.txt') || url.includes('.md');
                    case 'code':
                        return url.includes('.js') || url.includes('.py') || url.includes('.css') || url.includes('.json');
                    default:
                        return true;
                }
            });
        }
        
        // Trier les résultats
        const sortBy = document.getElementById('sort-filter').value;
        switch (sortBy) {
            case 'title':
                filteredResults.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'url':
                filteredResults.sort((a, b) => a.url.localeCompare(b.url));
                break;
            case 'random':
                filteredResults = filteredResults.sort(() => Math.random() - 0.5);
                break;
            case 'relevance':
            default:
                // Garder l'ordre original (pertinence)
                break;
        }
        
        // Limiter le nombre de résultats
        const limit = parseInt(document.getElementById('results-limit').value);
        if (limit !== 100) {
            filteredResults = filteredResults.slice(0, limit);
        }
        
        displayResults(filteredResults, currentQuery);
    };
    
    const addToSearchHistory = (query) => {
        if (!searchHistory.includes(query)) {
            searchHistory.unshift(query);
            searchHistory = searchHistory.slice(0, 10); // Garder seulement les 10 dernières recherches
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    };
    
    const showSuggestions = (suggestions) => {
        suggestionsContainer.innerHTML = '';
        currentSuggestionIndex = -1;
        
        if (suggestions.length > 0) {
            suggestions.forEach((suggestion, index) => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = suggestion;
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    performSearch(suggestion);
                });
                suggestionsContainer.appendChild(suggestionItem);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            hideSuggestions();
        }
    };
    
    const hideSuggestions = () => {
        suggestionsContainer.style.display = 'none';
        currentSuggestionIndex = -1;
    };
    
    const getSuggestions = (query) => {
        if (!query.trim()) return [];
        
        // Filtrer l'historique de recherche pour les suggestions
        const historySuggestions = searchHistory.filter(item => 
            item.toLowerCase().includes(query.toLowerCase()) && item !== query
        );
        
        // Ajouter quelques suggestions prédéfinies
        const predefinedSuggestions = [
            'recherche avancée',
            'documentation',
            'tutoriel',
            'guide',
            'exemple'
        ].filter(item => 
            item.toLowerCase().includes(query.toLowerCase()) && item !== query
        );
        
        return [...new Set([...historySuggestions, ...predefinedSuggestions])].slice(0, 5);
    };
    
    const navigateSuggestions = (direction) => {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return;
        
        // Retirer la surbrillance actuelle
        if (currentSuggestionIndex >= 0) {
            suggestions[currentSuggestionIndex].classList.remove('highlighted');
        }
        
        // Calculer le nouvel index
        if (direction === 'down') {
            currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
        } else {
            currentSuggestionIndex = currentSuggestionIndex <= 0 ? suggestions.length - 1 : currentSuggestionIndex - 1;
        }
        
        // Ajouter la surbrillance
        suggestions[currentSuggestionIndex].classList.add('highlighted');
        searchInput.value = suggestions[currentSuggestionIndex].textContent;
    };

    const displayResults = (results, query) => {
        resultsList.innerHTML = '';
        if (results.length === 0) {
            resultsList.innerHTML = `<li style="text-align: center; color: rgba(255,255,255,0.7); padding: 40px; background: rgba(255,255,255,0.1); border-radius: 16px; margin: 20px 0;">🔍 Aucun résultat trouvé pour "${query}".</li>`;
            return;
        }

        // Ajouter un en-tête avec le nombre de résultats
        const headerItem = document.createElement('li');
        headerItem.style.fontWeight = 'bold';
        headerItem.style.borderBottom = '2px solid #3498db';
        headerItem.style.marginBottom = '15px';
        headerItem.innerHTML = `📊 ${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''} pour "${query}"`;
        resultsList.appendChild(headerItem);

        results.forEach((result, index) => {
            const listItem = document.createElement('li');
            listItem.style.animationDelay = `${index * 0.1}s`;
            listItem.style.opacity = '0';
            listItem.style.transform = 'translateY(20px)';
            listItem.classList.add('result-item-animated');
            
            const link = document.createElement('a');
            link.href = result.url;
            link.textContent = result.title || 'Document sans titre';
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const description = document.createElement('p');
            description.textContent = result.description || `📄 ${result.url}`;
            
            // Ajouter un indicateur de pertinence (simulé)
            const relevanceScore = document.createElement('span');
            relevanceScore.style.float = 'right';
            relevanceScore.style.fontSize = '12px';
            relevanceScore.style.color = '#3498db';
            relevanceScore.textContent = `⭐ ${Math.floor(Math.random() * 5) + 1}/5`;

            listItem.appendChild(link);
            listItem.appendChild(relevanceScore);
            listItem.appendChild(description);
            resultsList.appendChild(listItem);
            
            // Animation d'apparition
            setTimeout(() => {
                listItem.style.opacity = '1';
                listItem.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };

    // Gestionnaires d'événements améliorés
    searchButton.addEventListener('click', () => performSearch());
    
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        
        // Débounce pour éviter trop de requêtes
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (query.length > 0) {
                const suggestions = getSuggestions(query);
                showSuggestions(suggestions);
            } else {
                hideSuggestions();
            }
        }, 300);
    });
    
    searchInput.addEventListener('keydown', (event) => {
        const suggestionsVisible = suggestionsContainer.style.display === 'block';
        
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (suggestionsVisible && currentSuggestionIndex >= 0) {
                    const selectedSuggestion = suggestionsContainer.querySelectorAll('.suggestion-item')[currentSuggestionIndex].textContent;
                    searchInput.value = selectedSuggestion;
                    performSearch(selectedSuggestion);
                } else {
                    performSearch();
                }
                break;
            case 'ArrowDown':
                if (suggestionsVisible) {
                    event.preventDefault();
                    navigateSuggestions('down');
                }
                break;
            case 'ArrowUp':
                if (suggestionsVisible) {
                    event.preventDefault();
                    navigateSuggestions('up');
                }
                break;
            case 'Escape':
                hideSuggestions();
                break;
        }
    });
    
    // Gestionnaires d'événements pour les filtres
    filtersToggle.addEventListener('click', toggleFilters);
    applyFiltersBtn.addEventListener('click', applyFiltersAndDisplay);
    
    // Appliquer les filtres automatiquement quand on change les sélections
    document.getElementById('content-type-filter').addEventListener('change', applyFiltersAndDisplay);
    document.getElementById('sort-filter').addEventListener('change', applyFiltersAndDisplay);
    document.getElementById('results-limit').addEventListener('change', applyFiltersAndDisplay);
    
    // Fermer les suggestions en cliquant ailleurs
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            hideSuggestions();
        }
        
        // Fermer les filtres si on clique ailleurs
        if (!filtersPanel.contains(event.target) && !filtersToggle.contains(event.target)) {
            filtersPanel.classList.remove('show');
            filtersToggle.classList.remove('active');
        }
    });
    
    // Focus automatique sur le champ de recherche
    searchInput.focus();
});
