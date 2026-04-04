/* ===================================
   ROAD SMART AID - script.js v5.0
   Профессиональная архитектура: только поведение
   =================================== */

// 📚 СЛОВАРЬ СИНОНИМОВ ДЛЯ ПОИСКА
const searchSynonyms = {
    'дпс': ['гаи', 'гибдд', 'полиция', 'инспектор'],
    'гаи': ['дпс', 'гибдд', 'полиция', 'инспектор'],
    'гибдд': ['дпс', 'гаи', 'полиция', 'инспектор'],
    'штраф': ['наказание', 'санкция', 'взыскание', 'лишение'],
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
    'пдд': ['правила', 'дорожное', 'движение'],
    'освидетельствование': ['алкоголь', 'опьянение', 'алкотестер', 'трубка', 'нарколог']
};

// 🔤 НОРМАЛИЗАЦИЯ ЗАПРОСА
function normalizeQuery(query) {
    let normalized = query.toLowerCase();
    normalized = normalized.replace(/(\bп)\s+(\d+)/gi, '$1. $2');
    normalized = normalized.replace(/(\bст)\s+(\d+)/gi, '$1. $2');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
}

// 🔤 НОРМАЛИЗАЦИЯ ТЕКСТА
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// 🎯 НЕЧЁТКИЙ ПОИСК (Levenshtein)
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

// 📏 РАССТОЯНИЕ ЛЕВЕНШТЕЙНА
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

// 🔍 ПОДСВЕТКА НАЙДЕННОГО ТЕКСТА
function highlightText(text, query) {
    const normalizedQuery = normalizeQuery(query);
    const terms = [
        query,
        normalizedQuery,
        ...(searchSynonyms[query] || []),
        ...(searchSynonyms[normalizedQuery] || [])
    ];
    
    let highlighted = text;
    terms.forEach(term => {
        if (term && term.length > 1) {
            const regex = new RegExp(
                `(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                'gi'
            );
            highlighted = highlighted.replace(
                regex,
                '<span class="search-highlight">$1</span>'
            );
        }
    });
    
    return highlighted;
}

// 🔍 ДАННЫЕ ДЛЯ УМНОГО ПОИСКА
const searchData = [
    {
        section: 'stop',
        title: '🛑 Остановка инспектором',
        keywords: ['остановка', 'инспектор', 'представился', 'удостоверение', 'причина', 'п. 10', 'п 10', 'п. 52', 'п 52', 'гаи', 'дпс', 'гибдд', 'жест', 'п. 48', 'п 48', 'п. 49', 'п 49'],
        content: 'Порядок действий инспектора при остановке: представиться (п. 10), назвать причину, предъявить удостоверение, п. 48-52 Приказа №264'
    },
    {
        section: 'stop',
        title: '🍺 Освидетельствование на опьянение',
        keywords: ['освидетельствование', 'алкоголь', 'опьянение', 'алкотестер', 'трубка', 'отказ', 'ст. 12.26', 'ст. 12.8', 'ст. 27.12', 'лишение прав', '30000', 'понятые', 'акт', 'медицинское', 'нарколог', 'предлагаю', 'требование'],
        content: 'Освидетельствование на состояние опьянения: отказ = лишение прав 1.5-2 года + штраф 30000₽. Говорите: «Я не отказываюсь, требую процедуру с понятыми»'
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
    },
    {
        section: 'laws',
        title: '📚 Справочник законов',
        keywords: ['законы', 'коап', 'пдд', 'приказ', 'мвд', '264', 'конституция', 'полиция', 'аккордеон'],
        content: 'Полный справочник законов: Приказ МВД №264, КоАП РФ, ПДД РФ, ФЗ О полиции, Конституция РФ'
    }
];

// 🔍 ФУНКЦИЯ ПОИСКА
function searchContent() {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchInput || !resultsContainer) return;
    
    const rawQuery = searchInput.value.trim();
    const query = normalizeQuery(rawQuery);
    
    if (query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    // Собираем термины для поиска
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
    
    // Поиск по разделам
    const sectionResults = [];
    document.querySelectorAll('.section').forEach(section => {
        const sectionId = section.id;
        const sectionTitle = section.querySelector('.section-title')?.textContent || '';
        const sectionText = section.textContent || '';
        
        searchTerms.forEach(term => {
            if (term && sectionText.toLowerCase().includes(term.toLowerCase())) {
                const relevance = fuzzyMatch(term, sectionText);
                if (relevance > 0.3) {
                    let targetElementId = null;
                    
                    // Приоритет 1: Аккордеоны
                    const accordionSummaries = section.querySelectorAll('details summary');
                    for (let idx = 0; idx < accordionSummaries.length; idx++) {
                        const summary = accordionSummaries[idx];
                        if (summary.textContent.toLowerCase().includes(term.toLowerCase())) {
                            const parentDetails = summary.closest('details');
                            if (!parentDetails.id) {
                                parentDetails.id = `search-${sectionId}-acc-${idx}-${Date.now()}`;
                            }
                            targetElementId = parentDetails.id;
                            break;
                        }
                    }
                    
                    // Приоритет 2: Заголовки шагов
                    if (!targetElementId) {
                        const stepHeaders = section.querySelectorAll('.step-title');
                        for (let idx = 0; idx < stepHeaders.length; idx++) {
                            const header = stepHeaders[idx];
                            if (header.textContent.toLowerCase().includes(term.toLowerCase())) {
                                const parentStep = header.closest('.step');
                                if (!parentStep.id) {
                                    parentStep.id = `search-${sectionId}-step-${idx}-${Date.now()}`;
                                }
                                targetElementId = parentStep.id;
                                break;
                            }
                        }
                    }
                    
                    sectionResults.push({
                        section: sectionId,
                        title: sectionTitle,
                        content: sectionText.substring(0, 150) + '...',
                        relevance: relevance,
                        targetElementId: targetElementId,
                        searchTerm: term
                    });
                }
            }
        });
    });
    
    // Объединяем и сортируем
    const allResults = [...searchDataResults, ...sectionResults];
    allResults.sort((a, b) => (b.relevance || 1) - (a.relevance || 1));
    const uniqueResults = allResults.filter(
        (v, i, a) => a.findIndex(t => t.section === v.section) === i
    );
    
    // Отображаем результаты
    if (uniqueResults.length > 0) {
        resultsContainer.innerHTML = uniqueResults.slice(0, 10).map(item => {
            const targetId = item.targetElementId || '';
            return `
                <div class="search-result-item" data-section="${item.section}" data-target="${targetId}">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-text">${highlightText(item.content, rawQuery)}</div>
                    <div class="search-result-meta">🔑 Релевантность: ${Math.round((item.relevance || 1) * 100)}%</div>
                </div>
            `;
        }).join('');
        resultsContainer.style.display = 'block';
        
        // Добавляем обработчики кликов
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                const target = this.getAttribute('data-target');
                openSectionAndScroll(section, target);
            });
        });
    } else {
        resultsContainer.innerHTML = `
            <div class="no-results">
                Ничего не найдено 😕<br>
                <small>Попробуйте: "п 48", "ст 5", "гаи", "дтп"</small>
            </div>
        `;
        resultsContainer.style.display = 'block';
    }
}

// 🚫 ЗАКРЫТЬ ПОИСК ПРИ КЛИКЕ ВНЕ
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

// 📱 ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ
function showSection(id) {
    // Скрываем все разделы
    document.querySelectorAll('.section').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });
    
    // Скрываем меню
    const menu = document.getElementById('main-menu');
    if (menu) menu.style.display = 'none';
    
    // Показываем нужное
    if (id === 'main-menu') {
        if (menu) menu.style.display = 'grid';
    } else {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('active');
            section.style.display = 'block';
        }
    }
    
    // Прокрутка вверх
    window.scrollTo(0, 0);
}

// 🎯 ОТКРЫТЬ РАЗДЕЛ И ПРОКРУТИТЬ К ЭЛЕМЕНТУ
function openSectionAndScroll(sectionId, targetElementId) {
    showSection(sectionId);
    
    setTimeout(() => {
        // Раскрываем все аккордеоны в разделе
        const section = document.getElementById(sectionId);
        if (section) {
            const accordions = section.querySelectorAll('details');
            accordions.forEach(acc => acc.setAttribute('open', ''));
        }
        
        // Если есть целевой элемент - скроллим к нему
        if (targetElementId && targetElementId.trim() !== '') {
            const target = document.getElementById(targetElementId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Подсветка на 3 секунды
                const originalBg = target.style.backgroundColor;
                const originalTransition = target.style.transition;
                target.style.transition = 'all 0.3s ease';
                target.style.backgroundColor = '#fef3c7';
                target.style.boxShadow = '0 0 0 4px #fbbf24';
                target.style.borderRadius = '8px';
                
                setTimeout(() => {
                    target.style.backgroundColor = originalBg;
                    target.style.boxShadow = '';
                    target.style.transition = originalTransition;
                }, 3000);
            }
        }
        
        // Скрываем результаты поиска
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) resultsContainer.style.display = 'none';
        
        // Очищаем поле поиска
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
    }, 300);
}

// 📅 ЗАГРУЗКА ДАТЫ ОБНОВЛЕНИЯ
function loadLastCheckDate() {
    fetch('data/legal-base.json?t=' + Date.now())
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('last-check');
            if (el && data.metadata && data.metadata.last_verified) {
                el.innerText = data.metadata.last_verified.split('T')[0];
            }
        })
        .catch(() => {
            const el = document.getElementById('last-check');
            if (el) el.innerText = 'Онлайн';
        });
}

// 📱 SERVICE WORKER
function registerServiceWorker() {
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
}

// 📱 PWA: УСТАНОВКА ПРИЛОЖЕНИЯ
let deferredPrompt = null;

function initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('✅ PWA: Готова к установке');
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA: Приложение установлено!');
        deferredPrompt = null;
    });
}

async function installApp() {
    if (!deferredPrompt) {
        alert('📱 Установка недоступна. Используйте меню браузера: «Добавить на главный экран»');
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('✅ PWA: Пользователь установил приложение');
    }
    
    deferredPrompt = null;
}

// 📚 ПОИСК ПО ЗАКОНАМ
function searchLaws() {
    const searchInput = document.getElementById('law-search');
    const resultsContainer = document.getElementById('law-search-results');
    
    if (!searchInput || !resultsContainer) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        return;
    }
    
    const results = [];
    
    document.querySelectorAll('.law-item').forEach(item => {
        const header = item.querySelector('.law-item-header')?.textContent || '';
        const content = item.querySelector('.law-item-content')?.textContent || '';
        const fullText = header + ' ' + content;
        
        if (fullText.toLowerCase().includes(query)) {
            const highlighted = content.substring(0, 150).replace(
                new RegExp(`(${query})`, 'gi'),
                '<span class="law-search-highlight">$1</span>'
            );
            
            results.push({
                title: header.trim(),
                content: highlighted + '...',
                element: item
            });
        }
    });
    
    if (results.length > 0) {
        resultsContainer.innerHTML = results.slice(0, 5).map(r => `
            <div class="law-search-result">
                <div class="law-search-title">${r.title}</div>
                <div class="law-search-text">${r.content}</div>
            </div>
        `).join('');
        resultsContainer.style.display = 'block';
        
        // Добавляем обработчики кликов
        resultsContainer.querySelectorAll('.law-search-result').forEach((item, idx) => {
            item.addEventListener('click', function() {
                scrollToLawItem(idx, query);
            });
        });
    } else {
        resultsContainer.innerHTML = '<div style="padding: 0.5rem; color: var(--text-muted);">Ничего не найдено 😕</div>';
        resultsContainer.style.display = 'block';
    }
}

function scrollToLawItem(index, query) {
    const allItems = document.querySelectorAll('.law-item');
    let matchIndex = 0;
    
    allItems.forEach(item => {
        const header = item.querySelector('.law-item-header')?.textContent || '';
        const content = item.querySelector('.law-item-content')?.textContent || '';
        if ((header + ' ' + content).toLowerCase().includes(query)) {
            if (matchIndex === index) {
                item.closest('.law-accordion')?.setAttribute('open', '');
                item.setAttribute('open', '');
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                item.style.backgroundColor = '#fef3c7';
                setTimeout(() => {
                    item.style.backgroundColor = '';
                }, 2000);
            }
            matchIndex++;
        }
    });
    
    const resultsContainer = document.getElementById('law-search-results');
    const searchInput = document.getElementById('law-search');
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (searchInput) searchInput.value = '';
}

// 🖱️ ОБРАБОТЧИКИ СОБЫТИЙ
function initEventListeners() {
    // Кнопки меню
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) showSection(section);
        });
    });
    
    // Кнопки "Назад"
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-back');
            if (target) showSection(target);
        });
    });
    
    // Поиск по законам
    const lawSearch = document.getElementById('law-search');
    if (lawSearch) {
        lawSearch.addEventListener('input', searchLaws);
    }
    
    // Закрытие поиска по законам при клике вне
    document.addEventListener('click', function(e) {
        const lawSearch = document.getElementById('law-search');
        const lawResults = document.getElementById('law-search-results');
        if (lawSearch && lawResults && !lawSearch.contains(e.target) && !lawResults.contains(e.target)) {
            lawResults.style.display = 'none';
        }
    });
}

// 🚀 ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Road Smart Aid загружен!');
    
    // Инициализация
    initEventListeners();
    initPWA();
    registerServiceWorker();
    loadLastCheckDate();
    
    // Показываем главное меню
    showSection('main-menu');
});
