const questionText = document.getElementById("question-text");
const timerText = document.getElementById("timer");
const questionNumber = document.getElementById("question-number");

const leftScoreText = document.getElementById("score-left");
const rightScoreText = document.getElementById("score-right");

const leftAnswers = document.getElementById("answers-left");
const rightAnswers = document.getElementById("answers-right");

const leftStatus = document.getElementById("status-left");
const rightStatus = document.getElementById("status-right");

const ropeMarker = document.getElementById("rope-marker");
const roundStatus = document.getElementById("round-status");
const resultMessage = document.getElementById("result-message");

const fullscreenBtn = document.getElementById("fullscreen-btn");

const leftTeam = document.querySelector(".team-left");
const rightTeam = document.querySelector(".team-right");

let currentQuestion = 0;
let leftScore = 0;
let rightScore = 0;

let leftAnswered = false;
let rightAnswered = false;

let timer = 15;
let timerInterval;

let ropePosition = 0;
let gameFinished = false;

const totalQuestions = 6;
const timePerQuestion = 15;


function loadQuestion() {

  if (currentQuestion >= totalQuestions) {
    finishGame();
    return;
  }

  leftAnswered = false;
  rightAnswered = false;

  timer = timePerQuestion;

  leftStatus.textContent = "მზადაა";
  rightStatus.textContent = "მზადაა";

  leftStatus.className = "answer-status";
  rightStatus.className = "answer-status";

  roundStatus.textContent = "ორივე ჯგუფი პასუხობს";

  questionNumber.textContent = currentQuestion + 1;

  questionText.textContent =
    questions[currentQuestion].question;

  timerText.textContent = timer;

  createAnswers();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    timer--;

    timerText.textContent = timer;

    if (timer <= 0) {

      clearInterval(timerInterval);

      handleTimeout();

    }

  }, 1000);
}


function createAnswers() {

  leftAnswers.innerHTML = "";
  rightAnswers.innerHTML = "";

  const current = questions[currentQuestion];

  current.answers.forEach((answer, index) => {

    const leftButton = document.createElement("button");

    leftButton.className = "answer-btn";

    leftButton.textContent =
      `${String.fromCharCode(65 + index)}) ${answer}`;

    leftButton.addEventListener("click", () => {

      handleAnswer(
        "left",
        index,
        leftButton
      );

    });

    leftAnswers.appendChild(leftButton);


    const rightButton = document.createElement("button");

    rightButton.className = "answer-btn";

    rightButton.textContent =
      `${String.fromCharCode(65 + index)}) ${answer}`;

    rightButton.addEventListener("click", () => {

      handleAnswer(
        "right",
        index,
        rightButton
      );

    });

    rightAnswers.appendChild(rightButton);

  });
}


function handleAnswer(
  team,
  selectedAnswer,
  selectedButton
) {

  if (gameFinished) return;

  if (team === "left" && leftAnswered) return;

  if (team === "right" && rightAnswered) return;


  const correctAnswer =
    questions[currentQuestion].correct;

  const isCorrect =
    selectedAnswer === correctAnswer;


  if (team === "left") {

    leftAnswered = true;

    disableTeamAnswers(leftAnswers);

    if (isCorrect) {

      leftScore++;

      leftScoreText.textContent =
        leftScore;

      selectedButton.classList.add("correct");

      leftStatus.textContent =
        "სწორია ✓";

      leftStatus.classList.add("correct");

      moveRope("left");

    } else {

      selectedButton.classList.add("wrong");

      leftStatus.textContent =
        "არასწორია ✕";

      leftStatus.classList.add("wrong");

      if (!rightAnswered) {

        rightStatus.textContent =
          "ახლა II ჯგუფის ჯერია";

      }

    }

  }


  if (team === "right") {

    rightAnswered = true;

    disableTeamAnswers(rightAnswers);

    if (isCorrect) {

      rightScore++;

      rightScoreText.textContent =
        rightScore;

      selectedButton.classList.add("correct");

      rightStatus.textContent =
        "სწორია ✓";

      rightStatus.classList.add("correct");

      moveRope("right");

    } else {

      selectedButton.classList.add("wrong");

      rightStatus.textContent =
        "არასწორია ✕";

      rightStatus.classList.add("wrong");

      if (!leftAnswered) {

        leftStatus.textContent =
          "ახლა I ჯგუფის ჯერია";

      }

    }

  }


  checkRoundComplete();

}


function disableTeamAnswers(container) {

  const buttons =
    container.querySelectorAll(".answer-btn");

  buttons.forEach(button => {

    button.disabled = true;

  });

}


function checkRoundComplete() {

  if (leftAnswered && rightAnswered) {

    clearInterval(timerInterval);

    setTimeout(() => {

      currentQuestion++;

      loadQuestion();

    }, 900);

  }

}


function handleTimeout() {

  if (gameFinished) return;


  if (!leftAnswered) {

    leftAnswered = true;

    leftStatus.textContent =
      "დრო ამოიწურა";

    leftStatus.classList.add("wrong");

    disableTeamAnswers(leftAnswers);

  }


  if (!rightAnswered) {

    rightAnswered = true;

    rightStatus.textContent =
      "დრო ამოიწურა";

    rightStatus.classList.add("wrong");

    disableTeamAnswers(rightAnswers);

  }


  setTimeout(() => {

    currentQuestion++;

    loadQuestion();

  }, 900);

}


function moveRope(team) {

  const movement = 55;


  if (team === "left") {

    ropePosition -= movement;

  }


  if (team === "right") {

    ropePosition += movement;

  }


  ropePosition =
    Math.max(
      -180,
      Math.min(180, ropePosition)
    );


  ropeMarker.style.transform =
    `translate(calc(-50% + ${ropePosition}px), -50%)`;

}


function finishGame() {

  clearInterval(timerInterval);

  gameFinished = true;

  leftAnswers.innerHTML = "";
  rightAnswers.innerHTML = "";

  questionText.textContent =
    "შეჯიბრი დასრულდა";

  questionNumber.textContent =
    totalQuestions;

  timerText.textContent = "—";

  roundStatus.textContent =
    "საბოლოო შედეგი";


  leftStatus.textContent =
    `${leftScore} ქულა`;

  rightStatus.textContent =
    `${rightScore} ქულა`;

  leftStatus.className =
    "answer-status";

  rightStatus.className =
    "answer-status";


  if (leftScore > rightScore) {

    resultMessage.textContent =
      "I ჯგუფი იმარჯვებს!";

    leftTeam.classList.add("winner");

    rightTeam.classList.add("loser");

    ropePosition = -180;

  } else if (rightScore > leftScore) {

    resultMessage.textContent =
      "II ჯგუფი იმარჯვებს!";

    rightTeam.classList.add("winner");

    leftTeam.classList.add("loser");

    ropePosition = 180;

  } else {

    resultMessage.textContent =
      "ფრე!";

    ropePosition = 0;

  }


  ropeMarker.style.transform =
    `translate(calc(-50% + ${ropePosition}px), -50%)`;


  const buttonsContainer =
    document.createElement("div");

  buttonsContainer.className =
    "end-buttons";


  const backButton =
    document.createElement("button");

  backButton.className =
    "game-btn";

  backButton.textContent =
    "← უკან";

  backButton.addEventListener("click", () => {

    window.location.href =
      "grade12.html";

  });


  const restartButton =
    document.createElement("button");

  restartButton.className =
    "game-btn";

  restartButton.textContent =
    "↻ თავიდან";

  restartButton.addEventListener("click", () => {

    window.location.reload();

  });


  buttonsContainer.appendChild(backButton);

  buttonsContainer.appendChild(restartButton);


  document
    .querySelector(".game-footer")
    .appendChild(buttonsContainer);

}


if (fullscreenBtn) {

  fullscreenBtn.addEventListener("click", () => {

    const game =
      document.querySelector(".game");


    if (!document.fullscreenElement) {

      game.requestFullscreen();

    } else {

      document.exitFullscreen();

    }

  });

}


loadQuestion();