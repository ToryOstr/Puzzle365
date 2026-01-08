const puzzleShapes = [
  [
    [0, 0], [1, 0],
    [0, 1],
    [0, 2], [1, 2],
  ],
  [
    [0, 0], [1, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [0, 0], [1, 0],
    [0, 1], [1, 1],
    [0, 2],
  ],
  [
    [0, 0],
    [0, 1], [1, 1],
    [1, 2],
  ],
  [
    [0, 0], [1, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [0, 0],
    [0, 1], [1, 1],
    [0, 2],
  ],
  [
    [0, 0], [1, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [0, 0],
    [0, 1], [1, 1],
    [0, 2],
  ],
  [
    [0, 0],
    [0, 1], [1, 1],
  ],
  [
    [0, 0],
    [0, 1], [1, 1],
    [1, 2],
  ],

];

const itemsContainer = document.querySelector('.itemsContainer');

// визначаємо розмір сітки для фігури
function gridSizeY(item) {
  return Math.max(...item.map(([_, y]) => y)) + 1;
};
function gridSizeX(item) {
  return Math.max(...item.map(([x, _]) => x)) + 1;
};

//cтворюємо фігуру
function createFigure(item) {
  let figure = '';
  item.forEach(([x, y]) => {
    figure += `<div class="cell" style="grid-area: ${x + 1} / ${y + 1}"></div>`;
  });

  return `<div class="item" style="grid-template-rows: repeat(${gridSizeX(item)}, var(--fraction)); grid-template-columns: repeat(${gridSizeY(item)}, var(--fraction));">
  ${figure}
</div>`;

};
// додаємо фігури на сторінку
puzzleShapes.forEach(shape => {
  itemsContainer.innerHTML += createFigure(shape);
});

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

