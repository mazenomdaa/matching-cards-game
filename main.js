let btn = document.querySelector("#btn");
let difficultyChosen = "easy";
let allDifficultyButtons = document.querySelectorAll(".toggle-btn");
let cards = [];
let highestScore = localStorage.getItem("highestScore") || 0;
let flippedCards = [];
let matchedCards = [];
let score = 0;
let shuffledCards = [];
let allCardElements = document.querySelectorAll(".card");
let message = document.getElementById("game-over-message");

document.getElementById("highest-score").textContent = highestScore;

function setActiveButton(button) {
  allDifficultyButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

function easy() {
  difficultyChosen = "easy";
  setActiveButton(document.querySelector(".toggle-btn:nth-child(2)"));
}

function medium() {
  difficultyChosen = "medium";
  setActiveButton(document.querySelector(".toggle-btn:nth-child(3)"));
}

function hard() {
  difficultyChosen = "hard";
  setActiveButton(document.querySelector(".toggle-btn:nth-child(4)"));
}

function play() {
  message.classList.remove("congrats-color");
  message.classList.remove("gameover-color");
  allCards = generateCards(difficultyChosen);
  shuffledCards = shuffleArray(allCards);
  renderCards(shuffledCards);
  updateScore();

  document.getElementById("start-page").style.display = "none";
  document.getElementById("game-page").style.display = "block";
  document.getElementById("game-over-page").style.display = "none";

  flipAllCards();
  setTimeout(() => {
    resetAllCards();
  }, 3000);
}

function exit() {
  location.reload();
}

document.querySelector(".start-button").addEventListener("click", () => {
  initializeActiveButton();
});

function generateCards(difficulty) {
  let cardCount;

  if (difficulty === "easy") {
    cardCount = 12;
    score = 200;
  }
  if (difficulty === "medium") {
    cardCount = 16;
    score = 280;
  }
  if (difficulty === "hard") {
    cardCount = 24;
    score = 400;
  }

  let colors = [
    "url(assets/clubs/Barcelona.jpeg)",
    "url(assets/clubs/Real.jpeg)",
    "url(assets/clubs/Bayern.jpeg)",
    "url(assets/clubs/Liverpool.jpeg)",
    "url(assets/clubs/City.jpeg)",
    "url(assets/clubs/United.jpeg)",
    "url(assets/clubs/Arsenal.jpeg)",
    "url(assets/clubs/Milan.jpeg)",
    "url(assets/clubs/Inter.jpeg)",
    "url(assets/clubs/Chelsea.jpeg)",
    "url(assets/clubs/Atletico.jpeg)",
    "url(assets/clubs/Roma.jpeg)",
  ];
  let selectedColors = colors.slice(0, cardCount / 2);
  let allCards = [...selectedColors, ...selectedColors];

  return allCards;
}

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderCards(cards) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  cards.forEach((cardValue, index) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", index);
    let back = document.createElement("div");
    back.classList.add("back");
    back.style.backgroundImage = cardValue;
    card.addEventListener("click", () => flipCard(card, cardValue, index));

    gameBoard.appendChild(card);
    card.appendChild(back);
  });
}

function flipAllCards() {
  const allCardElements = document.querySelectorAll(".card");
  allCardElements.forEach((card) => {
    card.classList.add("flipped");
  });
}

function resetAllCards() {
  const allCardElements = document.querySelectorAll(".card");
  allCardElements.forEach((card) => {
    card.classList.remove("flipped");
  });
}

function flipCard(card, cardValue, index) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCards.push({ card, cardValue, index });

    if (flippedCards.length === 2) {
      setTimeout(() => checkMatch(), 500);
    }
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.cardValue === secondCard.cardValue) {
    matchedCards.push(firstCard, secondCard);
  } else {
    setTimeout(() => {
      firstCard.card.classList.remove("flipped");
      secondCard.card.classList.remove("flipped");
    }, 500);
  }
  score -= 10;
  updateScore();
  flippedCards = [];

  if (matchedCards.length === shuffledCards.length) {
    gameOver("Congrats!🥳 \nYou Won!");
    message.classList.add("congrats-color");
  }

  if (score <= 0) {
    gameOver("Game Over!😢 You Lost!");
    message.classList.add("gameover-color");
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
}
function gameOver(message) {
  document.getElementById("game-page").style.display = "none";
  document.getElementById("game-over-page").style.display = "block";

  document.getElementById("game-over-message").textContent = message;
  document.getElementById("final-score").textContent = score;

  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore);
    document.getElementById("highest-score").textContent = highestScore;
    document.getElementById("game-over-highest-score").textContent =
      highestScore;
  } else
    document.getElementById("game-over-highest-score").textContent =
      highestScore;
}
