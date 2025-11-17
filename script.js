// Получаем элементы
const prizesListEl = document.getElementById('prizesList');
const addPrizeBtn = document.getElementById('addPrizeBtn');
const manualWinnersBlock = document.getElementById('manualWinnersBlock');
const manualWinnersListEl = document.getElementById('manualWinnersList');

const generatePostBtn = document.getElementById('generatePostBtn');
const generateExplainBtn = document.getElementById('generateExplainBtn'); // может быть null
const resetBtn = document.getElementById('resetBtn');
const clearPostBtn = document.getElementById('clearPostBtn');
const copyPostBtn = document.getElementById('copyPostBtn');

const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const endAtInput = document.getElementById('endAtInput');
const channelsInput = document.getElementById('channelsInput');
const emoji2faCheckbox = document.getElementById('emoji2faCheckbox');

const postOutput = document.getElementById('postOutput');
const explainOutput = document.getElementById('explainOutput'); // может быть null
const adminPasswordInput = document.getElementById('adminPasswordInput');
const checkPasswordBtn = document.getElementById('checkPasswordBtn');
const adminPasswordBlock = document.getElementById('adminPasswordBlock');
const manualWinnersContent = document.getElementById('manualWinnersContent');
const sendToBotBtn = document.getElementById('sendToBotBtn');

// Telegram WebApp SDK объект (будет доступен, если страница открыта через бота)
const tg = window.Telegram && window.Telegram.WebApp;
const ADMIN_PASSWORD = 'traxatSUCHEK228';

// Инициализация: по умолчанию 3 места
let prizeCount = 0;
function addPrizeRow(initialPlace, initialPrizeText = '') {
  prizeCount += 1;
  const place = initialPlace ?? prizeCount;

  const row = document.createElement('div');
  row.className = 'prize-row';

  const label = document.createElement('div');
  label.className = 'prize-label';
  label.textContent = `${place} место`;

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Например: 5000₽ на карту';
  input.value = initialPrizeText;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn ghost-btn';
  removeBtn.textContent = '×';
  removeBtn.title = 'Удалить место';

  removeBtn.addEventListener('click', () => {
    row.remove();
    updateManualWinnersInputs();
  });

  row.appendChild(label);
  row.appendChild(input);
  row.appendChild(removeBtn);

  prizesListEl.appendChild(row);

  updateManualWinnersInputs();
}

function initDefaultPrizes() {
  addPrizeRow(1, '');
  addPrizeRow(2, '');
  addPrizeRow(3, '');
}

initDefaultPrizes();

// Обработчик добавления места
addPrizeBtn.addEventListener('click', () => {
  addPrizeRow();
});

// Проверка пароля администратора по кнопке
checkPasswordBtn.addEventListener('click', () => {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    adminPasswordBlock.classList.add('hidden');
    manualWinnersContent.classList.remove('hidden');
  } else {
    alert('Неверный пароль');
    adminPasswordInput.value = '';
  }
});

// Переключение режима честный / "подкрутка" (демо)
const modeInputs = document.querySelectorAll('input[name="winnerMode"]');

modeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    const mode = getSelectedMode();
    if (mode === 'rigged-demo') {
      manualWinnersBlock.classList.remove('hidden');
      adminPasswordBlock.classList.remove('hidden');
      manualWinnersContent.classList.add('hidden');
      adminPasswordInput.value = '';
    } else {
      manualWinnersBlock.classList.add('hidden');
    }
  });
});

// Проверка пароля администратора (live)
adminPasswordInput.addEventListener('input', () => {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    adminPasswordBlock.classList.add('hidden');
    manualWinnersContent.classList.remove('hidden');
  } else {
    manualWinnersContent.classList.add('hidden');
  }
});

function getSelectedMode() {
  const checked = document.querySelector('input[name="winnerMode"]:checked');
  return checked ? checked.value : 'fair';
}

// Обновление полей ручных победителей при изменении списка призов
function updateManualWinnersInputs() {
  const prizeRows = prizesListEl.querySelectorAll('.prize-row');
  const mode = getSelectedMode();

  manualWinnersListEl.innerHTML = '';

  prizeRows.forEach((row, index) => {
    const placeNumber = index + 1;
    const prizeInput = row.querySelector('input');

    const mwRow = document.createElement('div');
    mwRow.className = 'manual-winner-row';

    const placeLabel = document.createElement('div');
    placeLabel.className = 'prize-label';
    placeLabel.textContent = `${placeNumber} место`;

    const winnerInput = document.createElement('input');
    winnerInput.type = 'text';
    winnerInput.placeholder = 'Например: @username или ID';

    // Можно прикрепить prizeInput через dataset, если нужно
    winnerInput.dataset.place = placeNumber;

    mwRow.appendChild(placeLabel);
    mwRow.appendChild(winnerInput);

    manualWinnersListEl.appendChild(mwRow);
  });

  if (mode !== 'rigged-demo') {
    manualWinnersBlock.classList.add('hidden');
  }
}

// Получить текущий список призов
function getPrizes() {
  const rows = prizesListEl.querySelectorAll('.prize-row');
  const prizes = [];

  rows.forEach((row, index) => {
    const input = row.querySelector('input');
    const text = (input.value || '').trim();
    if (text) {
      prizes.push({
        place: index + 1,
        prize: text,
      });
    }
  });

  return prizes;
}

// Получить список ручных победителей для демо "подкрутки"
function getManualWinners() {
  const rows = manualWinnersListEl.querySelectorAll('.manual-winner-row');
  const winners = [];

  rows.forEach((row, index) => {
    const input = row.querySelector('input');
    const value = (input.value || '').trim();
    if (value) {
      winners.push({
        place: index + 1,
        winner: value,
      });
    }
  });

  return winners;
}

// Генерация текста поста
function generatePostText() {
  const title = (titleInput.value || '').trim();
  const description = (descriptionInput.value || '').trim();
  const endAt = (endAtInput.value || '').trim();
  const channelsRaw = (channelsInput.value || '').trim();
  const emoji2fa = emoji2faCheckbox.checked;
  const mode = getSelectedMode();

  const prizes = getPrizes();
  const manualWinners = getManualWinners();

  let textLines = [];

  // Заголовок
  if (title) {
    textLines.push(`🎁 Розыгрыш: ${title}`);
  } else {
    textLines.push('🎁 Розыгрыш');
  }
  textLines.push('');

  // Описание
  if (description) {
    textLines.push(description);
    textLines.push('');
  }

  // Условия
  textLines.push('📌 Условия участия:');

  let numberedCount = 0;

  if (channelsRaw) {
    const channels = channelsRaw
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    if (channels.length > 0) {
      channels.forEach((ch) => {
        numberedCount += 1;
        textLines.push(`${numberedCount}. Подписаться на ${ch}`);
      });
    }
  }

  if (emoji2fa) {
    numberedCount += 1;
    textLines.push(
      `${numberedCount}. Пройти мини-проверку (эмодзи-2FA) в боте розыгрыша`
    );
  }

  if (!channelsRaw && !emoji2fa) {
    textLines.push('— Условия не заданы (пример: подписка на канал, 2FA и т.п.)');
  }

  textLines.push('');

  // Призы
  if (prizes.length > 0) {
    textLines.push('🏆 Призы:');
    prizes.forEach((p) => {
      textLines.push(`${p.place} место — ${p.prize}`);
    });
    textLines.push('');
  }

  // Режим выбора победителей
  if (mode === 'fair') {
    textLines.push('🎲 Режим выбора победителей:');
    textLines.push(
      'Победители определяются случайным образом среди всех, кто выполнил условия участия.'
    );
  } else if (mode === 'rigged-demo') {
    textLines.push('⚠️ Режим выбора победителей: учебная демонстрация "подкрутки".');
    textLines.push(
      'Внимание: в этом демо-режиме победителей выбирает организатор вручную. ' +
      'Используется только в образовательных целях, без обмана участников.'
    );

    if (manualWinners.length > 0) {
      textLines.push('');
      textLines.push('📋 Предустановленные победители (для демонстрации):');
      manualWinners.forEach((w) => {
        textLines.push(`${w.place} место — ${w.winner}`);
      });
    }
  }

  textLines.push('');

  // Дата итогов
  if (endAt) {
    textLines.push(`⏰ Итоги: ${endAt}`);
  }

  textLines.push('');
  textLines.push('👇 Нажми кнопку "Участвовать" в боте, чтобы войти в розыгрыш.');

  return textLines.join('\n');
}

// Генерация пояснительного текста (для защиты/кибербеза)
function generateExplainText() {
  const mode = getSelectedMode();
  const prizes = getPrizes();

  let lines = [];

  lines.push('Пояснение к проекту (для преподавателя / слушателей):');
  lines.push('');

  lines.push(
    '1) Веб-приложение позволяет создавать розыгрыши с условиями участия, ' +
    'перечнем призов и описанием.'
  );
  lines.push(
    '2) Реализовано два режима выбора победителей:'
  );
  lines.push(
    '   • Честный случайный режим — победители выбираются случайно среди участников.'
  );
  lines.push(
    '   • Учебный режим "подкрученного" розыгрыша — победителей задаёт организатор вручную.'
  );
  lines.push('');
  lines.push(
    'Важно: во втором режиме прямо в интерфейсе указано, что это демонстрация "подкрутки". ' +
    'То есть участников не обманывают: режим явно помечен как неслучайный.'
  );
  lines.push('');
  lines.push(
    'Идея кибербезопасности: на практике недобросовестный разработчик может скрыть такой режим ' +
    'в админской части или за секретным доступом, и обычный пользователь не узнает, что результат ' +
    'контролируется вручную.'
  );
  lines.push('');
  lines.push(
    'С помощью этого демо можно показать:'
  );
  lines.push(
    '— насколько просто встроить ручной выбор победителей поверх интерфейса "честного" розыгрыша;'
  );
  lines.push(
    '— почему важны доверие к разработчику, открытый код, аудиты и прозрачные алгоритмы;'
  );
  lines.push(
    '— как пользователь может не заметить разницы между честным и подкрученным розыгрышем, если ' +
    'интерфейс не сообщает об этом честно.'
  );
  lines.push('');

  if (prizes.length > 0) {
    lines.push('В данном примере настроено количество призовых мест: ' + prizes.length + '.');
  }

  lines.push('');
  lines.push(
    'Таким образом, проект демонстрирует не только механику розыгрыша, но и риски злоупотреблений ' +
    'со стороны разработчиков/администраторов.'
  );

  if (mode === 'rigged-demo') {
    lines.push('');
    lines.push(
      'Сейчас выбран режим: учебная демонстрация "подкрутки" (ручной выбор победителей).'
    );
  } else {
    lines.push('');
    lines.push(
      'Сейчас выбран режим: честный случайный розыгрыш.'
    );
  }

  return lines.join('\n');
}

// Кнопка "Сгенерировать пост"
generatePostBtn.addEventListener('click', () => {
  postOutput.value = generatePostText();
});

// Кнопка "Сгенерировать пояснение" (если есть в HTML)
if (generateExplainBtn && explainOutput) {
  generateExplainBtn.addEventListener('click', () => {
    explainOutput.value = generateExplainText();
  });
}

// Кнопка "Сбросить всё"
resetBtn.addEventListener('click', () => {
  titleInput.value = '';
  descriptionInput.value = '';
  endAtInput.value = '';
  channelsInput.value = '';
  emoji2faCheckbox.checked = false;

  prizesListEl.innerHTML = '';
  prizeCount = 0;
  initDefaultPrizes();

  const fairModeInput = document.querySelector('input[name="winnerMode"][value="fair"]');
  if (fairModeInput) fairModeInput.checked = true;

  manualWinnersBlock.classList.add('hidden');
  manualWinnersListEl.innerHTML = '';

  postOutput.value = '';
  if (explainOutput) {
    explainOutput.value = '';
  }
});

// Очистка поста
clearPostBtn.addEventListener('click', () => {
  postOutput.value = '';
});

// Отправка в бота через WebApp
if (sendToBotBtn) {
  sendToBotBtn.addEventListener('click', () => {
    const postText = generatePostText().trim();

    if (!postText) {
      alert('Сначала заполни данные и сгенерируй текст поста');
      return;
    }

    if (!tg) {
      alert('Эта страница должна быть открыта как WebApp внутри Telegram бота.');
      return;
    }

    const title = (titleInput.value || '').trim();
    const description = (descriptionInput.value || '').trim();
    const endAt = (endAtInput.value || '').trim();
    const channelsRaw = (channelsInput.value || '').trim();
    const emoji2fa = emoji2faCheckbox.checked;
    const mode = getSelectedMode();
    const prizes = getPrizes();
    const manualWinners = getManualWinners();

    const channels = channelsRaw
      ? channelsRaw
          .split('\n')
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const payload = {
      postText,
      title,
      description,
      endAt,
      channels,
      emoji2fa,
      mode,
      prizes,
      manualWinners,
    };

    tg.sendData(JSON.stringify(payload));
    tg.close();
  });
}

// Копирование текста поста
copyPostBtn.addEventListener('click', () => {
  if (postOutput.value.trim() === '') {
    alert('Сначала сгенерируй текст поста');
    return;
  }
  navigator.clipboard.writeText(postOutput.value).then(() => {
    alert('Текст скопирован в буфер обмена!');
  }).catch(() => {
    alert('Ошибка при копировании текста');
  });
});
