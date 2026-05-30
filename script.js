// =============================================
// AFTERBAC MAROC - JAVASCRIPT
// =============================================

// ---------- Mobile Menu Toggle ----------
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize quiz if on quiz page
    initQuiz();
});

// ---------- Quiz Logic ----------
function initQuiz() {
    const quizSteps = document.querySelectorAll('.quiz-step');
    const progressBar = document.getElementById('progressBar');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const restartBtn = document.getElementById('restartQuiz');

    if (!quizSteps.length) return; // Not on quiz page

    let currentStep = 1;
    const totalSteps = 5; // Questions 1-5, then result
    let answers = {};

    // Handle option clicks
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const step = parseInt(this.closest('.quiz-step').dataset.step);
            
            // Store answer
            answers[step] = this.dataset.value;
            
            // Visual feedback
            const siblings = this.closest('.quiz-options').querySelectorAll('.quiz-option');
            siblings.forEach(sib => sib.classList.remove('selected'));
            this.classList.add('selected');

            // Move to next step after short delay
            setTimeout(() => {
                if (step < totalSteps) {
                    showStep(step + 1);
                    updateProgress(step + 1);
                } else {
                    showResult();
                    updateProgress(totalSteps + 1);
                }
            }, 400);
        });
    });

    function showStep(step) {
        quizSteps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        currentStep = step;
    }

    function updateProgress(step) {
        if (progressBar) {
            const percent = (step / (totalSteps + 1)) * 100;
            progressBar.style.width = percent + '%';
        }
    }

    function showResult() {
        const resultDiv = document.getElementById('quizResult');
        if (!resultDiv) return;

        const result = generateRecommendation(answers);
        resultDiv.innerHTML = result;
        showStep('result');
    }

    function generateRecommendation(answers) {
        const bac = answers[1] || '';
        const moyenne = answers[2] || '';
        const priorite = answers[3] || '';
        const domaine = answers[4] || '';
        const budget = answers[5] || '';

        let recommendations = [];
        let title = '';

        // Logic based on score
        if (moyenne === 'moins10' || moyenne === '10-12') {
            title = '📌 Options accessibles avec ta moyenne :';
            recommendations = [
                '✅ <strong>OFPPT</strong> — Formations professionnelles gratuites, bon taux d\'insertion',
                '✅ <strong>ISTA</strong> — Technicien en 2 ans, accessible avec bac',
                '✅ <strong>Université (lettres, droit)</strong> — Accès ouvert, mais exige de l\'autonomie',
                '✅ <strong>Formations qualifiantes</strong> — Métiers manuels, BTP, hôtellerie'
            ];
        } else if (moyenne === '12-14') {
            title = '📌 Tu as plusieurs portes ouvertes :';
            recommendations = [
                '✅ <strong>EST</strong> — DUT en 2 ans, bon tremplin vers la licence pro',
                '✅ <strong>Université</strong> — Licence en informatique, économie, langues',
                '✅ <strong>OFPPT</strong> — Filières techniques (informatique, mécanique)',
                '✅ <strong>ENCG</strong> (si tu as le bon type de bac) — Concours accessible'
            ];
        } else if (moyenne === '14-16' || moyenne === 'plus16') {
            title = '📌 Excellentes opportunités pour toi :';
            recommendations = [
                '✅ <strong>CPGE</strong> — Si sciences maths/physiques, prépa puis grandes écoles',
                '✅ <strong>ENSA / ENSAM</strong> — Cycle ingénieur en 5 ans, gratuit',
                '✅ <strong>ENCG</strong> — Commerce et gestion, excellents débouchés',
                '✅ <strong>Médecine / Pharmacie</strong> — Si SVT et très bon classement',
                '✅ <strong>Études à l\'étranger</strong> — France, Canada (bourses possibles)'
            ];
        }

        // Add priority-based advice
        let priorityAdvice = '';
        if (priorite === 'emploi') {
            priorityAdvice = '<br>💼 <strong>Conseil emploi :</strong> Privilégie OFPPT, EST, ENSA/ENSAM, ou les licences pro. Ces filières mènent plus rapidement à l\'emploi.';
        } else if (priorite === 'budget') {
            priorityAdvice = '<br>💰 <strong>Conseil budget :</strong> Reste dans le public : université, CPGE, ENSA, EST, OFPPT. Tout est gratuit ou presque.';
        } else if (priorite === 'etranger') {
            priorityAdvice = '<br>✈️ <strong>Conseil étranger :</strong> Renseigne-toi sur Campus France, les bourses, et prépare ton dossier 1 an à l\'avance. Budget minimum 10 000€/an.';
        }

        let budgetAdvice = '';
        if (budget === 'zero') {
            budgetAdvice = '<br>🆓 <strong>Budget zéro :</strong> Reste dans les filières publiques gratuites. CPGE, université, ENSA, EST, OFPPT sont tes meilleures options.';
        }

        return `
            <h4>${title}</h4>
            <ul style="list-style: none; padding: 0; margin-top: 12px;">
                ${recommendations.map(r => `<li style="margin-bottom: 10px;">${r}</li>`).join('')}
            </ul>
            ${priorityAdvice}
            ${budgetAdvice}
            <p style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #d1d5db;">
                📖 <a href="guide.html" style="color: var(--primary); font-weight: 600;">Consulte notre guide complet →</a>
            </p>
        `;
    }

    // Restart quiz
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            answers = {};
            currentStep = 1;
            updateProgress(1);
            showStep(1);
            document.querySelectorAll('.quiz-option.selected').forEach(opt => {
                opt.classList.remove('selected');
            });
        });
    }

    // Initial progress
    updateProgress(1);
}