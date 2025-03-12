let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuizData() {
  const response = await fetch("/quiz");
  const data = await response.json();
  return data;
}

async function startQuiz() {
  quizData = await fetchQuizData();
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    showResult();
    return;
  }

  const question = quizData[currentQuestionIndex];
  document.getElementById("question").innerText = `What is the capital of ${question.country}?`;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  question.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.onclick = () => checkAnswer(option, question.correctAnswer);
    optionsContainer.appendChild(button);
  });

  document.getElementById("next-button").style.display = "none";
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    document.getElementById("next-button").style.display = "block";
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Result</h2>
    <p>You got ${score} out of ${quizData.length} correct!</p>
  `;
}

document.getElementById("next-button").addEventListener("click", showQuestion);

startQuiz();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}