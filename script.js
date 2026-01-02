document.addEventListener('click', e => {
  
  const cell = e.target.closest('.cell');

  if(!cell) return;

  document.addEventListener('click', (e) => {
    // знаходимо комірку, по якій клікнули
    const cell = e.target.closest('.cell');
    if (!cell) return;

    // ігноруємо порожні комірки
    if (cell.classList.contains('empty')) return;

    // визначаємо тип секції
    const row = cell.closest('.row');
    if (!row) return;

    const isMonth = row.classList.contains('months');
    const isNumber = row.classList.contains('days');

    if (!isMonth && !isNumber) return;

    // шукаємо вже заблоковану комірку В МЕЖАХ ТІЄЇ Ж СЕКЦІЇ
    const sectionSelector = isMonth ? '.row.months' : '.row.days';
    const section = cell.closest('.puzzleBord');

    const prevBlocked = section.querySelector(
      `${sectionSelector} .cell.blocked`
    );

    // якщо була інша заблокована — знімаємо
    if (prevBlocked && prevBlocked !== cell) {
      prevBlocked.classList.remove('blocked');
    }

    // блокуємо поточну
    cell.classList.add('blocked');
  });

});