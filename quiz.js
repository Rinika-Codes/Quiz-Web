const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const goHomeBtn = document.getElementById("goHomeBtn");

const startPage = document.getElementById("startPage");
const quizPage = document.getElementById("quizPage");
const scorePage = document.getElementById("scorePage");

const questionContainer = document.getElementById("questionContainer");
const progress = document.getElementById("progress");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const scoreText = document.getElementById("scoreText");

let questions = [];
let currentIndex = 0;
let answers = {};

// Fetch questions from API
async function fetchQuestions() {
  let res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
  let data = await res.json();

  questions = data.results.map((q) => {
    let options = [...q.incorrect_answers];
    options.splice(Math.floor(Math.random() * 4), 0, q.correct_answer);
    return {
      question: q.question,
      options: options,
      correct: q.correct_answer
    };
  });
}

// Start Quiz
startBtn.addEventListener("click", async () => {
  await fetchQuestions();
  startPage.classList.add("hidden");
  quizPage.classList.remove("hidden");
  currentIndex = 0;
  showQuestion();
});

// Show Question
function showQuestion() {
  let q = questions[currentIndex];
  progress.textContent = `Question ${currentIndex + 1}/10`;

  let html = `<h3>${q.question}</h3>`;
  q.options.forEach((opt, i) => {
    let checked = answers[currentIndex] === opt ? "checked" : "";
    html += `<label><input type="radio" name="option" value="${opt}" ${checked}> ${opt}</label><br>`;
  });
  questionContainer.innerHTML = html;

  prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
  nextBtn.classList.toggle("hidden", currentIndex === questions.length - 1);
  submitBtn.classList.toggle("hidden", currentIndex !== questions.length - 1);
}

// Save selected answer
function saveAnswer() {
  let selected = document.querySelector('input[name="option"]:checked');
  if (selected) answers[currentIndex] = selected.value;
}

nextBtn.addEventListener("click", () => {
  saveAnswer();
  currentIndex++;
  showQuestion();
});

prevBtn.addEventListener("click", () => {
  saveAnswer();
  currentIndex--;
  showQuestion();
});

submitBtn.addEventListener("click", () => {
  saveAnswer();
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });
  quizPage.classList.add("hidden");
  scorePage.classList.remove("hidden");
  scoreText.textContent = `You scored ${score} out of 10 🎉`;
});

// Restart & Home
restartBtn.addEventListener("click", () => location.reload());
homeBtn.addEventListener("click", () => location.reload());
goHomeBtn.addEventListener("click", () => location.reload());