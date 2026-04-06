/* ===================================
   ROAD SMART AID — PRODUCTION JS v9.0
   Профессиональная архитектура
   Оптимизация + Безопасность + a11y
   Совместим с CSS v8.0
   =================================== */

'use strict';

/* 📚 СЛОВАРЬ СИНОНИМОВ ДЛЯ ПОИСКА */
const SEARCH_SYNONYMS = Object.freeze({
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
});

/* 🔍 ДАННЫЕ ДЛЯ УМНОГО ПОИСКА (без дубликатов) */
const SEARCH_DATA = Object.freeze([
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
        section: 'laws',
        title: '📚 Справочник законов',
        keywords: ['законы', 'коап', 'пдд', 'приказ', 'мвд', '264', 'конституция', 'полиция', 'аккордеон'],
        content: 'Полный справочник законов: Приказ МВД №264, КоАП РФ, ПДД РФ, ФЗ О полиции, Конституция РФ'
    }
]);

/* 🔧 УТИЛИТЫ */

/* 🔤 Нормализация запроса */
const normalizeQuery = (query) => {
    let normalized = query.toLowerCase();
    normalized = normalized.replace(/(\bп)\s+(\d+)/gi, '$1. $2');
    normalized = normalized.replace(/(\bст)\s+(\d+)/gi, '$1. $2');
    return normalized.replace(/\s+/g, ' ').trim();
};

/* 🔤 Нормализация текста */
const normalizeText = (text) => text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* 🎯 Безопасное экранирование для RegExp */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* 🎯 Нечёткий поиск (Levenshtein) */
const fuzzyMatch = (query, text, threshold = 0.6) => {
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
    
    return words1.length ? matches / words1.length : 0;
};

/* 📏 Расстояние Левенштейна */
const levenshteinDistance = (str1, str2) => {
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
};

/* 🔍 Подсветка найденного текста (безопасная) */
const highlightText = (text, query) => {
    if (!query || query.length < 2) return text;
    
    const normalizedQuery = normalizeQuery(query);
    const terms = [
        query,
        normalizedQuery,
        ...(SEARCH_SYNONYMS[query] || []),
        ...(SEARCH_SYNONYMS[normalizedQuery] || [])
    ];
    
    let highlighted = text;
    terms.forEach(term => {
        if (term && term.length > 1) {
            const escapedTerm = escapeRegex(term);
            const regex = new RegExp(`(${escapedTerm})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="search-highlight">$1</span>');
        }
    });
    
    return highlighted;
};

/* 🔍 Универсальная функция поиска */
const performSearch = (query, dataSource, maxResults = 10) => {
    if (query.length < 2) return [];
    
    const searchTerms = [query, normalizeQuery(query)];
    Object.keys(SEARCH_SYNONYMS).forEach(key => {
        if (query.includes(key) || SEARCH_SYNONYMS[key].includes(query)) {
            searchTerms.push(...SEARCH_SYNONYMS[key]);
        }
    });
    
    const results = dataSource.filter(item => {
        const searchText = (item.title + ' ' + item.content + ' ' + (item.keywords || []).join(' ')).toLowerCase();
        return searchTerms.some(term => term && searchText.includes(term.toLowerCase()));
    });
    
    return results
        .map(item => ({
            ...item,
            relevance: fuzzyMatch(query, item.content + ' ' + item.title)
        }))
        .filter(item => item.relevance > 0.3)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, maxResults)
        .filter((v, i, a) => a.findIndex(t => t.section === v.section) === i);
};

/* 🎯 ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ПОИСКА */
const renderSearchResults = (results, container, rawQuery, isLawSearch = false) => {
    if (!container) return;
    
    if (results.length > 0) {
        container.innerHTML = results.map(item => {
            const targetId = item.targetElementId || '';
            const itemClass = isLawSearch ? 'law-search-result' : 'search-result-item';
            const titleClass = isLawSearch ? 'law-search-title' : 'search-result-title';
            const textClass = isLawSearch ? 'law-search-text' : 'search-result-text';
            const highlightClass = isLawSearch ? 'law-search-highlight' : 'search-highlight';
            
            return `
                <div class="${itemClass}" data-section="${item.section}" data-target="${targetId}">
                    <div class="${titleClass}">${item.title}</div>
                    <div class="${textClass}">${highlightText(item.content, rawQuery)}</div>
                    ${!isLawSearch ? `<div class="search-result-meta">🔑 Релевантность: ${Math.round((item.relevance || 1) * 100)}%</div>` : ''}
                </div>
            `;
        }).join('');
        container.style.display = 'block';
        container.setAttribute('aria-live', 'polite');
        
        // Добавляем обработчики кликов
        container.querySelectorAll(`.${isLawSearch ? 'law-search-result' : 'search-result-item'}`).forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                const target = this.getAttribute('data-target');
                if (isLawSearch) {
                    const index = Array.from(container.children).indexOf(this);
                    scrollToLawItem(index, rawQuery);
                } else {
                    openSectionAndScroll(section, target);
                }
            });
        });
    } else {
        container.innerHTML = `<div class="no-results">Ничего не найдено 😕<br><small>Попробуйте: "п 48", "ст 5", "гаи", "дтп"</small></div>`;
        container.style.display = 'block';
        container.setAttribute('aria-live', 'polite');
    }
};

/* 🔍 ОСНОВНОЙ ПОИСК (с debounce) */
let searchDebounce;
const onSearchInput = () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results');
        
        if (!searchInput || !resultsContainer) return;
        
        const rawQuery = searchInput.value.trim();
        const query = normalizeQuery(rawQuery);
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            resultsContainer.removeAttribute('aria-live');
            return;
        }
        
        // Поиск по разделам
        const searchDataResults = performSearch(query, SEARCH_DATA);
        
        // Поиск по контенту разделов
        const sectionResults = [];
        document.querySelectorAll('.section').forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('.section-title')?.textContent || '';
            const sectionText = section.textContent?.slice(0, 500) || '';
            
            if (sectionText.toLowerCase().includes(query.toLowerCase())) {
                const relevance = fuzzyMatch(query, sectionText);
                if (relevance > 0.3) {
                    let targetElementId = null;
                    
                    // Приоритет: аккордеоны
                    const summaries = section.querySelectorAll('details summary');
                    for (const [idx, summary] of summaries.entries()) {
                        if (summary.textContent.toLowerCase().includes(query.toLowerCase())) {
                            const parent = summary.closest('details');
                            if (parent && !parent.id) {
                                parent.id = `search-${sectionId}-acc-${idx}-${Date.now()}`;
                            }
                            targetElementId = parent?.id || null;
                            break;
                        }
                    }
                    
                    sectionResults.push({
                        section: sectionId,
                        title: sectionTitle,
                        content: sectionText.slice(0, 150) + '...',
                        relevance,
                        targetElementId
                    });
                }
            }
        });
        
        const allResults = [...searchDataResults, ...sectionResults];
        renderSearchResults(allResults, resultsContainer, rawQuery, false);
    }, 300);
};

/* 🚫 Закрытие поиска при клике вне */
const setupSearchCloseHandler = () => {
    document.addEventListener('click', (e) => {
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results');
        const lawSearch = document.getElementById('law-search');
        const lawResults = document.getElementById('law-search-results');
        
        // Основной поиск
        if (searchInput && resultsContainer) {
            const searchArea = searchInput.closest('header') || searchInput.parentElement;
            if (searchArea && !searchArea.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
                resultsContainer.removeAttribute('aria-live');
            }
        }
        
        // Поиск по законам
        if (lawSearch && lawResults) {
            const lawSearchArea = lawSearch.parentElement;
            if (lawSearchArea && !lawSearchArea.contains(e.target) && !lawResults.contains(e.target)) {
                lawResults.style.display = 'none';
            }
        }
    });
};

/* 📱 ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ */
const showSection = (id) => {
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
        // Фокус на первый элемент меню
        const firstCard = menu.querySelector('.menu-card');
        if (firstCard) firstCard.focus();
    } else {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('active');
            section.style.display = 'block';
            // Фокус на кнопку "Назад"
            const backBtn = section.querySelector('.back-btn');
            if (backBtn) backBtn.focus();
        }
    }
    
    window.scrollTo(0, 0);
};

/* 🎯 Открыть раздел и прокрутить к элементу */
const openSectionAndScroll = (sectionId, targetElementId) => {
    showSection(sectionId);
    
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            // Раскрываем аккордеоны
            section.querySelectorAll('details').forEach(acc => acc.setAttribute('open', ''));
        }
        
        // Скролл к элементу
        if (targetElementId?.trim()) {
            const target = document.getElementById(targetElementId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Подсветка
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
        
        // Скрыть результаты
        const results = document.getElementById('search-results');
        if (results) {
            results.style.display = 'none';
            results.removeAttribute('aria-live');
        }
        
        // Очистить поиск
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
    }, 300);
};

/* 📚 ПОИСК ПО ЗАКОНАМ */
const searchLaws = () => {
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
            const highlighted = content.slice(0, 150).replace(
                new RegExp(`(${escapeRegex(query)})`, 'gi'),
                '<span class="law-search-highlight">$1</span>'
            );
            
            results.push({
                title: header.trim(),
                content: highlighted + '...',
                element: item
            });
        }
    });
    
    renderSearchResults(results.slice(0, 5), resultsContainer, query, true);
};

/* 🎯 Скролл к элементу в законах */
const scrollToLawItem = (index, query) => {
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
                setTimeout(() => { item.style.backgroundColor = ''; }, 2000);
            }
            matchIndex++;
        }
    });
    
    const results = document.getElementById('law-search-results');
    const searchInput = document.getElementById('law-search');
    if (results) results.style.display = 'none';
    if (searchInput) searchInput.value = '';
};

/* 📅 Загрузка даты обновления */
const loadLastCheckDate = () => {
    const el = document.getElementById('last-check');
    if (!el) return;
    
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    
    fetch('data/legal-base.json?t=' + Date.now())
        .then(r => r.json())
        .then(data => {
            if (data.metadata?.last_verified) {
                el.innerText = data.metadata.last_verified.split('T')[0];
            }
        })
        .catch(() => {
            if (window.location.hostname === 'localhost') {
                console.warn('⚠️ Не удалось загрузить legal-base.json');
            }
            el.innerText = 'Онлайн';
        });
};

/* 📱 Service Worker */
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            
            if (window.location.hostname === 'localhost') {
                console.log('✅ SW registered:', registration.scope);
            }
            
            // Обработка обновлений
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            if (window.location.hostname === 'localhost') {
                                console.log('🔄 SW: Доступно обновление!');
                            }
                        }
                    });
                }
            });
            
        } catch (error) {
            if (window.location.hostname === 'localhost') {
                console.warn('⚠️ Service Worker registration failed:', error.message);
            }
        }
    }
};

/* 📱 PWA: Установка */
let deferredPrompt = null;

const initPWA = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (window.location.hostname === 'localhost') {
            console.log('✅ PWA: Готова к установке');
        }
        // Показываем кнопку установки если нужно
        const installBtn = document.querySelector('.menu-card-install');
        if (installBtn) installBtn.style.display = 'flex';
    });
    
    window.addEventListener('appinstalled', () => {
        if (window.location.hostname === 'localhost') {
            console.log('✅ PWA: Приложение установлено!');
        }
        deferredPrompt = null;
    });
};

const installApp = async () => {   
    if (!deferredPrompt) {
        alert('📱 Установка недоступна. Используйте меню браузера: «Добавить на главный экран»');
        return;
    }
       
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted' && window.location.hostname === 'localhost') {
        console.log('✅ PWA: Пользователь установил приложение');
    }
    
    deferredPrompt = null;
};

/* 🖱️ Инициализация обработчиков */
const initEventListeners = () => {
    // Меню
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
    
    // Поиск
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', onSearchInput);
    }
    
    // Поиск по законам
    const lawSearch = document.getElementById('law-search');
    if (lawSearch) {
        lawSearch.addEventListener('input', searchLaws);
    }
    
    // Установка PWA
    const installBtn = document.querySelector('.menu-card-install');
    if (installBtn) {
        installBtn.addEventListener('click', (e) => {
            e.preventDefault();
            installApp();
        });
    }
    
    // Закрытие поиска
    setupSearchCloseHandler();
};

/* 🚀 Инициализация */
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hostname === 'localhost') {
        console.log('✅ Road Smart Aid загружен!');
    }
    
    initEventListeners();
    initPWA();
    registerServiceWorker();
    loadLastCheckDate();
    showSection('main-menu');
   /* 🔄 ПРОВЕРКА ОБНОВЛЕНИЙ БАЗЫ */
const checkLegalBaseUpdate = async () => {
    try {
        const response = await fetch('data/legal-base.json?t=' + Date.now());
        const data = await response.json();
        
        const lastVerified = new Date(data.metadata.last_verified);
        const today = new Date();
        const daysSinceCheck = Math.floor((today - lastVerified) / (1000 * 60 * 60 * 24));
        
        // Если проверка была больше 30 дней назад
        if (daysSinceCheck > 30) {
            console.warn(`⚠️ База законов не проверялась ${daysSinceCheck} дней`);
            
            // Можно показать уведомление пользователю (опционально)
            const footer = document.querySelector('.main-footer');
            if (footer) {
                const notice = document.createElement('p');
                notice.className = 'text-muted text-center';
                notice.style.fontSize = '0.7rem';
                notice.innerHTML = '⚠️ Требуется проверка актуальности законов';
                footer.insertBefore(notice, footer.firstChild);
            }
        }
        
        // Показываем версию в футере (опционально)
        console.log(`📚 Версия базы: ${data.metadata.version}`);
        
    } catch (error) {
        if (window.location.hostname === 'localhost') {
            console.warn('⚠️ Не удалось проверить legal-base.json:', error.message);
        }
    }
};

// Запуск проверки при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // ... существующий код ...
    checkLegalBaseUpdate(); // ← Добавить эту строку
});
});
