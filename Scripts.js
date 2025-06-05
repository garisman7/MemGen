// File: script.js

// User data storage (simulating a simple database)
let users = JSON.parse(localStorage.getItem('memgen_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('memgen_currentUser')) || null;

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function () {
    // Initialize based on current page
    const path = window.location.pathname.split('/').pop();

    if (path === 'login.html' || path === 'login') {
        initLoginPage();
    } else if (path === 'reg.html' || path === 'reg') {
        initRegPage();
    } else if (path === 'account.html' || path === 'account') {
        initAccountPage();
    } else if (path === 'Eg.html' || path === 'Eg') {
        initTestPage();
    } else if (path === 'Random.html' || path === 'Random') {
        initRandomPage();
    }

    // Update header based on login state
    updateHeader();
});

// Initialize Login Page
function initLoginPage() {
    const loginBtn = document.querySelector('.green_buttons.login[href="account.html"]');
    const regBtn = document.querySelector('.green_buttons.login[href="reg.html"]');
    const textareas = document.querySelectorAll('.log_reg textarea');

    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const username = textareas[0].value.trim();
        const password = textareas[1].value.trim();

        if (!username || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            localStorage.setItem('memgen_currentUser', JSON.stringify(currentUser));
            window.location.href = 'account.html';
        } else {
            alert('Неверный логин или пароль');
        }
    });

    regBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'reg.html';
    });
}

// Initialize Registration Page
function initRegPage() {
    const regBtn = document.querySelector('.green_buttons.Bl[href="account.html"]');
    const textareas = document.querySelectorAll('.log_reg textarea');

    regBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const username = textareas[0].value.trim();
        const password = textareas[1].value.trim();
        const confirmPassword = textareas[2].value.trim();

        if (!username || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        if (users.some(u => u.username === username)) {
            alert('Этот логин уже занят');
            return;
        }

        const newUser = {
            username,
            password,
            registrationDate: new Date().toLocaleDateString(),
            testScore: 0,
            memesCount: 0,
            postsCount: 3 // Default value as in the HTML
        };

        users.push(newUser);
        localStorage.setItem('memgen_users', JSON.stringify(users));

        currentUser = newUser;
        localStorage.setItem('memgen_currentUser', JSON.stringify(currentUser));

        window.location.href = 'account.html';
    });
}

// Initialize Account Page
function initAccountPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Update user info
    document.querySelector('.zag.f').textContent = currentUser.username;
    document.querySelectorAll('.zag.f').forEach(el => {
        if (el.textContent === 'User#1') {
            el.textContent = currentUser.username;
        }
    });

    document.querySelector('.text_sten .zag.f').textContent = currentUser.registrationDate;
    document.querySelector('.zag:contains("Количество мемов")').nextElementSibling.textContent = currentUser.memesCount;
    document.querySelector('.zag:contains("Балы за тест")').nextElementSibling.textContent = currentUser.testScore;
}

// Initialize Test Page
function initTestPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const testButtons = document.querySelectorAll('.green_buttons.tests');
    let answers = [];
    let score = 0;

    // Correct answers
    const correctAnswers = [
        'Демотиватор',
        'Человек квантум'
    ];

    testButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const questionIndex = Math.floor(index / 4);
            answers[questionIndex] = button.textContent.trim();

            // Check if all questions answered
            if (answers.length === correctAnswers.length && answers.every(a => a)) {
                // Calculate score
                score = answers.reduce((total, answer, i) => {
                    return total + (answer === correctAnswers[i] ? 1 : 0);
                }, 0);

                // Update user score
                currentUser.testScore = score;
                users = users.map(u => u.username === currentUser.username ? currentUser : u);

                localStorage.setItem('memgen_users', JSON.stringify(users));
                localStorage.setItem('memgen_currentUser', JSON.stringify(currentUser));

                alert(`Тест завершен! Ваш результат: ${score}/${correctAnswers.length}`);
            }
        });
    });
}

// Initialize Random Page
function initRandomPage() {
    const randomBtn = document.querySelector('.green_buttons.Bl[href="Mematicka_page1.html"]');
    const uploadBtn = document.querySelector('.gray_buttons');
    const textareas = document.querySelectorAll('.contener textarea');
    const imageZone = document.querySelector('.image');

    randomBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const topText = textareas[0].value.trim();
        const bottomText = textareas[1].value.trim();

        if (!topText && !bottomText) {
            alert('Введите текст для мема');
            return;
        }

        // In a real app, this would generate a meme
        alert('Мем сгенерирован! (В демо-версии это просто сообщение)');

        // Update memes count if logged in
        if (currentUser) {
            currentUser.memesCount++;
            users = users.map(u => u.username === currentUser.username ? currentUser : u);
            localStorage.setItem('memgen_users', JSON.stringify(users));
            localStorage.setItem('memgen_currentUser', JSON.stringify(currentUser));
        }
    });

    uploadBtn.addEventListener('click', function () {
        alert('В демо-версии загрузка изображений не доступна');
    });

    // Template selection
    const templates = document.querySelectorAll('.blanks img');
    templates.forEach(template => {
        template.addEventListener('click', function () {
            const src = template.getAttribute('src');
            document.querySelector('.red_zone').style.backgroundImage = `url(${src.replace('.png', '_2.png')})`;
        });
    });
}

// Update Header based on login state
function updateHeader() {
    const loginLink = document.querySelector('.top_footer_text[href="login.html"]');

    if (currentUser && loginLink) {
        loginLink.textContent = currentUser.username;
        loginLink.href = 'account.html';
    }
}

// Helper function for :contains selector
document.querySelectorAll = function (selector) {
    const elements = Element.prototype.querySelectorAll.apply(this, arguments);
    if (selector.includes(':contains')) {
        const text = selector.split(':contains(')[1].split(')')[0];
        return Array.prototype.filter.call(elements, el =>
            el.textContent.includes(text)
        );
    }
    return elements;
};