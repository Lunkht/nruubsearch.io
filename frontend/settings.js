document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const modeLabel = document.getElementById('mode-label');
    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('comment-text');
    const commentStatus = document.getElementById('comment-status');
    const searchHistoryList = document.getElementById('search-history-list');
    const clearHistoryButton = document.getElementById('clear-history-button');

    // Dark/Light Mode
    const applyTheme = (isDarkMode) => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        modeLabel.textContent = isDarkMode ? 'Mode Sombre' : 'Mode Clair';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        darkModeToggle.checked = true;
        applyTheme(true);
    } else {
        darkModeToggle.checked = false;
        applyTheme(false);
    }

    darkModeToggle.addEventListener('change', () => {
        applyTheme(darkModeToggle.checked);
    });

    // Send Comment
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const comment = commentText.value.trim();
        if (comment) {
            commentStatus.textContent = 'Envoi du commentaire...';
            try {
                // In a real application, you'd send this to a backend API
                // For this prototype, we'll just simulate success
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                console.log('Comment sent:', comment);
                commentStatus.textContent = 'Commentaire envoyé avec succès !';
                commentStatus.style.color = 'green';
                commentText.value = '';
            } catch (error) {
                console.error('Error sending comment:', error);
                commentStatus.textContent = 'Échec de l\'envoi du commentaire.';
                commentStatus.style.color = 'red';
            }
        } else {
            commentStatus.textContent = 'Veuillez écrire un commentaire.';
            commentStatus.style.color = 'orange';
        }
    });

    // Search History
    const loadSearchHistory = () => {
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryList.innerHTML = '';
        if (history.length === 0) {
            searchHistoryList.innerHTML = '<li>Aucune recherche récente.</li>';
            return;
        }
        history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            searchHistoryList.appendChild(listItem);
        });
    };

    clearHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('searchHistory');
        loadSearchHistory();
    });

    loadSearchHistory();

    // Intercept search from index.html to save history
    // This part assumes script.js on index.html will call a function to save history
    // For now, we'll just add a placeholder. A more robust solution would involve
    // a shared utility or event listener.
    window.saveSearchQuery = (query) => {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // Add to the beginning and keep only unique items, limit to 10
        history = [query, ...history.filter(item => item !== query)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    };
});