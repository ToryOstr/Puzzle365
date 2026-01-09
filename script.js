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
let figureStates = puzzleShapes.map(() => {
  return { rotation: 0,
  mirrored: false}
});

function normalizeShape(shape) {
  let minX = Math.min(...shape.map(p => p[0]));
  let minY = Math.min(...shape.map(p => p[1]));
  return shape.map(([x, y]) => [x - minX, y - minY]);
};

// визначаємо розмір сітки для фігури

function gridSizeY(item) {
  return Math.max(...item.map(([_, y]) => y)) + 1;
};
function gridSizeX(item) {
  return Math.max(...item.map(([x, _]) => x)) + 1;
};
function createFigure(item, i) {
  let figure = '';
  item.forEach(([x, y]) => {
    figure += `<div class="cell" style="grid-area: ${x + 1} / ${y + 1}"></div>`;
  });

  return `<div id='${i}' class="item" draggable="true" style="grid-template-rows: repeat(${gridSizeX(item)}, var(--fraction)); grid-template-columns: repeat(${gridSizeY(item)}, var(--fraction));">
  ${figure}
</div>`;

};
function rotateShape90(shape, id) {
  let maxX = Math.max(...shape.map(p => p[0]));
  let rotated = shape.map(([x, y]) => [y, maxX - x]);

  return normalizeShape(rotated);
};

function mirrorShape(shape) {
  let maxX = Math.max(...shape.map(p => p[0]));
  let mirrored = shape.map(([x, y]) => [maxX - x, y]);
  
  return normalizeShape(mirrored);
};


const itemsContainer = document.querySelector('.itemsContainer');

//cтворюємо фігуру
// додаємо фігури на сторінку
puzzleShapes.forEach((shape,i) => {
  itemsContainer.innerHTML += createFigure(shape, i);
});

let shapes = document.querySelectorAll('.item');
let rotateBtn = document.querySelector('#rotateBtn');
let mirrorBtn = document.querySelector('#mirrorBtn');

let currentShape;
let selectedShapeId = null;

rotateBtn.addEventListener('click', () => {
  if (selectedShapeId === null) return;

  puzzleShapes[selectedShapeId] = rotateShape90(puzzleShapes[selectedShapeId]);
  let inner = '';
  puzzleShapes[selectedShapeId].forEach(([x, y]) => {
    inner += `<div class="cell" style="grid-area: ${x + 1} / ${y + 1}"></div>`;
  });
  currentShape.innerHTML = inner;
  currentShape.style.gridTemplateRows = `repeat(${gridSizeX(puzzleShapes[selectedShapeId])}, var(--fraction))`;
  currentShape.style.gridTemplateColumns = `repeat(${gridSizeY(puzzleShapes[selectedShapeId])}, var(--fraction))`;

});

mirrorBtn.addEventListener('click', () => {
  if (selectedShapeId === null) return;

  puzzleShapes[selectedShapeId] = mirrorShape(puzzleShapes[selectedShapeId]);
  let inner = '';
  puzzleShapes[selectedShapeId].forEach(([x, y]) => {
    inner += `<div class="cell" style="grid-area: ${x + 1} / ${y + 1}"></div>`;
  });
  currentShape.innerHTML = inner;
  currentShape.style.gridTemplateRows = `repeat(${gridSizeX(puzzleShapes[selectedShapeId])}, var(--fraction))`;
  currentShape.style.gridTemplateColumns = `repeat(${gridSizeY(puzzleShapes[selectedShapeId])}, var(--fraction))`;

});

shapes.forEach((shape) => {
  shape.addEventListener('click', (e) => {
    currentShape = e.currentTarget;
    selectedShapeId = currentShape.id;

  });
});

// знаходимо комірку, по якій клікнули
document.addEventListener('click', (e) => {
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
