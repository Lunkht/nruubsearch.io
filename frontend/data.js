document.addEventListener('DOMContentLoaded', () => {
    const exportDataBtn = document.getElementById('export-data');
    const importDataBtn = document.getElementById('import-data');
    const importFileInput = document.getElementById('import-file');
    const clearAllDataBtn = document.getElementById('clear-all-data');

    // Initialiser le thème
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    };

    // Calculer la taille des données en localStorage
    function calculateStorageSize() {
        const history = localStorage.getItem('searchHistory') || '';
        const preferences = JSON.stringify({
            theme: localStorage.getItem('theme'),
            fontSize: localStorage.getItem('fontSize'),
            saveHistory: localStorage.getItem('saveHistory'),
            autoSuggestions: localStorage.getItem('autoSuggestions')
        });
        const feedbacks = localStorage.getItem('feedbacks') || '';
        
        const historySize = new Blob([history]).size;
        const preferencesSize = new Blob([preferences]).size;
        const feedbackSize = new Blob([feedbacks]).size;
        const totalSize = historySize + preferencesSize + feedbackSize;
        
        return {
            history: formatBytes(historySize),
            preferences: formatBytes(preferencesSize),
            feedback: formatBytes(feedbackSize),
            total: formatBytes(totalSize)
        };
    }

    // Formater les octets en unités lisibles
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Mettre à jour l'affichage des tailles de stockage
    function updateStorageDisplay() {
        const sizes = calculateStorageSize();
        document.getElementById('history-size').textContent = sizes.history;
        document.getElementById('preferences-size').textContent = sizes.preferences;
        document.getElementById('feedback-size').textContent = sizes.feedback;
        document.getElementById('total-size').textContent = sizes.total;
    }

    // Calculer et afficher les statistiques d'utilisation
    function updateUsageStats() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        if (history.length === 0) {
            document.getElementById('first-use').textContent = '-';
            document.getElementById('last-search').textContent = '-';
            document.getElementById('top-term').textContent = '-';
            document.getElementById('daily-average').textContent = '-';
            return;
        }
        
        // Première utilisation
        const firstUse = new Date(Math.min(...history.map(h => new Date(h.timestamp))));
        document.getElementById('first-use').textContent = firstUse.toLocaleDateString('fr-FR');
        
        // Dernière recherche
        const lastSearch = new Date(Math.max(...history.map(h => new Date(h.timestamp))));
        document.getElementById('last-search').textContent = lastSearch.toLocaleDateString('fr-FR');
        
        // Terme le plus recherché
        const termCounts = {};
        history.forEach(h => {
            const term = h.query.toLowerCase();
            termCounts[term] = (termCounts[term] || 0) + 1;
        });
        
        const topTerm = Object.keys(termCounts).reduce((a, b) => 
            termCounts[a] > termCounts[b] ? a : b, '');
        document.getElementById('top-term').textContent = topTerm || '-';
        
        // Moyenne par jour
        const daysDiff = Math.max(1, Math.ceil((lastSearch - firstUse) / (1000 * 60 * 60 * 24)));
        const dailyAverage = (history.length / daysDiff).toFixed(1);
        document.getElementById('daily-average').textContent = dailyAverage + ' recherches';
    }

    // Exporter toutes les données
    function exportData() {
        const data = {
            searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
            preferences: {
                theme: localStorage.getItem('theme'),
                fontSize: localStorage.getItem('fontSize'),
                saveHistory: localStorage.getItem('saveHistory'),
                autoSuggestions: localStorage.getItem('autoSuggestions')
            },
            feedbacks: JSON.parse(localStorage.getItem('feedbacks') || '[]'),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nruub-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Données exportées avec succès !', 'success');
    }

    // Importer des données
    function importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.version || !data.exportDate) {
                    throw new Error('Format de fichier invalide');
                }
                
                // Confirmer l'importation
                if (!confirm('Cette action remplacera toutes vos données actuelles. Continuer ?')) {
                    return;
                }
                
                // Importer les données
                if (data.searchHistory) {
                    localStorage.setItem('searchHistory', JSON.stringify(data.searchHistory));
                }
                
                if (data.preferences) {
                    Object.keys(data.preferences).forEach(key => {
                        if (data.preferences[key] !== null) {
                            localStorage.setItem(key, data.preferences[key]);
                        }
                    });
                }
                
                if (data.feedbacks) {
                    localStorage.setItem('feedbacks', JSON.stringify(data.feedbacks));
                }
                
                showNotification('Données importées avec succès !', 'success');
                updateStorageDisplay();
                updateUsageStats();
                
                // Recharger la page pour appliquer les préférences
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } catch (error) {
                showNotification('Erreur lors de l\'importation : ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Supprimer toutes les données
    function clearAllData() {
        const confirmText = 'SUPPRIMER';
        const userInput = prompt(
            `Cette action est irréversible. Toutes vos données seront définitivement supprimées.\n\n` +
            `Pour confirmer, tapez "${confirmText}" (en majuscules) :`
        );
        
        if (userInput === confirmText) {
            // Supprimer toutes les données liées à nruub
            const keysToRemove = [
                'searchHistory',
                'theme',
                'fontSize',
                'saveHistory',
                'autoSuggestions',
                'feedbacks'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            showNotification('Toutes les données ont été supprimées.', 'success');
            updateStorageDisplay();
            updateUsageStats();
            
            // Recharger la page
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    // Afficher une notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Event listeners
    exportDataBtn.addEventListener('click', exportData);
    
    importDataBtn.addEventListener('click', () => {
        importFileInput.click();
    });
    
    importFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importData(e.target.files[0]);
        }
    });
    
    clearAllDataBtn.addEventListener('click', clearAllData);

    // Initialiser
    initializeTheme();
    updateStorageDisplay();
    updateUsageStats();
});