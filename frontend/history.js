document.addEventListener('DOMContentLoaded', () => {
    const searchHistoryList = document.getElementById('search-history-list');
    const clearHistoryButton = document.getElementById('clear-history-button');
    const noHistoryDiv = document.getElementById('no-history');
    const searchFilter = document.getElementById('search-filter');
    const dateFilter = document.getElementById('date-filter');
    const saveHistoryCheckbox = document.getElementById('save-history');
    const autoSuggestionsCheckbox = document.getElementById('auto-suggestions');

    // Initialiser le thème
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    };

    // Charger l'historique de recherche
    function loadSearchHistory() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const filterText = searchFilter.value.toLowerCase();
        const dateFilterValue = dateFilter.value;
        
        let filteredHistory = history.filter(item => {
            const matchesText = item.query.toLowerCase().includes(filterText);
            const matchesDate = filterByDate(item.timestamp, dateFilterValue);
            return matchesText && matchesDate;
        });
        
        displayHistory(filteredHistory);
        updateStats(history);
    }

    // Filtrer par date
    function filterByDate(timestamp, filter) {
        if (filter === 'all') return true;
        
        const now = new Date();
        const itemDate = new Date(timestamp);
        
        switch (filter) {
            case 'today':
                return itemDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return itemDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return itemDate >= monthAgo;
            default:
                return true;
        }
    }

    // Afficher l'historique
    function displayHistory(history) {
        searchHistoryList.innerHTML = '';
        
        if (history.length === 0) {
            noHistoryDiv.style.display = 'block';
            searchHistoryList.style.display = 'none';
            return;
        }
        
        noHistoryDiv.style.display = 'none';
        searchHistoryList.style.display = 'block';
        
        // Trier par date (plus récent en premier)
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'history-item';
            
            const date = new Date(item.timestamp);
            const timeString = date.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            listItem.innerHTML = `
                <div class="history-content">
                    <span class="search-query" onclick="searchAgain('${item.query.replace(/'/g, "\\'")}')">"${item.query}"</span>
                    <span class="search-time">${timeString}</span>
                </div>
                <button class="delete-item" onclick="deleteHistoryItem('${item.id}')" title="Supprimer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            `;
            
            searchHistoryList.appendChild(listItem);
        });
    }

    // Mettre à jour les statistiques
    function updateStats(history) {
        const totalSearches = history.length;
        const uniqueTerms = new Set(history.map(item => item.query.toLowerCase())).size;
        const today = new Date().toDateString();
        const todaySearches = history.filter(item => 
            new Date(item.timestamp).toDateString() === today
        ).length;
        
        document.getElementById('total-searches').textContent = totalSearches;
        document.getElementById('unique-terms').textContent = uniqueTerms;
        document.getElementById('today-searches').textContent = todaySearches;
    }

    // Rechercher à nouveau
    window.searchAgain = (query) => {
        // Rediriger vers la page principale avec la requête
        window.location.href = `../index.html?q=${encodeURIComponent(query)}`;
    };

    // Supprimer un élément de l'historique
    window.deleteHistoryItem = (id) => {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history = history.filter(item => item.id !== id);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        loadSearchHistory();
    };

    // Effacer tout l'historique
    clearHistoryButton.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique de recherche ?')) {
            localStorage.removeItem('searchHistory');
            loadSearchHistory();
        }
    });

    // Filtres
    searchFilter.addEventListener('input', loadSearchHistory);
    dateFilter.addEventListener('change', loadSearchHistory);

    // Paramètres
    saveHistoryCheckbox.addEventListener('change', () => {
        localStorage.setItem('saveHistory', saveHistoryCheckbox.checked);
    });

    autoSuggestionsCheckbox.addEventListener('change', () => {
        localStorage.setItem('autoSuggestions', autoSuggestionsCheckbox.checked);
    });

    // Charger les paramètres
    function loadSettings() {
        const saveHistory = localStorage.getItem('saveHistory');
        const autoSuggestions = localStorage.getItem('autoSuggestions');
        
        if (saveHistory !== null) {
            saveHistoryCheckbox.checked = saveHistory === 'true';
        }
        
        if (autoSuggestions !== null) {
            autoSuggestionsCheckbox.checked = autoSuggestions === 'true';
        }
    }

    // Initialiser
    initializeTheme();
    loadSettings();
    loadSearchHistory();
});