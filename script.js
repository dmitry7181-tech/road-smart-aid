// ===================================
// ROAD SMART AID - JavaScript v2.1
// ===================================

// 📚 Словарь синонимов для поиска
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
    'п 10': ['п. 10', 'пункт 10', 'параграф 10'],
    'п. 10': ['п 10', 'пункт 10', 'параграф 10'],
    'п 47': ['п. 47', 'пункт 47', 'параграф 47'],
    'п. 47': ['п 47', 'пункт 47', 'параграф 47'],
    'п 48': ['п. 48', 'пункт 48', 'параграф 48'],
    'п. 48': ['п 48', 'пункт 48', 'параграф 48'],
    'п 49': ['п. 49', 'пункт 49', 'параграф 49'],
    'п. 49': ['п 49', 'пункт 49', 'параграф 49'],
    'п 50': ['п. 50', 'пункт 50', 'параграф 50'],
    'п. 50': ['п 50', 'пункт 50', 'параграф 50'],
    'п 51': ['п. 51', 'пункт 51', 'параграф 51'],
    'п. 51': ['п 51', 'пункт 51', 'параграф 51'],
    'п 52': ['п. 52', 'пункт 52', 'параграф 52'],
    'п. 52': ['п 52', 'пункт 52', 'параграф 52'],
    'п 53': ['п. 53', 'пункт 53', 'параграф 53'],
    'п. 53': ['п 53', 'пункт 53', 'параграф 53'],
    'п 54': ['п. 54', 'пункт 54', 'параграф 54'],
    'п. 54': ['п 54', 'пункт 54', 'параграф 54'],
    'ст 5': ['ст. 5', 'статья 5'],
    'ст. 5': ['ст 5', 'статья 5'],
    'ст 27': ['ст. 27', 'статья 27'],
    'ст. 27': ['ст 27', 'статья 27'],
    'ст 51': ['ст. 51', 'статья 51'],
    'ст. 51': ['ст 51', 'статья 51'],
    'коап': ['кодекс', 'административный', 'нарушение'],
    'пдд': ['правила', 'дорожное', 'движение']
};

// 🔤 Функция нормализации запроса (добавляет точки к п./ст.)
function normalizeQuery(query) {
    let normalized = query.toLowerCase();
    // п 48 → п. 48, ст 5 → ст. 5
    normalized = normalized.replace(/(\bп)\s+(\d+)/gi, '$1. $2');
    normalized = normalized.replace(/(\bст)\s+(\d+)/gi, '$1. $2');
    // убираем лишние пробелы
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
}

// 🔤 Функция нормализации текста
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// 🎯 Функция нечёткого поиска (Levenshtein)
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
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[str2.length][str1.length];
}

// 🔍 Подсветка найденного текста (с синонимами)
function highlightText(text, query) {
    const normalizedQuery = normalizeQuery(query);
    const terms = [query, normalizedQuery, ...(searchSynonyms[query] || []), ...(searchSynonyms[normalizedQuery] || [])];
    let highlighted = text;
    terms.forEach(term => {
        if (term && term.length > 1) {
            const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="search-highlight">$1</span>');
        }
    });
    return highlighted;
}

// 🔍 Данные для умного поиска
const searchData = [
    {
        section: 'stop',
        title: '🛑 Остановка инспектором',
        keywords: ['остановка', 'инспектор', 'представился', 'удостоверение', 'причина', 'п. 10', 'п 10', 'п. 52', 'п 52', 'гаи', 'дпс', 'гибдд', 'жест', 'п. 48', 'п 48', 'п. 49', 'п 49'],
        content: 'Порядок действий инспектора при остановке: представиться (п. 10), назвать причину, предъявить удостоверение, п. 48-52 Приказа №264'
    },
    {
        section: 'powers',
        title: '⚡ Полномочия инспектора',
        keywords: ['полномочия', 'права', 'инспектор', 'п. 47', 'п 47', 'остановка тс', 'проверка', 'гаи', 'дпс', 'п. 53', 'п 53'],
        content: 'Основные полномочия: остановка ТС (п. 47), проверка документов, освидетельствование, выход из авто (п. 53)'
    },
    {
        section: 'docs',
        title: '📄 Документы',
        keywords: ['документы', 'права', 'стс', 'осаго', 'птс', 'п. 2.1.1', 'страховка', 'пдд'],
        content: 'Обязательные документы: водительское удостоверение, СТС, полис ОСАГО (ПДД п. 2.1.1)'
    },
    {
        section: 'search',
        title: '🔍 Осмотр и досмотр',
        keywords: ['осмотр', 'досмотр', 'багажник', 'понятые', 'видео', 'протокол', 'ст. 27.9', 'ст 27', 'коап'],
        content: 'Осмотр — визуально, досмотр — со вскрытием (ст. 27.9 КоАП, требует понятых или видео)'
    },
    {
        section: 'accident',
        title: '🚗💥 ДТП',
        keywords: ['дтп', 'авария', 'европротокол', '112', '102', 'знак', 'аварийка', 'ст. 12.27'],
        content: 'Действия при ДТП: аварийка, знак, фото, европротокол или ГИБДД (ст. 12.27 КоАП)'
    },
    {
        section: 'rights',
        title: '⚖️ Ваши права',
        keywords: ['права', 'видео', 'съёмка', 'протокол', 'адвокат', 'ст. 51', 'ст 51', 'конституция', 'п. 11', 'п 11'],
        content: 'Право на видеосъёмку, не выходить из авто, не свидетельствовать против себя (ст. 51 Конституции, п. 11)'
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

// 🔍 УЛУЧШЕННАЯ функция поиска
function searchContent() {
    const rawQuery = document.getElementById('search-input').value.trim();
    const query = normalizeQuery(rawQuery);
    const resultsContainer = document.getElementById('search-results');
    
    if (query.length < 2) {
        if (resultsContainer) resultsContainer.style.display = 'none';
        return;
    }
    
    // Получаем синонимы + варианты с/без точек
    let searchTerms = [query, rawQuery];
    Object.keys(searchSynonyms).forEach(key => {
        if (query.includes(key) || searchSynonyms[key].includes(query) || rawQuery.includes(key)) {
            searchTerms = searchTerms.concat(searchSynonyms[key]);
        }
    });
    
    // Поиск в searchData
    const searchDataResults = searchData.filter(item => {
        const searchText = (item.title + ' ' + item.content + ' ' + item.keywords.join(' ')).toLowerCase();
        return searchTerms.some(term => term && searchText.includes(term.toLowerCase()));
    });
    
    // Поиск по содержимому разделов
    const sectionResults = [];
    document.querySelectorAll('.section').forEach(section => {
        const sectionId = section.id;
        const sectionTitle = section.querySelector('h2')?.textContent || '';
        const sectionText = section.textContent || '';
        
        searchTerms.forEach(term => {
            if (term && sectionText.toLowerCase().includes(term.toLowerCase())) {
                const relevance = fuzzyMatch(term, sectionText);
                if (relevance > 0.3) {
                    sectionResults.push({
                        section: sectionId,
                        title: sectionTitle,
                        content: sectionText.substring(0, 150) + '...',
                        relevance: relevance
                    });
                }
            }
        });
    });
    
    // Объединяем и сортируем
    const allResults = [...searchDataResults, ...sectionResults];
    allResults.sort((a, b) => (b.relevance || 1) - (a.relevance || 1));
    const uniqueResults = allResults.filter((v, i, a) => a.findIndex(t => t.section === v.section) === i);
    
    // Отображаем
    if (resultsContainer) {
        if (uniqueResults.length > 0) {
            resultsContainer.innerHTML = uniqueResults.slice(0, 10).map(item => `
                <div class="search-result-item" onclick="showSection('${item.section}'); document.getElementById('search-results').style.display='none'; document.getElementById('search-input').value='';">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-text">${highlightText(item.content, rawQuery)}</div>
                    <div class="search-result-meta">🔑 Релевантность: ${Math.round((item.relevance || 1) * 100)}%</div>
                </div>
            `).join('');
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = '<div class="no-results">Ничего не найдено 😕<br><small>Попробуйте: "п 48", "ст 5", "гаи", "дтп"</small></div>';
            resultsContainer.style.display = 'block';
        }
    }
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
    document.querySelectorAll('.section').forEach(el => {
        el.classList.remove('active');
        el.style.setProperty('display', 'none', 'important');
    });
    
    var menu = document.getElementById('main-menu');
    var emergency = document.getElementById('emergency-main');
    if(menu) menu.style.setProperty('display', 'none', 'important');
    if(emergency) emergency.style.setProperty('display', 'none', 'important');
    
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

// 📱 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('✅ SW registered:', reg.scope);
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 SW: Доступно обновление!');
                        }
                    });
                });
            })
            .catch(err => console.log('❌ SW error:', err));
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    showSection('main-menu');
});
