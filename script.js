document.addEventListener('DOMContentLoaded', () => {
    const questionsList = document.getElementById('questions-list');
    const questionDisplay = document.getElementById('question-display');
    const welcomeMessage = document.getElementById('welcome-message');
    const searchInput = document.getElementById('search-input');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    let allQuestions = [];

    // Toggle Sidebar on mobile
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Fetch and parse Questions.txt
    fetch('Questions.txt')
        .then(response => response.text())
        .then(text => {
            allQuestions = parseQuestions(text);
            renderQuestionsList(allQuestions);
        })
        .catch(err => {
            console.error('Ошибка загрузки вопросов:', err);
            questionDisplay.innerHTML = '<p>Ошибка загрузки контента. Пожалуйста, убедитесь, что файл Questions.txt доступен.</p>';
        });

    function parseQuestions(text) {
        // Split by the horizontal rule separator, handling different line endings
        const parts = text.split(/\r?\n---\r?\n/);
        return parts.map(part => {
            const lines = part.trim().split(/\r?\n/);
            const titleLine = lines.find(line => line.trim().startsWith('#'));
            const title = titleLine ? titleLine.replace(/^#\s*/, '').trim() : 'Без заголовка';
            const content = lines.filter(line => !line.startsWith('#')).join('\n').trim();

            // Basic Markdown-ish parsing for content (paragraphs)
            const formattedContent = content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

            return { title, fullText: part, html: `<h2>${title}</h2>${formattedContent}` };
        }).filter(q => q.title !== 'Без заголовка' || q.fullText.trim() !== '');
    }

    function renderQuestionsList(questions) {
        questionsList.innerHTML = '';
        questions.forEach((q, index) => {
            const li = document.createElement('li');
            li.textContent = q.title;
            li.addEventListener('click', () => {
                displayQuestion(q, li);
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
            questionsList.appendChild(li);
        });
    }

    function displayQuestion(question, element) {
        // Remove active class from all
        document.querySelectorAll('#questions-list li').forEach(li => li.classList.remove('active'));
        element.classList.add('active');

        welcomeMessage.style.display = 'none';
        questionDisplay.innerHTML = question.html;
        questionDisplay.scrollTop = 0;
        document.getElementById('content').scrollTop = 0;
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allQuestions.filter(q => q.title.toLowerCase().includes(query));
        renderQuestionsList(filtered);
    });
});
