let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuizData() {
  try {
    const response = await fetch("/quiz");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; // Assuming the data is nested under 'data' key
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return [];
  }
}

function startQuiz() {
  document.getElementById("start-button").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
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
    button.onclick = () => checkAnswer(option, question.correctanswer);
    optionsContainer.appendChild(button);
  });

  document.getElementById("next-button").style.display = "none";
}

function checkAnswer(selected, correct) {
  console.log("Selected:", selected);
  console.log("Correct:", correct);
  if (selected === correct) {
    score++;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Result</h2>
    <p>You got ${score} out of ${quizData.length} correct!</p>
    <button id="reset-button">Try Again</button>
  `;
  document.getElementById("reset-button").addEventListener("click", resetQuiz);
}

function resetQuiz() {
  document.getElementById("start-button").style.display = "block";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("quiz-container").innerHTML = `
    <h1>Capital Quiz</h1>
    <p id="question"></p>
    <div id="options"></div>
    <button id="next-button" style="display: none;">Next Question</button>
  `;
  startQuiz();
}

document.getElementById("start-button").addEventListener("click", async () => {
  quizData = await fetchQuizData();
  startQuiz();
});

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