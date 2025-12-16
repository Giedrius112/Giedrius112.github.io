document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const resultBox = document.getElementById("formResult");
  const popup = document.getElementById("successPopup");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // ❗ stabdo puslapio persikrovimą

    // 1. Surenkam duomenis
    const data = {
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      ratingInfo: Number(document.getElementById("ratingInfo").value),
      ratingSmooth: Number(document.getElementById("ratingSmooth").value),
      ratingFind: Number(document.getElementById("ratingFind").value)
    };

    // 2. Console log (4a.i)
    console.log("Formos duomenys:", data);

    // 3. Vidurkis (5 punktas)
    const avg =
      (data.ratingInfo + data.ratingSmooth + data.ratingFind) / 3;

    const avgRounded = avg.toFixed(1);

    // 4. Atvaizdavimas po forma (4a.ii + 5)
    resultBox.style.display = "block";
    resultBox.innerHTML = `
      <strong>Vardas:</strong> ${data.name}<br>
      <strong>Pavardė:</strong> ${data.surname}<br>
      <strong>El. paštas:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
      <strong>Tel. numeris:</strong> ${data.phone}<br>
      <strong>Adresas:</strong> ${data.address}<br><br>
      <strong>${data.name} ${data.surname}:</strong> vidurkis ${avgRounded}
    `;

    // 5. Pop-up (6 punktas)
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);

    // (nebūtina, bet gražu)
    form.reset();
  });
});

const board = document.getElementById("gameBoard");
const startBtn = document.getElementById("startGame");
const resetBtn = document.getElementById("resetGame");
const difficulty = document.getElementById("difficulty");

const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const timerEl = document.getElementById("timer");
const winMessage = document.getElementById("winMessage");

const bestEasyEl = document.getElementById("bestEasy");
const bestHardEl = document.getElementById("bestHard");

let cards = [];
let flipped = [];
let moves = 0;
let pairs = 0;
let timer = 0;
let timerInterval = null;
let lockBoard = false;

const icons = ["🍎","🍌","🍇","🍉","🍒","🥝","🍍","🥥","🍑","🍋","🍓","🍐"];

/* ===== localStorage ===== */

function loadBestScores() {
  bestEasyEl.textContent = localStorage.getItem("best-easy") || "–";
  bestHardEl.textContent = localStorage.getItem("best-hard") || "–";
}

function saveBestScore() {
  const key = `best-${difficulty.value}`;
  const best = localStorage.getItem(key);

  if (!best || moves < best) {
    localStorage.setItem(key, moves);
  }

  loadBestScores();
}

/* ===== Timer ===== */

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = "Laikas: 0 s";

  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = `Laikas: ${timer} s`;
  }, 1000);
}

/* ===== Game logic ===== */

function generateCards() {
  board.innerHTML = "";
  winMessage.classList.add("hidden");

  moves = 0;
  pairs = 0;
  flipped = [];
  lockBoard = false;

  movesEl.textContent = "0";
  pairsEl.textContent = "0";

  const size = difficulty.value === "easy" ? 6 : 12;
  const selectedIcons = icons.slice(0, size);
  cards = [...selectedIcons, ...selectedIcons]
    .sort(() => Math.random() - 0.5);

  board.style.gridTemplateColumns =
    difficulty.value === "easy" ? "repeat(4, 1fr)" : "repeat(6, 1fr)";

  cards.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.textContent = "?";

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });

  startTimer();
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.icon;
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;
  lockBoard = true;

  if (a.dataset.icon === b.dataset.icon) {
    a.classList.add("matched");
    b.classList.add("matched");
    pairs++;
    pairsEl.textContent = pairs;
    flipped = [];
    lockBoard = false;

    if (pairs === cards.length / 2) {
      clearInterval(timerInterval);
      winMessage.classList.remove("hidden");
      saveBestScore();
    }
  } else {
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      a.textContent = "?";
      b.textContent = "?";
      flipped = [];
      lockBoard = false;
    }, 1000);
  }
}

/* ===== Events ===== */

startBtn.addEventListener("click", generateCards);
resetBtn.addEventListener("click", generateCards);

document.addEventListener("DOMContentLoaded", loadBestScores);
