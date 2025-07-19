document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsList = document.getElementById('results-list');

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

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (query) {
            resultsList.innerHTML = '<li>Recherche en cours...</li>';
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                displayResults(results);
                if (window.saveSearchQuery) {
                    window.saveSearchQuery(query);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                resultsList.innerHTML = '<li>Une erreur est survenue lors de la recherche.</li>';
            }
        } else {
            resultsList.innerHTML = '';
        }
    };

    const displayResults = (results) => {
        resultsList.innerHTML = '';
        if (results.length === 0) {
            resultsList.innerHTML = '<li>Aucun résultat trouvé.</li>';
            return;
        }

        results.forEach(result => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = result.url; // This will be the local filepath for now
            link.textContent = result.title;
            link.target = "_blank"; // Open in new tab

            const description = document.createElement('p');
            // For now, we don't have a description in our index, so we'll use the URL
            description.textContent = result.url;

            listItem.appendChild(link);
            listItem.appendChild(description);
            resultsList.appendChild(listItem);
        });
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});
