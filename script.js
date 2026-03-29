// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('✅ Service Worker зарегистрирован'))
        .catch(err => console.error('❌ Ошибка:', err));
}

// Данные о правах водителя
const driverRights = {
    documents: [
        "Паспорт гражданина РФ",
        "Водительское удостоверение",
        "Свидетельство о регистрации ТС",
        "Полис ОСАГО",
        "Техническое свидетельство"
    ],
    obligations: [
        "Остановиться при требовании инспектора",
        "Предъявить документы",
        "Не скрываться от ДТП",
        "Соблюдать ПДД",
        "Проходить техническое обслуживание"
    ],
    stop_rules: [
        "Инспектор должен вежливо подойти с видимым знаком отличия",
        "Остановка должна быть обоснована",
        "Вы имеете право попросить удостоверение инспектора",
        "Вы можете вести видеозапись",
        "Имеете право на адвоката"
    ],
    accident_steps: [
        "Остановить автомобиль и включить аварийный свет",
        "Установить знак аварийной остановки",
        "Вызвать скорую помощь (103) и ГИБДД (102)",
        "Зафиксировать место ДТП фотографией/видео",
        "Обменяться контактами с другим участником",
        "Получить справку в ГИБДД"
    ]
};

// Обработчик кнопки "Проверить права"
document.getElementById('checkRightsBtn')?.addEventListener('click', () => {
    showModal('📋 Ваши права водителя', formatRights());
});

// Обработчик кнопки "При остановке"
document.getElementById('stopBtn')?.addEventListener('click', () => {
    showModal('🚔 При остановке инспектором', formatStopRules());
});

// Обработчик кнопки "При ДТП"
document.getElementById('accidentBtn')?.addEventListener('click', () => {
    showModal('⚠️ Действия при ДТП', formatAccidentSteps());
});

// Форматирование информации о правах
function formatRights() {
    let html = `
        <div class="rights-section">
            <h3>📋 Необходимые документы:</h3>
            <ul>
                ${driverRights.documents.map(doc => `<li>${doc}</li>`).join('')}
            </ul>
        </div>
        <div class="rights-section">
            <h3>✅ Ваши обязанности:</h3>
            <ul>
                ${driverRights.obligations.map(obl => `<li>${obl}</li>`).join('')}
            </ul>
        </div>
    `;
    return html;
}

// Форматирование правил при остановке
function formatStopRules() {
    let html = `
        <div class="info-section">
            <h3>🚔 Правила при остановке:</h3>
            <ul>
                ${driverRights.stop_rules.map(rule => `<li>${rule}</li>`).join('')}
            </ul>
        </div>
    `;
    return html;
}

// Форматирование действий при ДТП
function formatAccidentSteps() {
    let html = `
        <div class="info-section">
            <h3>⚠️ Действия при ДТП:</h3>
            <ol>
                ${driverRights.accident_steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
        <div class="info-box">
            📞 Скорая помощь: <strong>103</strong><br>
            🚔 ГИБДД: <strong>102</strong><br>
            🆘 Единый номер: <strong>112</strong>
        </div>
    `;
    return html;
}

// Отображение модального окна
function showModal(title, content) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    modal.style.display = 'block';
}

// Закрытие модального окна
const modal = document.getElementById('infoModal');
const closeBtn = document.querySelector('.close');

closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚗 Road Smart Aid готов к использованию');
});
