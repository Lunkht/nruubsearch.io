document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le thème
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
    };

    // Animation d'apparition pour les sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Appliquer l'animation aux sections
    const sections = document.querySelectorAll('.setting-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });

    // Animation du logo
    const logo = document.querySelector('.about-logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Effet de parallaxe léger pour le hero
    const hero = document.querySelector('.about-hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Copier l'email au clic
    const emailElements = document.querySelectorAll('.contact-item');
    emailElements.forEach(element => {
        if (element.textContent.includes('support@nruub.com')) {
            element.style.cursor = 'pointer';
            element.title = 'Cliquer pour copier l\'email';
            
            element.addEventListener('click', () => {
                navigator.clipboard.writeText('support@nruub.com').then(() => {
                    showNotification('Email copié dans le presse-papiers !', 'success');
                }).catch(() => {
                    // Fallback pour les navigateurs plus anciens
                    const textArea = document.createElement('textarea');
                    textArea.value = 'support@nruub.com';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showNotification('Email copié dans le presse-papiers !', 'success');
                });
            });
        }
    });

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
            background-color: #27ae60;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }

    // Ajouter les animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .about-logo {
            transition: transform 0.3s ease;
        }
        
        .link-btn {
            transition: all 0.3s ease;
        }
        
        .link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);

    // Initialiser
    initializeTheme();
});