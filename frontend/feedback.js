document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentStatus = document.getElementById('comment-status');

    // Initialiser le thème
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    };

    // Gérer l'envoi du formulaire
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const feedbackType = document.getElementById('feedback-type').value;
        const commentText = document.getElementById('comment-text').value;
        const userEmail = document.getElementById('user-email').value;
        
        if (!feedbackType || !commentText.trim()) {
            showStatus('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        // Simuler l'envoi du commentaire
        showStatus('Envoi en cours...', 'info');
        
        // Sauvegarder le commentaire localement
        const feedback = {
            type: feedbackType,
            message: commentText,
            email: userEmail,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        saveFeedback(feedback);
        
        setTimeout(() => {
            showStatus('Merci pour votre commentaire ! Il a été enregistré avec succès.', 'success');
            commentForm.reset();
        }, 1000);
    });

    // Fonction pour afficher les messages de statut
    function showStatus(message, type) {
        commentStatus.textContent = message;
        commentStatus.className = `status-message ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                commentStatus.textContent = '';
                commentStatus.className = 'status-message';
            }, 5000);
        }
    }

    // Sauvegarder le commentaire dans le stockage local
    function saveFeedback(feedback) {
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push(feedback);
        
        // Garder seulement les 50 derniers commentaires
        if (feedbacks.length > 50) {
            feedbacks = feedbacks.slice(-50);
        }
        
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }

    // Initialiser
    initializeTheme();
});