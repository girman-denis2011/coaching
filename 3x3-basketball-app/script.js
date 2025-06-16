const players = document.querySelectorAll('.player');
const ball = document.getElementById('draggable-ball');
let ballDragging = false;
let draggingElement = null;
let offsetX = 0;
let offsetY = 0;
let attachedPlayer = null;

function startDrag(e, element) {
  draggingElement = element;
  const rect = element.getBoundingClientRect();
  offsetX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  offsetY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
}

function onMove(e) {
  if (!draggingElement) return;
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - offsetX;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - offsetY;
  draggingElement.style.left = `${x}px`;
  draggingElement.style.top = `${y}px`;

  // If dragging player and ball is attached, move ball too
  if (draggingElement.classList.contains('player') && attachedPlayer === draggingElement) {
    ball.style.left = `${x + 10}px`;
    ball.style.top = `${y + 10}px`;
  }
}

function stopDrag() {
  draggingElement = null;
  ballDragging = false;
}

players.forEach(player => {
  player.addEventListener('mousedown', (e) => startDrag(e, player));
  player.addEventListener('touchstart', (e) => startDrag(e, player), { passive: false });
});

ball.addEventListener('mousedown', (e) => {
  ballDragging = true;
  startDrag(e, ball);
});

ball.addEventListener('touchstart', (e) => {
  ballDragging = true;
  startDrag(e, ball);
}, { passive: false });

document.addEventListener('mousemove', (e) => {
  if (draggingElement) onMove(e);
});
document.addEventListener('touchmove', (e) => {
  if (draggingElement) onMove(e);
}, { passive: false });

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

// Detect ball collision with player
function checkBallAttach() {
  if (!ballDragging) return;
  const ballRect = ball.getBoundingClientRect();
  players.forEach(player => {
    const playerRect = player.getBoundingClientRect();
    const overlap = !(
      ballRect.right < playerRect.left ||
      ballRect.left > playerRect.right ||
      ballRect.bottom < playerRect.top ||
      ballRect.top > playerRect.bottom
    );
    if (overlap) {
      attachedPlayer = player;
    }
  });
}

setInterval(checkBallAttach, 30);
