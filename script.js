// ===================================
// ROAD SMART AID - JavaScript
// ===================================
// ===================================
// 🔍 УЛУЧШЕННЫЙ ПОИСК (v2.0)
// ===================================

// 📚 Словарь синонимов
const searchSynonyms = {
    'дпс': ['гаи', 'гибдд', 'полиция', 'инспектор'],
    'гаи': ['дпс', 'гибдд', 'полиция', 'инспектор'],
    'гибдд': ['дпс', 'гаи', 'полиция', 'инспектор'],
    'штраф': ['наказание', 'санкция', 'взыскание', 'лишение'],
    'наказание': ['штраф', 'санкция', 'взыскание'],
    'досмотр': ['осмотр', 'проверка', 'обыск', 'багажник'],
    'осмотр': ['досмотр', 'проверка', 'визуальный'],
    'права': ['удостоверение', 'водительское', 'в/у'],
    'водительское': ['права', 'удостоверение'],
    'документы': ['права', 'стс', 'осаго', 'бумаги'],
    'стс': ['регистрация', 'свидетельство', 'птс', 'документы'],
    'осаго': ['страховка', 'полис', 'каско', 'документы'],
    'дтп': ['авария', 'столкновение', 'происшествие', 'удар'],
    'авария': ['дтп', 'столкновение', 'происшествие'],
    'понятые': ['свидетели', 'люди'],
    'видео': ['запись', 'камера', 'съёмка', 'видеозапись'],
    'протокол': ['документ', 'бумага', 'постановление'],
    'выход': ['выйти', 'покинуть', 'выйти из авто'],
    'остановка': ['остановили', 'требуют', 'жест'],
    '112': ['экстренный', 'мчс', 'помощь', 'звонок'],
    '102': ['полиция', 'дпс', 'милиция'],
    '103': ['скорая', 'врач', 'медицина'],
    'жалоба': ['заявление', 'обращение'],
    'п. 10': ['пункт 10', 'параграф 10'],
    'п. 47': ['пункт 47', 'параграф 47'],
    'п. 52': ['пункт 52', 'параграф 52'],
    'коап': ['кодекс', 'административный', 'нарушение'],
    'пдд': ['правила', 'дорожное', 'движение']
};

// 🔤 Функция нормализации текста
function normalizeText(text) {
    return text.toLowerCase().replace(/ё/g, 'е').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
}

// 🎯 Функция нечёткого поиска
function fuzzyMatch(query, text, threshold = 0.6) {
    query = normalizeText(query);
    text = normalizeText(text);
    if (text.includes(query)) return 1.0;
    const words1 = query.split(' ');
    const words2 = text.split(' ');
    let matches = 0;
    words1.forEach(w1 => {
        words2.forEach(w2 => {
            if (w1.length > 2 && w2.length > 2) {
                const distance = levenshteinDistance(w1, w2);
                const similarity = 1 - (distance / Math.max(w1.length, w2.length));
                if (similarity >= threshold) matches++;
            }
        });
    });
    return matches / words1.length;
}

// 📏 Расстояние Левенштейна
function levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[str2.length][str1.length];
}

// 🔍 Подсветка найденного текста
function highlightText(text, query) {
    const terms = [query, ...(searchSynonyms[query] || [])];
    let highlighted = text;
    terms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        highlighted = highlighted.replace(regex, '<span class="search-highlight">$1</span>');
    });
    return highlighted;
}

// ===================================
// 🔍 Данные для умного поиска
const searchData = [
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
    const searchData = [
    {
        section: 'stop',
        title: '🛑 Остановка инспектором',
        keywords: ['остановка', 'инспектор', 'представился', 'удостоверение', 'причина', 'п. 10', 'п. 52', 'гаи', 'дпс', 'гибдд', 'жест'],
        content: 'Порядок действий инспектора при остановке: представиться, назвать причину, предъявить удостоверение'
    },
    {
        section: 'powers',
        title: '⚡ Полномочия инспектора',
        keywords: ['полномочия', 'права', 'инспектор', 'п. 47', 'остановка тс', 'проверка', 'гаи', 'дпс'],
        content: 'Основные полномочия: остановка ТС, проверка документов, освидетельствование'
    },
    {
        section: 'docs',
        title: '📄 Документы',
        keywords: ['документы', 'права', 'стс', 'осаго', 'птс', 'п. 2.1.1', 'страховка'],
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
        content: '112 — единый экстренный, 102 — полиция, 103 — скорая'
    },
    {
        section: 'main-menu',
        title: '📚 Главное меню',
        keywords: ['меню', 'разделы', 'навигация'],
        content: 'Все разделы приложения'
    }
];

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
    // Скрываем все разделы через setProperty с !important
    document.querySelectorAll('.section').forEach(el => {
        el.classList.remove('active');
        el.style.setProperty('display', 'none', 'important');
    });
    
    // Скрываем главное меню и экстренные номера
    var menu = document.getElementById('main-menu');
    var emergency = document.getElementById('emergency-main');
    if(menu) menu.style.setProperty('display', 'none', 'important');
    if(emergency) emergency.style.setProperty('display', 'none', 'important');
    
    // Показываем нужный раздел или главное меню
    if (id === 'main-menu' || id === 'main') {
        if(menu) menu.style.setProperty('display', 'grid', 'important');
        if(emergency) emergency.style.setProperty('display', 'block', 'important');
    } else {
        var section = document.getElementById(id);
        if (section) {
            section.classList.add('active');
            section.style.setProperty('display', 'block', 'important');
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

// 📱 Service Worker (офлайн-режим с авто-очисткой кэша)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('✅ SW registered:', reg.scope);
                
                // Проверяем обновления
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    console.log('🔄 SW: Найдено обновление...');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 SW: Доступно обновление! Перезагрузите страницу.');
                            // Можно показать уведомление пользователелю
                            if (confirm('🔄 Доступна новая версия приложения! Перезагрузить?')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(err => console.log('❌ SW error:', err));
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Показываем главное меню
    showSection('main-menu');
});
