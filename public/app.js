let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch quiz data from the server
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

// Start the quiz
function startQuiz() {
  document.getElementById("start-button").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("manage-questions").style.display = "none"; // Hide question management section
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

// Display the current question
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
    button.onclick = () => checkAnswer(option, question.correctanswer); // Use correctanswer (all lowercase)
    optionsContainer.appendChild(button);
  });

  document.getElementById("next-button").style.display = "none";
}

// Check the user's answer
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

// Show the quiz result
function showResult() {
  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Result</h2>
    <p>You got ${score} out of ${quizData.length} correct!</p>
    <button id="reset-button">Try Again</button>
  `;
  document.getElementById("reset-button").addEventListener("click", resetQuiz);
}

// Reset the quiz
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

// Add a new question to the database
async function addQuestion(country, capital, options) {
  try {
    const response = await fetch("/quiz/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country, correctanswer: capital, options }),
    });
    if (!response.ok) {
      throw new Error('Failed to add question');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding question:', error);
  }
}

// Delete a question from the database
async function deleteQuestion(id) {
  try {
    const response = await fetch(`/quiz/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error('Failed to delete question');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting question:', error);
  }
}

// Render the list of current questions
async function renderQuestionList() {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = "";

  quizData.forEach((question, index) => {
    const questionItem = document.createElement("div");
    questionItem.className = "question-item";
    questionItem.innerHTML = `
      <p>${index + 1}. ${question.country} - ${question.correctanswer}</p>
      <button onclick="handleDeleteQuestion('${question.id}')">Delete</button>
    `;
    questionList.appendChild(questionItem);
  });
}

// Handle form submission for adding a new question
async function handleAddQuestion(event) {
  event.preventDefault();
  const country = document.getElementById("country").value;
  const capital = document.getElementById("capital").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;

  const options = [capital, option1, option2, option3]; // Include user-provided options

  if (country && capital && option1 && option2 && option3) {
    await addQuestion(country, capital, options);
    quizData = await fetchQuizData(); // Refresh the quiz data
    renderQuestionList(); // Update the question list
    document.getElementById("add-question-form").reset(); // Clear the form
  } else {
    alert("Please fill in all fields.");
  }
}

// Handle deleting a question
async function handleDeleteQuestion(id) {
  await deleteQuestion(id);
  quizData = await fetchQuizData(); // Refresh the quiz data
  renderQuestionList(); // Update the question list
}

// Toggle the visibility of the question management section
function toggleManageQuestions() {
  const manageQuestionsSection = document.getElementById("manage-questions");
  if (manageQuestionsSection.style.display === "none") {
    manageQuestionsSection.style.display = "block";
  } else {
    manageQuestionsSection.style.display = "none";
  }
}

// Initialize the app
async function initializeApp() {
  quizData = await fetchQuizData();
  renderQuestionList();
}

// Call the initializeApp function
initializeApp();

// Event listeners
document.getElementById("start-button").addEventListener("click", async () => {
  quizData = await fetchQuizData();
  startQuiz();
});

document.getElementById("add-question-form").addEventListener("submit", handleAddQuestion);

document.getElementById("manage-questions-button").addEventListener("click", toggleManageQuestions);

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