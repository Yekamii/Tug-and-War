/* =========================================================
   TUG & WAR — XI კლასი — შეჯიბრი 1
   GAME LOGIC
========================================================= */


// =========================================================
// ELEMENTS
// =========================================================

const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");

const timerElement = document.getElementById("timer");

const scoreLeft = document.getElementById("score-left");
const scoreRight = document.getElementById("score-right");

const statusLeft = document.getElementById("status-left");
const statusRight = document.getElementById("status-right");

const answersLeft = document.getElementById("answers-left");
const answersRight = document.getElementById("answers-right");

const ropeMarker = document.getElementById("rope-marker");

const roundStatus = document.getElementById("round-status");
const resultMessage = document.getElementById("result-message");

const fullscreenButton = document.getElementById("fullscreen-btn");

const teamLeft = document.querySelector(".team-left");
const teamRight = document.querySelector(".team-right");


// =========================================================
// GAME STATE
// =========================================================

let currentQuestion = 0;

let leftScore = 0;
let rightScore = 0;

let leftAnswered = false;
let rightAnswered = false;

let timer = 15;
let timerInterval = null;

let ropePosition = 0;

let gameFinished = false;


// =========================================================
// GAME SETTINGS
// =========================================================

const totalQuestions = 6;
const timePerQuestion = 15;


// =========================================================
// LOAD QUESTION
// =========================================================

function loadQuestion() {

    if (currentQuestion >= totalQuestions) {

        finishGame();

        return;
    }


    const question = questions[currentQuestion];


    // -----------------------------------------------------
    // RESET ROUND
    // -----------------------------------------------------

    leftAnswered = false;
    rightAnswered = false;

    timer = timePerQuestion;

    clearInterval(timerInterval);


    // -----------------------------------------------------
    // QUESTION NUMBER
    // -----------------------------------------------------

    questionNumber.textContent = currentQuestion + 1;


    // -----------------------------------------------------
    // QUESTION TEXT
    // -----------------------------------------------------

    questionText.textContent = question.question;


    // -----------------------------------------------------
    // STATUS
    // -----------------------------------------------------

    statusLeft.textContent = "მზად ხართ?";
    statusRight.textContent = "მზად ხართ?";

    statusLeft.className = "answer-status";
    statusRight.className = "answer-status";


    roundStatus.textContent = "ორივე ჯგუფი მზად არის";

    resultMessage.textContent =
        "უპასუხეთ კითხვას რაც შეიძლება სწრაფად";


    // -----------------------------------------------------
    // ANSWERS
    // -----------------------------------------------------

    createAnswers(
        answersLeft,
        "left",
        question
    );

    createAnswers(
        answersRight,
        "right",
        question
    );


    // -----------------------------------------------------
    // TIMER
    // -----------------------------------------------------

    updateTimer();

    startTimer();
}


// =========================================================
// CREATE ANSWERS
// =========================================================

function createAnswers(container, team, question) {

    container.innerHTML = "";


    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "answer-btn";

        button.textContent = answer;


        button.addEventListener("click", () => {

            handleAnswer(
                team,
                index,
                button,
                question
            );

        });


        container.appendChild(button);

    });

}


// =========================================================
// HANDLE ANSWER
// =========================================================

function handleAnswer(
    team,
    answerIndex,
    clickedButton,
    question
) {

    // -----------------------------------------------------
    // PREVENT SECOND ANSWER FROM SAME TEAM
    // -----------------------------------------------------

    if (team === "left" && leftAnswered) {
        return;
    }

    if (team === "right" && rightAnswered) {
        return;
    }


    // -----------------------------------------------------
    // MARK TEAM AS ANSWERED
    // -----------------------------------------------------

    if (team === "left") {

        leftAnswered = true;

    } else {

        rightAnswered = true;

    }


    // -----------------------------------------------------
    // DISABLE TEAM ANSWERS
    // -----------------------------------------------------

    disableTeamAnswers(team);


    // -----------------------------------------------------
    // CHECK ANSWER
    // -----------------------------------------------------

    const isCorrect =
        answerIndex === question.correct;


    if (isCorrect) {

        clickedButton.classList.add("correct");

        handleCorrectAnswer(team);

    } else {

        clickedButton.classList.add("wrong");

        handleWrongAnswer(team, question);

    }


    // -----------------------------------------------------
    // CHECK ROUND
    // -----------------------------------------------------

    checkRoundComplete();
}


// =========================================================
// CORRECT ANSWER
// =========================================================

function handleCorrectAnswer(team) {

    if (team === "left") {

        leftScore++;

        scoreLeft.textContent = leftScore;

        statusLeft.textContent = "სწორი პასუხი";

        statusLeft.classList.add("correct-status");

        roundStatus.textContent =
            "I ჯგუფმა სწორად უპასუხა";

        moveRope("left");

    } else {

        rightScore++;

        scoreRight.textContent = rightScore;

        statusRight.textContent = "სწორი პასუხი";

        statusRight.classList.add("correct-status");

        roundStatus.textContent =
            "II ჯგუფმა სწორად უპასუხა";

        moveRope("right");

    }


    resultMessage.textContent =
        "სწორი პასუხი!";
}


// =========================================================
// WRONG ANSWER
// =========================================================

function handleWrongAnswer(team, question) {

    if (team === "left") {

        statusLeft.textContent =
            "არასწორი პასუხი";

    } else {

        statusRight.textContent =
            "არასწორი პასუხი";

    }


    // -----------------------------------------------------
    // SHOW CORRECT ANSWER TO THE OTHER TEAM
    // -----------------------------------------------------

    const otherTeam = team === "left"
        ? "right"
        : "left";


    const otherAnswered =
        otherTeam === "left"
            ? leftAnswered
            : rightAnswered;


    if (!otherAnswered) {

        roundStatus.textContent =
            team === "left"
                ? "I ჯგუფმა ვერ უპასუხა — II ჯგუფის ჯერია"
                : "II ჯგუფმა ვერ უპასუხა — I ჯგუფის ჯერია";

    } else {

        roundStatus.textContent =
            "ორივე ჯგუფმა უპასუხა";

    }


    resultMessage.textContent =
        "პასუხი არასწორია";
}


// =========================================================
// DISABLE TEAM ANSWERS
// =========================================================

function disableTeamAnswers(team) {

    const container =
        team === "left"
            ? answersLeft
            : answersRight;


    const buttons =
        container.querySelectorAll(".answer-btn");


    buttons.forEach(button => {

        button.disabled = true;

    });

}


// =========================================================
// CHECK ROUND COMPLETE
// =========================================================

function checkRoundComplete() {

    if (leftAnswered && rightAnswered) {

        clearInterval(timerInterval);

        roundStatus.textContent =
            "ორივე ჯგუფმა უპასუხა";

        setTimeout(() => {

            nextQuestion();

        }, 1000);

    }

}


// =========================================================
// TIMER
// =========================================================

function startTimer() {

    updateTimer();


    timerInterval = setInterval(() => {

        timer--;

        updateTimer();


        if (timer <= 0) {

            clearInterval(timerInterval);

            handleTimeOut();

        }

    }, 1000);

}


// =========================================================
// UPDATE TIMER
// =========================================================

function updateTimer() {

    timerElement.textContent = timer;


    timerElement.classList.toggle(
        "danger",
        timer <= 5
    );

}


// =========================================================
// TIME OUT
// =========================================================

function handleTimeOut() {

    if (leftAnswered && rightAnswered) {
        return;
    }


    if (!leftAnswered) {

        leftAnswered = true;

        disableTeamAnswers("left");

        statusLeft.textContent =
            "დრო ამოიწურა";

    }


    if (!rightAnswered) {

        rightAnswered = true;

        disableTeamAnswers("right");

        statusRight.textContent =
            "დრო ამოიწურა";

    }


    roundStatus.textContent =
        "დრო ამოიწურა";


    resultMessage.textContent =
        "დრო ამოიწურა";


    setTimeout(() => {

        nextQuestion();

    }, 1000);

}


// =========================================================
// NEXT QUESTION
// =========================================================

function nextQuestion() {

    if (gameFinished) {
        return;
    }


    currentQuestion++;


    if (currentQuestion >= totalQuestions) {

        finishGame();

        return;
    }


    loadQuestion();

}


// =========================================================
// ROPE
// =========================================================

function moveRope(team) {

    const movement = 55;


    if (team === "left") {

        ropePosition -= movement;

    } else {

        ropePosition += movement;

    }


    // -----------------------------------------------------
    // LIMIT ROPE MOVEMENT
    // -----------------------------------------------------

    const maxMovement = 180;


    ropePosition = Math.max(
        -maxMovement,
        Math.min(
            maxMovement,
            ropePosition
        )
    );


    // -----------------------------------------------------
    // KEEP MARKER CENTERED AT START
    // -----------------------------------------------------

    ropeMarker.style.transform =
        `translate(calc(-50% + ${ropePosition}px), -50%)`;

}


// =========================================================
// FINISH GAME
// =========================================================

function finishGame() {

    gameFinished = true;

    clearInterval(timerInterval);


    answersLeft.innerHTML = "";
    answersRight.innerHTML = "";


    questionText.textContent =
        "შეჯიბრი დასრულდა";


    questionNumber.textContent =
        totalQuestions;


    roundStatus.textContent =
        "შედეგები";


    // -----------------------------------------------------
    // DETERMINE RESULT
    // -----------------------------------------------------

    if (leftScore > rightScore) {

        teamLeft.classList.add("winner");

        teamRight.classList.add("loser");

        resultMessage.textContent =
            "I ჯგუფმა გაიმარჯვა!";

    }

    else if (rightScore > leftScore) {

        teamRight.classList.add("winner");

        teamLeft.classList.add("loser");

        resultMessage.textContent =
            "II ჯგუფმა გაიმარჯვა!";

    }

    else {

        resultMessage.textContent =
            "ფრე! ორივე ჯგუფმა თანაბარი ქულა დააგროვა.";

    }


    // -----------------------------------------------------
    // END BUTTONS
    // -----------------------------------------------------

    createEndButtons();

}


// =========================================================
// END BUTTONS
// =========================================================

function createEndButtons() {

    const existingButtons =
        document.querySelector(".end-buttons");


    if (existingButtons) {
        existingButtons.remove();
    }


    const buttonsContainer =
        document.createElement("div");


    buttonsContainer.className =
        "end-buttons";


    // -----------------------------------------------------
    // BACK BUTTON
    // -----------------------------------------------------

    const backButton =
        document.createElement("button");


    backButton.type = "button";

    backButton.className =
        "end-btn back-btn";

    backButton.textContent =
        "← უკან";


    backButton.addEventListener("click", () => {

        window.location.href =
            "grade11.html";

    });


    // -----------------------------------------------------
    // RESTART BUTTON
    // -----------------------------------------------------

    const restartButton =
        document.createElement("button");


    restartButton.type = "button";

    restartButton.className =
        "end-btn restart-btn";

    restartButton.textContent =
        "↻ თავიდან";


    restartButton.addEventListener("click", () => {

        window.location.reload();

    });


    buttonsContainer.appendChild(
        backButton
    );

    buttonsContainer.appendChild(
        restartButton
    );


    document.body.appendChild(
        buttonsContainer
    );

}


// =========================================================
// FULLSCREEN
// =========================================================

fullscreenButton.addEventListener(
    "click",
    () => {

        const gameElement =
            document.querySelector(".game");


        if (!document.fullscreenElement) {

            if (gameElement.requestFullscreen) {

                gameElement.requestFullscreen();

            }

        } else {

            if (document.exitFullscreen) {

                document.exitFullscreen();

            }

        }

    }
);


// =========================================================
// START GAME
// =========================================================

loadQuestion();