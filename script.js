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
  return {
    rotation: 0,
    mirrored: false,
    color: randomColor(),
  }
});

let dragState = {
  active: false,
  figureEl: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0
};
const board = document.querySelector('.puzzleBord');
const itemsContainer = document.querySelector('.itemsContainer');
let boardCells = board.querySelectorAll('.cell');

function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};
// визначаємо розмір сітки для фігури
function gridSizeY(item) {
  return Math.max(...item.map(([_, y]) => y)) + 1;
};
function gridSizeX(item) {
  return Math.max(...item.map(([x, _]) => x)) + 1;
};

function normalizeShape(shape) {
  let minX = Math.min(...shape.map(p => p[0]));
  let minY = Math.min(...shape.map(p => p[1]));
  return shape.map(([x, y]) => [x - minX, y - minY]);
};

function createFigure(item, i) {
  const color = figureStates[i].color;
  let figure = '';
  item.forEach(([x, y]) => {
    figure += `<div class="cell" style=" background-color: ${color}; grid-area: ${y + 1} / ${x + 1}"></div>`;
  });

  return `<div id='${i}' class="item" style="grid-template-rows: repeat(${gridSizeX(item)}, var(--fraction)); grid-template-columns: repeat(${gridSizeY(item)}, var(--fraction));">
  ${figure}
  </div>`;

};

function rotateShape90(shape) {
  let maxX = Math.max(...shape.map(p => p[0]));
  let rotated = shape.map(([x, y]) => [y, maxX - x]);
  return normalizeShape(rotated);
};

function mirrorShape(shape) {
  let maxX = Math.max(...shape.map(p => p[0]));
  let mirrored = shape.map(([x, y]) => [maxX - x, y]);
  return normalizeShape(mirrored);
};

// додаємо фігури на сторінку
puzzleShapes.forEach((shape, i) => {
  itemsContainer.innerHTML += createFigure(shape, i);
});

let shapes = document.querySelectorAll('.item');
let rotateBtn = document.querySelector('#rotateBtn');
let mirrorBtn = document.querySelector('#mirrorBtn');

let selectedShape;
let selectedShapeId = null;

rotateBtn.addEventListener('click', () => {
  if (selectedShapeId === null) return;

  puzzleShapes[selectedShapeId] = rotateShape90(puzzleShapes[selectedShapeId]);
  let inner = '';
  puzzleShapes[selectedShapeId].forEach(([x, y]) => {
    inner += `<div class="cell" style="background-color: ${figureStates[selectedShapeId].color}; grid-area: ${x + 1} / ${y + 1}"></div>`;
  });
  selectedShape.innerHTML = inner;
  selectedShape.style.gridTemplateRows = `repeat(${gridSizeX(puzzleShapes[selectedShapeId])}, var(--fraction))`;
  selectedShape.style.gridTemplateColumns = `repeat(${gridSizeY(puzzleShapes[selectedShapeId])}, var(--fraction))`;

});

mirrorBtn.addEventListener('click', () => {
  if (selectedShapeId === null) return;

  puzzleShapes[selectedShapeId] = mirrorShape(puzzleShapes[selectedShapeId]);
  let inner = '';
  puzzleShapes[selectedShapeId].forEach(([x, y]) => {
    inner += `<div class="cell" style=" background-color: ${figureStates[selectedShapeId].color}; grid-area: ${x + 1} / ${y + 1}"></div>`;
  });
  selectedShape.innerHTML = inner;
  selectedShape.style.gridTemplateRows = `repeat(${gridSizeX(puzzleShapes[selectedShapeId])}, var(--fraction))`;
  selectedShape.style.gridTemplateColumns = `repeat(${gridSizeY(puzzleShapes[selectedShapeId])}, var(--fraction))`;

});

function selectShape(shape) {
  // прибираємо клас selected з усіх
  shapes.forEach(s => s.classList.remove('selected'));

  // ставимо клас на поточний
  shape.classList.add('selected');

  // оновлюємо глобальні змінні
  selectedShape = shape;
  selectedShapeId = shape.id;
}

shapes.forEach((shape) => {
  shape.addEventListener('click', (e) => {
    selectShape(e.currentTarget);
  });
});
// обробка перетягування
shapes.forEach(shape => {
  shape.addEventListener('pointerdown', e => {
    e.preventDefault();

    selectShape(shape);

    dragState.active = true;
    dragState.figureEl = shape;

    const rect = shape.getBoundingClientRect();

    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;

    shape.style.position = 'fixed';
    shape.style.left = rect.left + 'px';
    shape.style.top = rect.top + 'px';
    shape.style.zIndex = 1000;

    shape.setPointerCapture(e.pointerId);
    shape.classList.add('dragging');
  });
});

document.addEventListener('pointermove', e => {
  if (!dragState.active || !dragState.figureEl) return;

  dragState.figureEl.style.left =
    e.clientX - dragState.offsetX + 'px';
  dragState.figureEl.style.top =
    e.clientY - dragState.offsetY + 'px';
});
function getCellUnderFigureCorner(figure) {
  const figRect = figure.getBoundingClientRect();
  const cells = board.querySelectorAll('.cell');

  const cornerX = figRect.left;
  const cornerY = figRect.top;

  for (let cell of cells) {
    const rect = cell.getBoundingClientRect();

    if (
      cornerX >= rect.left &&
      cornerX <= rect.right &&
      cornerY >= rect.top &&
      cornerY <= rect.bottom
    ) {
      return cell;
    }
  }

  return null;
}


document.addEventListener('pointerup', e => {
  if (!dragState.active || !dragState.figureEl) return;

  const fig = dragState.figureEl;

  const cell = getCellUnderFigureCorner(fig);

  if (cell) {
    snapFigureToCell(fig, cell);
  }

  fig.releasePointerCapture(e.pointerId);
  fig.classList.remove('dragging');
  fig.style.zIndex = '';

  dragState.active = false;
  dragState.figureEl = null;
});




// знаходимо комірку, по якій клікнули
board.addEventListener('click', (e) => {
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

function snapFigureToCell(figure, cell) {
  const cellRect = cell.getBoundingClientRect();
  figure.style.left = cellRect.left + 'px';
  figure.style.top = cellRect.top + 'px';
}


