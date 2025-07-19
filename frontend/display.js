document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const modeLabel = document.getElementById('mode-label');

    // Initialiser le thème
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const isLightMode = savedTheme === 'light';
        
        if (isLightMode) {
            document.body.classList.add('light-mode');
            darkModeToggle.checked = false;
            modeLabel.textContent = 'Mode Clair';
        } else {
            document.body.classList.remove('light-mode');
            darkModeToggle.checked = true;
            modeLabel.textContent = 'Mode Sombre';
        }
    };

    // Gérer le changement de thème
    darkModeToggle.addEventListener('change', () => {
        const isLightMode = !darkModeToggle.checked;
        
        if (isLightMode) {
            document.body.classList.add('light-mode');
            modeLabel.textContent = 'Mode Clair';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            modeLabel.textContent = 'Mode Sombre';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Initialiser la taille de police
    const initializeFontSize = () => {
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';
        document.body.classList.add(`font-${savedFontSize}`);
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="changeFontSize('${savedFontSize}')"]`).classList.add('active');
    };

    // Fonction pour changer la taille de police
    window.changeFontSize = (size) => {
        // Supprimer les anciennes classes de taille
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        
        // Ajouter la nouvelle classe
        document.body.classList.add(`font-${size}`);
        
        // Sauvegarder la préférence
        localStorage.setItem('fontSize', size);
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    };

    // Initialiser
    initializeTheme();
    initializeFontSize();
});