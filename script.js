// ===================================
// ROAD SMART AID - JavaScript
// ===================================

// 🔍 Данные для умного поиска
const searchData = [
    {
        section: 'stop',
        title: '🛑 Остановка инспектором',
        keywords: ['остановка', 'инспектор', 'представился', 'удостоверение', 'причина', 'п. 10', 'п. 52'],
        content: 'Порядок действий инспектора при остановке: представиться, назвать причину, предъявить удостоверение'
    },
    {
        section: 'powers',
        title: '⚡ Полномочия инспектора',
        keywords: ['полномочия', 'права', 'инспектор', 'п. 47', 'остановка тс', 'проверка'],
        content: 'Основные полномочия: остановка ТС, проверка документов, освидетельствование'
    },
    {
        section: 'docs',
        title: '📄 Документы',
        keywords: ['документы', 'права', 'стс', 'осаго', 'птс', 'п. 2.1.1'],
        content: 'Обязательные документы: водительское удостоверение, СТС, полис ОСАГО'
    },
    {
        section: 'search',
        title: '🔍 Осмотр и досмотр',
        keywords: ['осмотр', 'досмотр', 'багажник', 'понятые', 'видео', 'протокол', 'ст. 27.9', 'коап'],
        content: 'Осмотр — визуально, досмотр — со вскрытием (требует понятых или видео)'
    },
    {
        section: 'accident',
        title: '🚗💥 ДТП',
        keywords: ['дтп', 'авария', 'европротокол', '112', '102', 'знак', 'аварийка'],
        content: 'Действия при ДТП: аварийка, знак, фото, европротокол или ГИБДД'
    },
    {
        section: 'rights',
        title: '⚖️ Ваши права',
        keywords: ['права', 'видео', 'съёмка', 'протокол', 'адвокат', 'ст. 51', 'конституция'],
        content: 'Право на видеосъёмку, не выходить из авто, не подписывать протокол'
    },
    {
        section: 'emergency-main',
        title: '📞 Экстренные номера',
        keywords: ['112', '102', '103', 'мвд', 'телефон', 'вызов', 'экстренный'],
        content: '112 — единый экстренный, 102 — полиция, 103 — скорая, 8(800)222-74-47 — телефон доверия МВД'
    },
    {
        section: 'main-menu',
        title: '📚 Главное меню',
        keywords: ['меню', 'разделы', 'навигация'],
        content: 'Все разделы приложения: Остановка, Полномочия, Документы, Осмотр, ДТП, Права'
    }
];

// 🔍 Функция поиска
function searchContent() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    
    // Если запрос пустой — скрываем результаты
    if (query.length < 2) {
        if (resultsContainer) resultsContainer.style.display = 'none';
        return;
    }
    
    // Ищем совпадения
    const results = searchData.filter(item => {
        return item.keywords.some(k => k.toLowerCase().includes(query)) ||
               item.title.toLowerCase().includes(query) ||
               item.content.toLowerCase().includes(query);
    });
    
    // Отображаем результаты
    if (resultsContainer) {
        if (results.length > 0) {
            resultsContainer.innerHTML = results.map(item => `
                <div class="search-result-item" onclick="showSection('${item.section}'); document.getElementById('search-results').style.display='none'; document.getElementById('search-input').value='';">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-text">${highlightText(item.content, query)}</div>
                    <div class="search-result-meta">🔑 Ключевые слова: ${item.keywords.slice(0, 5).join(', ')}</div>
                </div>
            `).join('');
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = '<div class="no-results">Ничего не найдено 😕<br><small>Попробуйте: "п. 10", "досмотр", "112", "права"</small></div>';
            resultsContainer.style.display = 'block';
        }
    }
}

// 🔍 Подсветка найденного текста
function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Закрыть поиск при клике вне
document.addEventListener('click', function(e) {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    if (searchInput && resultsContainer) {
        const searchContainer = searchInput.parentElement;
        if (!searchContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    }
});

// 📱 Переключение разделов
function showSection(id) {
    // Скрываем все разделы
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    
    // Скрываем главное меню и экстренные номера
    var menu = document.getElementById('main-menu');
    var emergency = document.getElementById('emergency-main');
    if(menu) menu.style.display = 'none';
    if(emergency) emergency.style.display = 'none';
    
    // Показываем нужный раздел или главное меню
    if (id === 'main-menu' || id === 'main') {
        if(menu) menu.style.display = 'grid';
        if(emergency) emergency.style.display = 'block';
    } else {
        var section = document.getElementById(id);
        if (section) {
            section.classList.add('active');
            section.style.display = 'block';
        }
    }
    
    // Прокрутка вверх
    window.scrollTo(0, 0);
}

// 📅 Загрузка даты обновления
fetch('data/legal-base.json?t=' + Date.now())
    .then(r => r.json())
    .then(data => {
        var el = document.getElementById('last-check');
        if (el && data.metadata && data.metadata.last_verified) {
            el.innerText = data.metadata.last_verified.split('T')[0];
        }
    })
    .catch(() => {
        var el = document.getElementById('last-check');
        if (el) el.innerText = "Онлайн";
    });

// 📱 Service Worker (офлайн-режим)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✅ SW registered:', reg.scope))
            .catch(err => console.log('❌ SW error:', err));
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Показываем главное меню
    showSection('main-menu');
});
